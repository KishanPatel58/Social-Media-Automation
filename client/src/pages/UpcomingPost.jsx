import React, { useContext, useState, useEffect, useRef } from "react";
import { themeContext } from "../context/theme/ThemeContext";
import {
    CalendarDaysIcon,
    Pencil,
    Trash2,
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import { PLATFORMS } from "../assets/assets";

const UpcomingPost = () => {
    const { theme } = useContext(themeContext);
    const [posts, setPosts] = useState([]);

    // ── Edit Modal State ────────────────────────────────────
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        content: "",
        scheduledFor: "",
        mediaType: "",
        platforms: [],
    });

    // Media handling
    const [currentMediaUrl, setCurrentMediaUrl] = useState(""); // existing media from DB
    const [newMediaFile, setNewMediaFile] = useState(null); // newly selected file
    const [newMediaPreview, setNewMediaPreview] = useState(""); // local preview URL
    const [removeMedia, setRemoveMedia] = useState(false); // user clicked "remove"

    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const scheduled = posts.filter((post) => post.status === "scheduled");
    const linkedinPosts = scheduled.filter((post) =>
        post.platforms?.includes("linkedin")
    );

    const instagramPosts = scheduled.filter((post) =>
        post.platforms?.includes("instagram")
    );
    const totalUpcoming = linkedinPosts.length + instagramPosts.length;

    const fetchPosts = async () => {
        try {
            const { data } = await api.get("/api/posts");
            setPosts(data);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    useEffect(() => {
        (async () => await fetchPosts())();

        const interval = setInterval(async () => await fetchPosts(), 10000);

        return () => clearInterval(interval);
    }, []);

    // Cleanup object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);
        };
    }, [newMediaPreview]);

    // ── Delete (platform-aware) ─────────────────────────────
    const handleDelete = async (post, platformToRemove) => {
        const platforms = post.platforms || [];
        const isOnlyPlatform = platforms.length === 1 && platforms[0] === platformToRemove;
        const remainingPlatforms = platforms.filter((p) => p !== platformToRemove);

        const confirmMsg = isOnlyPlatform
            ? "Are you sure you want to delete this post?"
            : `Remove this post from ${platformToRemove}? It will still appear on the other platform(s).`;

        if (!window.confirm(confirmMsg)) return;

        try {
            if (isOnlyPlatform || remainingPlatforms.length === 0) {
                // Fully delete the post
                await api.delete(`/api/posts/delete/${post._id}`);
                toast.success("Post deleted successfully");
            } else {
                // Only remove the platform from the post
                const data = new FormData();
                data.append("content", post.content || "");
                data.append(
                    "scheduledFor",
                    new Date(post.scheduledFor).toISOString()
                );
                data.append("platforms", JSON.stringify(remainingPlatforms));

                if (post.mediaType) {
                    data.append("mediaType", post.mediaType);
                }

                await api.put(`/api/posts/update/${post._id}`, data);
                toast.success(`Removed from ${platformToRemove}`);
            }

            fetchPosts();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to delete / update post"
            );
        }
    };

    // ── Open Edit Modal ─────────────────────────────────────
    const handleEdit = (post) => {
        setEditingPost(post);

        const date = post.scheduledFor
            ? new Date(post.scheduledFor)
            : new Date();
        const localDatetime = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);

        setFormData({
            content: post.content || "",
            scheduledFor: localDatetime,
            mediaType: post.mediaType || "",
            platforms: post.platforms || [],
        });

        setCurrentMediaUrl(post.mediaUrl || "");
        setNewMediaFile(null);
        setNewMediaPreview("");
        setRemoveMedia(false);

        setIsEditOpen(true);
    };

    // ── Close Modal ─────────────────────────────────────────
    const closeEditModal = () => {
        if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);

        setIsEditOpen(false);
        setEditingPost(null);
        setFormData({
            content: "",
            scheduledFor: "",
            mediaType: "",
            platforms: [],
        });
        setCurrentMediaUrl("");
        setNewMediaFile(null);
        setNewMediaPreview("");
        setRemoveMedia(false);
    };

    // ── Handle Form Change ──────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ── Toggle Platform ─────────────────────────────────────
    const togglePlatform = (platformId) => {
        setFormData((prev) => {
            const exists = prev.platforms.includes(platformId);
            return {
                ...prev,
                platforms: exists
                    ? prev.platforms.filter((p) => p !== platformId)
                    : [...prev.platforms, platformId],
            };
        });
    };

    // ── Handle File Select ──────────────────────────────────
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            toast.error("Only image or video files are allowed");
            return;
        }

        // Max size example: 20 MB
        if (file.size > 20 * 1024 * 1024) {
            toast.error("File size must be under 20 MB");
            return;
        }

        // Clear previous preview
        if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);

        const previewUrl = URL.createObjectURL(file);
        setNewMediaFile(file);
        setNewMediaPreview(previewUrl);
        setRemoveMedia(false); // new file replaces the "remove" action

        // Auto-detect mediaType
        if (file.type.startsWith("image/")) {
            setFormData((prev) => ({ ...prev, mediaType: "image" }));
        } else if (file.type.startsWith("video/")) {
            setFormData((prev) => ({ ...prev, mediaType: "video" }));
        }
    };

    // ── Remove Media ────────────────────────────────────────
    const handleRemoveMedia = () => {
        if (newMediaPreview) URL.revokeObjectURL(newMediaPreview);

        setNewMediaFile(null);
        setNewMediaPreview("");
        setRemoveMedia(true);
        setFormData((prev) => ({ ...prev, mediaType: "" }));

        // reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ── What to show in preview ─────────────────────────────
    const displayMediaUrl = newMediaPreview
        ? newMediaPreview
        : removeMedia
            ? ""
            : currentMediaUrl;

    const displayMediaType = newMediaFile
        ? newMediaFile.type.startsWith("video/")
            ? "video"
            : "image"
        : removeMedia
            ? ""
            : formData.mediaType;

    // ── Save / Update Post ──────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingPost?._id) return;

        if (!formData.content.trim()) {
            toast.error("Content cannot be empty");
            return;
        }

        setIsSaving(true);

        try {
            const data = new FormData();

            data.append("content", formData.content.trim());
            data.append(
                "scheduledFor",
                new Date(formData.scheduledFor).toISOString()
            );
            data.append("platforms", JSON.stringify(formData.platforms));

            if (formData.mediaType) {
                data.append("mediaType", formData.mediaType);
            }

            // User selected a new file
            if (newMediaFile) {
                data.append("media", newMediaFile);
            }

            // User explicitly removed media
            if (removeMedia && !newMediaFile) {
                data.append("removeMedia", "true");
            }
            await api.put(`/api/posts/update/${editingPost._id}`, data);

            toast.success("Post updated successfully");
            closeEditModal();
            fetchPosts();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to update post"
            );
        } finally {
            setIsSaving(false);
        }
    };

    // ── Render Post List ────────────────────────────────────
    const renderPostList = (platformPosts, platform) => {
        if (platformPosts.length === 0) {
            return (
                <div
                    className={`
            py-10 text-center text-sm
            ${theme === "light" ? "text-slate-400" : "text-slate-500"}
          `}
                >
                    Upcoming Post Not Found
                </div>
            );
        }

        return platformPosts.map((post, idx) => (
            <div
                key={post._id || idx}
                className={`
          px-5 py-4 transition-colors border-b last:border-b-0
          ${theme === "light"
                        ? "hover:bg-slate-50/60 border-slate-100"
                        : "hover:bg-[#1a1a1a] border-[#ffffff08]"
                    }
        `}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 items-center">
                        {post.platforms?.map((pl) => {
                            const meta = PLATFORMS.find((platform) => platform.id === pl);
                            return meta ? (
                                <meta.icon
                                    key={pl}
                                    className={`
                    size-3.5
                    ${theme === "light" ? "text-slate-400" : "text-slate-500"}
                  `}
                                />
                            ) : null;
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        {post.mediaType && (
                            <span
                                className={`
                  text-xs border px-1.5 py-0.5 rounded-md font-semibold capitalize
                  ${theme === "light"
                                        ? "bg-slate-100 text-slate-600 border-slate-200"
                                        : "bg-[#1a1a1a] text-slate-300 border-[#ffffff12]"
                                    }
                `}
                            >
                                {post.mediaType}
                            </span>
                        )}

                        <span
                            className={`
                text-xs
                ${theme === "light" ? "text-slate-400" : "text-slate-500"}
              `}
                        >
                            {new Date(post.scheduledFor).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5 ml-1">
                            <button
                                onClick={() => handleEdit(post)}
                                title="Edit"
                                className={`
                  p-1.5 rounded-md transition-colors
                  ${theme === "light"
                                        ? "hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                                        : "hover:bg-[#1e2a3a] text-slate-500 hover:text-blue-400"
                                    }
                `}
                            >
                                <Pencil className="size-3.5" />
                            </button>

                            <button
                                onClick={() => handleDelete(post, platform)}
                                title={`Remove from ${platform}`}
                                className={`
                  p-1.5 rounded-md transition-colors
                  ${theme === "light"
                                        ? "hover:bg-red-50 text-slate-400 hover:text-red-600"
                                        : "hover:bg-[#2a1a1a] text-slate-500 hover:text-red-400"
                                    }
                `}
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                <p
                    className={`
            text-sm line-clamp-2 max-w-md
            ${theme === "light" ? "text-slate-500" : "text-slate-300"}
          `}
                >
                    {post.content}
                </p>
            </div>
        ));
    };

    return (
        <>
            <div
                className={`
          rounded-2xl border overflow-hidden
          ${theme === "light"
                        ? "bg-white border-slate-200"
                        : "bg-[#111111] border-[#ffffff10]"
                    }
        `}
            >
                {/* Header */}
                <div
                    className={`
            flex items-center gap-2.5 px-5 py-4 border-b
            ${theme === "light" ? "border-slate-100" : "border-[#ffffff10]"}
          `}
                >
                    <CalendarDaysIcon
                        className={`
              size-4
              ${theme === "light" ? "text-zinc-500" : "text-zinc-400"}
            `}
                    />
                    <h3
                        className={`
              text-sm
              ${theme === "light" ? "text-slate-900" : "text-white"}
            `}
                    >
                        Upcoming
                    </h3>
                    <span
                        className={`
              ml-auto text-xs font-bold px-2 py-0.5 rounded-full
              ${theme === "light"
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-[#1a1a1a] text-zinc-300"
                            }
            `}
                    >
                        {totalUpcoming}
                    </span>
                </div>

                {/* Split by Platform */}
                <div className="flex max-h-72 overflow-hidden">
                    {/* LinkedIn Column */}
                    <div
                        className={`
              w-1/2 flex flex-col border-r overflow-y-auto
              ${theme === "light" ? "border-slate-100" : "border-[#ffffff10]"}
            `}
                    >
                        <div
                            className={`
                sticky top-0 z-10 flex items-center justify-center gap-2
                px-4 py-3 text-sm font-medium border-b
                ${theme === "light"
                                    ? "bg-white border-slate-100 text-slate-800"
                                    : "bg-[#111111] border-[#ffffff10] text-white"
                                }
              `}
                        >
                            LinkedIn
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-4"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <span
                                className={`
                  text-xs font-bold px-1.5 py-0.5 rounded-full
                  ${theme === "light"
                                        ? "bg-zinc-100 text-zinc-600"
                                        : "bg-[#1a1a1a] text-zinc-400"
                                    }
                `}
                            >
                                {linkedinPosts.length}
                            </span>
                        </div>
                        <div className="flex-1">{renderPostList(linkedinPosts, "linkedin")}</div>
                    </div>

                    {/* Instagram Column */}
                    <div className="w-1/2 flex flex-col overflow-y-auto">
                        <div
                            className={`
                sticky top-0 z-10 flex items-center justify-center gap-2
                px-4 py-3 text-sm font-medium border-b
                ${theme === "light"
                                    ? "bg-white border-slate-100 text-slate-800"
                                    : "bg-[#111111] border-[#ffffff10] text-white"
                                }
              `}
                        >
                            Instagram
                            <SiInstagram className="size-4" />
                            <span
                                className={`
                  text-xs font-bold px-1.5 py-0.5 rounded-full
                  ${theme === "light"
                                        ? "bg-zinc-100 text-zinc-600"
                                        : "bg-[#1a1a1a] text-zinc-400"
                                    }
                `}
                            >
                                {instagramPosts.length}
                            </span>
                        </div>
                        <div className="flex-1">{renderPostList(instagramPosts, "instagram")}</div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════ EDIT MODAL ═══════════════════════ */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeEditModal}
                    />

                    {/* Modal Box */}
                    <div
                        className={`
              relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl
              ${theme === "light"
                                ? "bg-white border-slate-200"
                                : "bg-[#111111] border-[#ffffff15]"
                            }
            `}
                    >
                        {/* Modal Header */}
                        <div
                            className={`
                sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b
                ${theme === "light"
                                    ? "bg-white border-slate-100"
                                    : "bg-[#111111] border-[#ffffff10]"
                                }
              `}
                        >
                            <h3
                                className={`
                  text-base font-semibold
                  ${theme === "light" ? "text-slate-900" : "text-white"}
                `}
                            >
                                Edit Post
                            </h3>
                            <button
                                onClick={closeEditModal}
                                className={`
                  p-1.5 rounded-lg transition-colors
                  ${theme === "light"
                                        ? "hover:bg-slate-100 text-slate-500"
                                        : "hover:bg-[#1a1a1a] text-slate-400"
                                    }
                `}
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            {/* Content */}
                            <div>
                                <label
                                    className={`
                    block text-xs font-medium mb-1.5
                    ${theme === "light" ? "text-slate-600" : "text-slate-400"}
                  `}
                                >
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    className={`
                    w-full px-3 py-2.5 rounded-xl text-sm resize-none outline-none border
                    ${theme === "light"
                                            ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
                                            : "bg-[#1a1a1a] border-[#ffffff12] text-slate-200 focus:border-blue-500"
                                        }
                  `}
                                    placeholder="Write your post content..."
                                />
                            </div>

                            {/* Scheduled For */}
                            <div>
                                <label
                                    className={`
                    block text-xs font-medium mb-1.5
                    ${theme === "light" ? "text-slate-600" : "text-slate-400"}
                  `}
                                >
                                    Scheduled For
                                </label>
                                <input
                                    type="datetime-local"
                                    name="scheduledFor"
                                    value={formData.scheduledFor}
                                    onChange={handleChange}
                                    required
                                    className={`
                    w-full px-3 py-2.5 rounded-xl text-sm outline-none border
                    ${theme === "light"
                                            ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-400"
                                            : "bg-[#1a1a1a] border-[#ffffff12] text-slate-200 focus:border-blue-500"
                                        }
                  `}
                                />
                            </div>

                            {/* ── Media Section ─────────────────────────── */}
                            <div>
                                <label
                                    className={`
                    block text-xs font-medium mb-1.5
                    ${theme === "light" ? "text-slate-600" : "text-slate-400"}
                  `}
                                >
                                    Media {displayMediaType && `(${displayMediaType})`}
                                </label>

                                {/* Preview */}
                                {displayMediaUrl ? (
                                    <div className="relative mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-[#ffffff12]">
                                        {displayMediaType === "video" ? (
                                            <video
                                                src={displayMediaUrl}
                                                controls
                                                className="w-full max-h-48 object-contain bg-black"
                                            />
                                        ) : (
                                            <img
                                                src={displayMediaUrl}
                                                alt="Post media"
                                                className="w-full max-h-48 object-contain bg-slate-100 dark:bg-[#1a1a1a]"
                                            />
                                        )}

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={handleRemoveMedia}
                                            title="Remove media"
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`
                      mb-3 flex flex-col items-center justify-center gap-2
                      py-8 rounded-xl border-2 border-dashed
                      ${theme === "light"
                                                ? "border-slate-200 bg-slate-50 text-slate-400"
                                                : "border-[#ffffff15] bg-[#1a1a1a] text-slate-500"
                                            }
                    `}
                                    >
                                        <ImageIcon className="size-8 opacity-50" />
                                        <span className="text-xs">No media attached</span>
                                    </div>
                                )}

                                {/* Upload button */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                      flex-1 flex items-center justify-center gap-2
                      px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors
                      ${theme === "light"
                                                ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                : "bg-[#1a1a1a] border-[#ffffff12] text-slate-300 hover:bg-[#222]"
                                            }
                    `}
                                    >
                                        <Upload className="size-4" />
                                        {displayMediaUrl ? "Replace Media" : "Upload Media"}
                                    </button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Platforms */}
                            <div>
                                <label
                                    className={`
                    block text-xs font-medium mb-1.5
                    ${theme === "light" ? "text-slate-600" : "text-slate-400"}
                  `}
                                >
                                    Platforms
                                </label>
                                <div className="flex gap-2">
                                    {["linkedin", "instagram"].map((pl) => {
                                        const active = formData.platforms.includes(pl);
                                        return (
                                            <button
                                                key={pl}
                                                type="button"
                                                onClick={() => togglePlatform(pl)}
                                                className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                          border transition-colors capitalize
                          ${active
                                                        ? theme === "light"
                                                            ? "bg-blue-50 border-blue-300 text-blue-700"
                                                            : "bg-blue-900/30 border-blue-500 text-blue-300"
                                                        : theme === "light"
                                                            ? "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                                                            : "bg-[#1a1a1a] border-[#ffffff12] text-slate-400 hover:border-[#ffffff25]"
                                                    }
                        `}
                                            >
                                                {pl}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={isSaving}
                                    className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${theme === "light"
                                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            : "bg-[#1a1a1a] text-slate-300 hover:bg-[#222]"
                                        }
                  `}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`
                    px-5 py-2 rounded-xl text-sm font-medium text-white
                    bg-blue-600 hover:bg-blue-700 transition-colors
                    disabled:opacity-60 disabled:cursor-not-allowed
                  `}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingPost;