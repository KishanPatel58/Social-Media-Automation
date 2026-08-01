import React, { useContext, useEffect, useState } from "react";
import { themeContext } from "../context/theme/ThemeContext";
import { SendIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { SiInstagram } from "@icons-pack/react-simple-icons";
import { PLATFORMS } from "../assets/assets";

const PublishedPost = () => {
  const { theme } = useContext(themeContext);
  const [posts, setPosts] = useState([]);

  const published = posts.filter((post) => post.status === "published");

  const linkedinPosts = published.filter(
    (post) => post.platforms?.includes("linkedin")
  );

  const instagramPosts = published.filter(
    (post) => post.platforms?.includes("instagram")
  );

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

  const renderPostList = (platformPosts) => {
    if (platformPosts.length === 0) {
      return (
        <div
          className={`
            py-10 text-center text-sm
            ${theme === "light" ? "text-slate-400" : "text-slate-500"}
          `}
        >
          No published posts yet
        </div>
      );
    }

    return platformPosts.map((post, idx) => (
      <div
        key={post._id || idx}
        className={`
          px-5 py-4 transition-colors border-b last:border-b-0
          ${
            theme === "light"
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
                  ${
                    theme === "light"
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
              {new Date(post.scheduledFor || post.publishedAt || post.createdAt).toLocaleString()}
            </span>
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
    <div
      className={`
        rounded-2xl border overflow-hidden
        ${
          theme === "light"
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
        <SendIcon
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
          Published
        </h3>
        <span
          className={`
            ml-auto text-xs font-bold px-2 py-0.5 rounded-full
            ${
              theme === "light"
                ? "bg-zinc-100 text-zinc-700"
                : "bg-[#1a1a1a] text-zinc-300"
            }
          `}
        >
          {published.length}
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
              ${
                theme === "light"
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
                ${
                  theme === "light"
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-[#1a1a1a] text-zinc-400"
                }
              `}
            >
              {linkedinPosts.length}
            </span>
          </div>
          <div className="flex-1">{renderPostList(linkedinPosts)}</div>
        </div>

        {/* Instagram Column */}
        <div className="w-1/2 flex flex-col overflow-y-auto">
          <div
            className={`
              sticky top-0 z-10 flex items-center justify-center gap-2
              px-4 py-3 text-sm font-medium border-b
              ${
                theme === "light"
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
                ${
                  theme === "light"
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-[#1a1a1a] text-zinc-400"
                }
              `}
            >
              {instagramPosts.length}
            </span>
          </div>
          <div className="flex-1">{renderPostList(instagramPosts)}</div>
        </div>
      </div>
    </div>
  );
};

export default PublishedPost;