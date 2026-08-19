import React, { useContext, useEffect, useState } from "react";
import { themeContext } from "../../context/theme/ThemeContext";
import {
  CalendarIcon,
  ClockIcon,
  HistoryIcon,
  Loader2Icon,
  TimerIcon,
  Trash2Icon,
  Wand2Icon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { PLATFORMS } from "../../assets/assets";

const RecentGeneration = () => {
  const { theme } = useContext(themeContext);

  const [generations, setGenerations] = useState([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [activeScheduler, setActiveScheduler] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setGenerations(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this generation?"
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await api.delete(`/api/posts/generations/${id}`);
      setGenerations((prev) => prev.filter((g) => g._id !== id));
      toast.success("Generation deleted");

      // close modal if user was scheduling the deleted one
      if (activeScheduler?._id === id) {
        setActiveScheduler(null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSchedule = async () => {
    if (!activeScheduler) return;

    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform.");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time.");
      return;
    }

    const scheduledFor = new Date(
      `${scheduledDate}T${scheduledTime}`
    ).toISOString();

    setScheduling(true);
    try {
      await api.post("/api/posts", {
        content: activeScheduler.content,
        mediaUrl: activeScheduler.mediaUrl,
        mediaType: activeScheduler.mediaType,
        platforms: selectedPlatforms,
        scheduledFor,
        status: "scheduled",
      });
      toast.success("AI-Post Scheduled!");
      setActiveScheduler(null);
      setSelectedPlatforms([]);
      setScheduledDate("");
      setScheduledTime("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setScheduling(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  return (
    <div
      className={`
        space-y-6 pt-12
        ${theme === "light" ? "border-slate-100" : "border-[#ffffff10]"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between
          ${theme === "light" ? "text-slate-600" : "text-slate-300"}
        `}
      >
        <div className="flex items-center gap-2">
          <HistoryIcon className="size-5" />
          <h2 className="text-xl">Recent Generations</h2>
        </div>

        <span
          className={`
            text-sm px-2
            ${
              theme === "light"
                ? "text-slate-500 bg-slate-50"
                : "text-slate-400 bg-[#1a1a1a]"
            }
          `}
        >
          {generations.length} total
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {generations.map((generation) => (
          <div
            key={generation._id}
            className={`
              group rounded-2xl border p-5 transition-all
              ${
                theme === "light"
                  ? "bg-white border-slate-100 hover:border-red-200"
                  : "bg-[#111111] border-[#ffffff10] hover:border-red-500/30"
              }
            `}
          >
            <div className="flex flex-col h-full space-y-4">
              {/* Top meta */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`
                    text-xs uppercase tracking-widest
                    ${theme === "light" ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  {new Date(generation.createdAt).toLocaleString()}
                </span>

                <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                  {generation.tone}
                </span>
              </div>

              {/* Content */}
              <p
                className={`
                  text-sm leading-relaxed line-clamp-3 flex-1
                  ${theme === "light" ? "text-slate-600" : "text-slate-300"}
                `}
              >
                {generation.content}
              </p>

              {/* Media */}
              {generation.mediaUrl && (
                <div
                  className={`
                    rounded-xl border overflow-hidden
                    ${
                      theme === "light"
                        ? "border-slate-50 bg-slate-50"
                        : "border-[#ffffff10] bg-[#1a1a1a]"
                    }
                  `}
                >
                  <img
                    src={generation.mediaUrl}
                    alt="gen"
                    className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveScheduler(generation)}
                  className={`
                    flex-1 text-xs py-2.5 rounded-lg transition-all
                    ${
                      theme === "light"
                        ? "bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600"
                        : "bg-[#1a1a1a] hover:bg-red-500 hover:text-white text-slate-300"
                    }
                  `}
                >
                  Schedule Post
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(generation._id)}
                  disabled={deletingId === generation._id}
                  title="Delete generation"
                  className={`
                    p-2.5 rounded-lg transition-all disabled:opacity-50
                    ${
                      theme === "light"
                        ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        : "bg-[#1a1a1a] text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    }
                  `}
                >
                  {deletingId === generation._id ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {generations.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-2">
            <div
              className={`
                size-12 rounded-2xl flex items-center justify-center mx-auto
                ${
                  theme === "light"
                    ? "bg-slate-50 text-slate-300"
                    : "bg-[#1a1a1a] text-slate-600"
                }
              `}
            >
              <Wand2Icon className="size-6" />
            </div>
            <p
              className={`text-sm ${
                theme === "light" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No content generated yet.
            </p>
          </div>
        )}
      </div>

      {/* Schedule Modal (unchanged logic) */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            className={`
              w-full max-w-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh] border
              ${
                theme === "light"
                  ? "bg-white border-slate-100"
                  : "bg-[#111111] border-[#ffffff10]"
              }
            `}
          >
            {/* Header */}
            <div
              className={`
                flex items-center justify-between px-8 py-4 border-b
                ${
                  theme === "light"
                    ? "border-slate-100 bg-slate-50/30"
                    : "border-[#ffffff10] bg-[#1a1a1a]"
                }
              `}
            >
              <h3
                className={
                  theme === "light" ? "text-slate-900" : "text-white"
                }
              >
                Schedule Generation
              </h3>
              <button
                onClick={() => setActiveScheduler(null)}
                className={`
                  p-2 rounded-full transition-colors
                  ${
                    theme === "light"
                      ? "hover:bg-slate-100 text-slate-400"
                      : "hover:bg-[#222] text-slate-500"
                  }
                `}
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div
                className={`rounded-2xl p-6 border ${
                  theme === "light"
                    ? "bg-slate-50 border-slate-100"
                    : "bg-[#1a1a1a] border-[#ffffff10]"
                }`}
              >
                <h4
                  className={`font-medium mb-3 ${
                    theme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  Prompt
                </h4>
                <p
                  className={`text-sm whitespace-pre-wrap ${
                    theme === "light" ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  {activeScheduler.prompt}
                </p>
              </div>

              <div
                className={`rounded-2xl p-6 border ${
                  theme === "light"
                    ? "bg-white border-slate-100"
                    : "bg-[#1a1a1a] border-[#ffffff10]"
                }`}
              >
                <h4
                  className={`font-medium mb-3 ${
                    theme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  Generated Content
                </h4>
                <p
                  className={`text-sm whitespace-pre-wrap leading-relaxed ${
                    theme === "light" ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  {activeScheduler.content}
                </p>
              </div>

              {activeScheduler.mediaUrl && (
                <div
                  className={`overflow-hidden rounded-2xl border ${
                    theme === "light"
                      ? "border-slate-100"
                      : "border-[#ffffff10]"
                  }`}
                >
                  <img
                    src={activeScheduler.mediaUrl}
                    alt="Generated"
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div>
                <h4
                  className={`font-medium mb-3 ${
                    theme === "light" ? "text-slate-900" : "text-white"
                  }`}
                >
                  Select Platforms
                </h4>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlatforms((prev) =>
                          prev.includes(platform.id)
                            ? prev.filter((p) => p !== platform.id)
                            : [...prev, platform.id]
                        )
                      }
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? "bg-red-500 border-red-500 text-white"
                          : theme === "light"
                          ? "bg-white border-slate-200 text-slate-700"
                          : "bg-[#1a1a1a] border-[#ffffff10] text-slate-300"
                      }`}
                    >
                      <platform.icon />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <CalendarIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none ${
                      theme === "light"
                        ? "border-slate-200 bg-white"
                        : "border-[#ffffff10] bg-[#1a1a1a] text-white"
                    }`}
                  />
                </div>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none ${
                      theme === "light"
                        ? "border-slate-200 bg-white"
                        : "border-[#ffffff10] bg-[#1a1a1a] text-white"
                    }`}
                  />
                </div>
              </div>

              <button
                disabled={scheduling}
                onClick={handleSchedule}
                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {scheduling ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <TimerIcon className="size-4" />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentGeneration;