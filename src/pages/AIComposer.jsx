import {
  useContext,
  useEffect,
  useState,
} from "react";

import { PLATFORMS } from "../assets/assets";

import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  HistoryIcon,
  Loader2Icon,
  TimerIcon,
  Trash2Icon,
  Wand2Icon,
  XIcon,
} from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AIComposer = () => {
  const { theme } = useContext(themeContext);

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState([]);

  /* SCHEDULER */
  const [activeScheduler, setActiveScheduler] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setGenerations(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/posts/generate", {
        prompt,
        tone,
        generateImage,
      });
      setGenerations([data.generation, ...generations]);
      setActiveScheduler(data.generation);
      toast.success("Content Generated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
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
      toast.success("Ai-Post Scheduled!");
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

  const tones = [
    "Professional",
    "Creative",
    "Funny",
    "Minimalist",
    "Excited",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* INPUT */}
      <div className="space-y-6 text-center mt-20">
        <h1
          className={`text-3xl tracking-tight ${
            theme === "light" ? "text-slate-700" : "text-white"
          }`}
        >
          What should we create today ?
        </h1>

        <div className="relative group mt-12">
          <textarea
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Share your idea.. (e.g. A post about the launch of our new eco-friendly coffee beans)"
            className={`
              w-full p-6 rounded-xl border outline-none resize-none h-40 transition-all duration-300
              ${
                theme === "light"
                  ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-400"
                  : "bg-[#111111] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff25]"
              }
            `}
          />

          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            <button
              onClick={() => setGenerateImage(!generateImage)}
              className={`
                flex items-center gap-3 py-2 px-3 rounded-lg
                ${theme === "light" ? "bg-red-50" : "bg-[#1a1a1a]"}
              `}
            >
              <span
                className={
                  theme === "light" ? "text-slate-700" : "text-slate-300"
                }
              >
                AI Image
              </span>
              <div
                className={`
                  relative inline-flex h-5 w-9 rounded-full transition-colors duration-200
                  ${
                    generateImage
                      ? "bg-red-500"
                      : theme === "light"
                      ? "bg-slate-200"
                      : "bg-[#333]"
                  }
                `}
              >
                <span
                  className={`
                    pointer-events-none size-4 rounded-full bg-white transform translate-y-0.5 transition
                    ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}
                  `}
                />
              </div>
            </button>

            <button
              disabled={loading}
              onClick={handleGenerate}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${
                  theme === "light"
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-white hover:bg-slate-200 text-black"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  Generate
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`
                px-4 py-1.5 rounded-full text-sm border transition-all
                ${
                  tone === t
                    ? "bg-red-500 border-red-500 text-white"
                    : theme === "light"
                    ? "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    : "bg-[#111111] border-[#ffffff10] text-slate-400 hover:border-[#ffffff25]"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* GENERATIONS */}
      <div
        className={`
          space-y-6 pt-12 border-t
          ${theme === "light" ? "border-slate-100" : "border-[#ffffff10]"}
        `}
      >
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
                <div className="flex items-center justify-between">
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

                <p
                  className={`
                    text-sm leading-relaxed line-clamp-3 flex-1
                    ${theme === "light" ? "text-slate-600" : "text-slate-300"}
                  `}
                >
                  {generation.content}
                </p>

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

                {/* Actions: Schedule + Delete */}
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
      </div>

      {/* MODAL */}
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

export default AIComposer;