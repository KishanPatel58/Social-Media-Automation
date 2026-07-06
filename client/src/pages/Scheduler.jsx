import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  PLATFORMS
} from "../assets/assets";

import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  XIcon,
} from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Scheduler = () => {

  const { theme } =
    useContext(themeContext);

  const [posts, setPosts] =
    useState([]);

  const [content, setContent] =
    useState("");

  const [
    scheduledTime,
    setScheduledTime,
  ] = useState("");

  const [
    scheduledDate,
    setScheduledDate,
  ] = useState("");

  const [
    selectedPlatforms,
    setSelectedPlatforms,
  ] = useState([]);

  const [mediaFile, setMediaFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const togglePlatform = (id) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter(
          (platform) => platform !== id
        )
        : [...prev, id]
    );

  const handleSchedule = async (e) => {

    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform.");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time.");
      return;
    }
    if (selectedPlatforms.includes("instagram") && !mediaFile) {
      toast.error("Instagram requires an image or video.");
      return;
    }
    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));
    if (mediaFile) formData.append("media", mediaFile);
    setLoading(true);
    try {
      await api.post("/api/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Post Scheduled!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (

    <div
      className="
        flex flex-col
        lg:flex-row
        gap-6
        h-full
      "
    >

      {/* COMPOSE */}

      <div
        className="
          w-full
          lg:w-[460px]
          shrink-0
        "
      >

        <div
          className={`
            rounded-2xl
            border
            p-6

            transition-all duration-300

            ${theme === "light"

              ? "bg-white border-slate-200"

              : "bg-[#111111] border-[#ffffff10]"
            }
          `}
        >

          <div
            className="
              flex items-center
              gap-2
              mb-6
            "
          >

            <h2
              className={`
                text-lg

                ${theme === "light"
                  ? "text-slate-700"
                  : "text-white"
                }
              `}
            >
              Compose Post
            </h2>
          </div>

          <form
            onSubmit={handleSchedule}
            className="space-y-5"
          >

            {/* PLATFORMS */}

            <div>

              <label
                className={`
                  block
                  text-xs
                  uppercase
                  mb-2

                  ${theme === "light"
                    ? "text-slate-500"
                    : "text-slate-400"
                  }
                `}
              >
                Platforms
              </label>

              <div className="flex flex-wrap gap-3">

                {
                  PLATFORMS.map(
                    (platform, idx) => {

                      const active =
                        selectedPlatforms.includes(
                          platform.id
                        );

                      return (

                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            togglePlatform(
                              platform.id
                            )
                          }
                          className={`
                            flex items-center
                            gap-1.5

                            p-3
                            rounded-md
                            border

                            transition-all duration-150

                            ${active

                              ? "bg-red-50 border-red-300 text-red-500 scale-105"

                              : theme === "light"

                                ? "border-slate-200 text-slate-500 hover:border-slate-300"

                                : "border-[#ffffff12] text-slate-400 hover:border-[#ffffff25] hover:bg-[#1a1a1a]"
                            }
                          `}
                        >

                          <platform.icon
                            className="size-4.5"
                          />
                        </button>
                      );
                    }
                  )
                }
              </div>
            </div>

            {/* CONTENT */}

            <div>

              <label
                className={`
                  block
                  text-xs
                  uppercase
                  mb-2

                  ${theme === "light"
                    ? "text-slate-500"
                    : "text-slate-400"
                  }
                `}
              >
                Content
              </label>

              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                placeholder="What do you want to share today ?"
                className={`
                  w-full

                  px-5 py-4

                  rounded-2xl
                  border

                  text-sm
                  resize-none
                  outline-none

                  transition-all duration-300

                  ${theme === "light"

                    ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"

                    : "bg-[#1a1a1a] border-[#ffffff12] text-white placeholder-slate-500"
                  }
                `}
              />

              <div
                className={`
                  text-right
                  text-xs
                  mt-1
                  font-medium

                  ${content.length > 270

                    ? "text-red-500"

                    : theme === "light"

                      ? "text-slate-400"

                      : "text-slate-500"
                  }
                `}
              >
                {content.length}/280
              </div>
            </div>

            {/* MEDIA */}

            <div>

              <label
                className={`
                  block
                  text-xs
                  uppercase
                  mb-2

                  ${theme === "light"
                    ? "text-slate-500"
                    : "text-slate-400"
                  }
                `}
              >
                Media (optional)
              </label>

              {
                mediaFile

                  ? (
                    <div
                      className={`
                        relative
                        rounded-xl
                        overflow-hidden
                        border

                        ${theme === "light"

                          ? "border-slate-200 bg-slate-50"

                          : "border-[#ffffff12] bg-[#1a1a1a]"
                        }
                      `}
                    >

                      {
                        mediaFile.type.startsWith(
                          "image/"
                        )

                          ? (
                            <img
                              src={URL.createObjectURL(
                                mediaFile
                              )}
                              alt="preview"
                              className="
                                w-full
                                h-40
                                object-cover
                              "
                            />
                          )

                          : (
                            <video
                              controls
                              src={URL.createObjectURL(
                                mediaFile
                              )}
                              className="
                                w-full
                                h-40
                                object-cover
                              "
                            />
                          )
                      }

                      <button
                        type="button"
                        onClick={() =>
                          setMediaFile(null)
                        }
                        className="
                          absolute
                          top-2 right-2

                          size-7

                          bg-black/60
                          hover:bg-black/80

                          text-white

                          rounded-full

                          flex items-center justify-center
                        "
                      >

                        <XIcon
                          className="size-3.5"
                        />
                      </button>
                    </div>
                  )

                  : (
                    <label
                      className={`
                        flex items-center justify-center
                        gap-2

                        p-5 py-10

                        border-2 border-dashed
                        rounded-xl

                        cursor-pointer

                        transition-all duration-300

                        ${theme === "light"

                          ? "border-slate-200 hover:border-red-300 hover:bg-red-50/30"

                          : "border-[#ffffff12] hover:border-red-500/30 hover:bg-[#1a1a1a]"
                        }
                      `}
                    >

                      <span
                        className={`
                          text-sm

                          ${theme === "light"

                            ? "text-slate-500"

                            : "text-slate-400"
                          }
                        `}
                      >
                        Click to upload image or video
                      </span>

                      <input
                        hidden
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                          e.target.files?.[0]
                          &&
                          setMediaFile(
                            e.target.files[0]
                          )
                        }
                      />
                    </label>
                  )
              }
            </div>

            {/* DATE & TIME */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              "
            >

              {/* DATE */}

              <div>

                <label
                  className={`
                    block
                    text-xs
                    uppercase
                    mb-2

                    ${theme === "light"
                      ? "text-slate-500"
                      : "text-slate-400"
                    }
                  `}
                >
                  Date
                </label>

                <div className="relative">

                  <CalendarIcon
                    className={`
                      size-4
                      absolute
                      left-3 top-1/2
                      -translate-y-1/2

                      ${theme === "light"
                        ? "text-slate-400"
                        : "text-slate-500"
                      }
                    `}
                  />

                  <input
                    required
                    type="date"
                    value={scheduledDate}
                    onChange={(e) =>
                      setScheduledDate(
                        e.target.value
                      )
                    }
                    className={`
                      w-full

                      pl-10 pr-4 py-2.5

                      rounded-lg
                      border

                      text-sm
                      outline-none

                      ${theme === "light"

                        ? "bg-slate-50 border-slate-200 text-slate-900"

                        : "bg-[#1a1a1a] border-[#ffffff12] text-white"
                      }
                    `}
                  />
                </div>
              </div>

              {/* TIME */}

              <div>

                <label
                  className={`
                    block
                    text-xs
                    uppercase
                    mb-2

                    ${theme === "light"
                      ? "text-slate-500"
                      : "text-slate-400"
                    }
                  `}
                >
                  Time
                </label>

                <div className="relative">

                  <ClockIcon
                    className={`
                      size-4
                      absolute
                      left-3 top-1/2
                      -translate-y-1/2

                      ${theme === "light"
                        ? "text-slate-400"
                        : "text-slate-500"
                      }
                    `}
                  />

                  <input
                    required
                    type="time"
                    value={scheduledTime}
                    onChange={(e) =>
                      setScheduledTime(
                        e.target.value
                      )
                    }
                    className={`
                      w-full

                      pl-10 pr-4 py-2.5

                      rounded-lg
                      border

                      text-sm
                      outline-none

                      ${theme === "light"

                        ? "bg-slate-50 border-slate-200 text-slate-900"

                        : "bg-[#1a1a1a] border-[#ffffff12] text-white"
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full

                flex items-center justify-center
                gap-2

                py-3.5

                bg-red-500
                hover:bg-red-600

                transition-all

                text-white

                rounded-lg
              "
            >

              {
                loading

                  ? (
                    <>
                      <div
                        className="
                          size-4
                          border-2
                          border-white
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />

                      Scheduling..
                    </>
                  )

                  : (
                    <>
                      Schedule Post

                      <ArrowRightIcon
                        className="size-4"
                      />
                    </>
                  )
              }
            </button>
          </form>
        </div>
      </div>

      {/* QUEUES */}

      <div
        className="
          flex-1
          flex flex-col
          gap-6
          min-w-0
        "
      >

        {/* UPCOMING */}

        

        {/* PUBLISHED */}

        
      </div>
    </div>
  );
};

export default Scheduler;