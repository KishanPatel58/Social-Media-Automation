import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  dummyGenerationData,
  PLATFORMS,
} from "../assets/assets";

import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  HistoryIcon,
  Loader2Icon,
  TimerIcon,
  Wand2Icon,
  XIcon,
} from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";

const AIComposer = () => {
  
  
  const { theme } =
    useContext(themeContext);

  const [prompt, setPrompt] =
    useState("");

  const [tone, setTone] =
    useState("Professional");

  const [
    generateImage,
    setGenerateImage,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const [
    generations,
    setGenerations,
  ] = useState([]);

  /* SCHEDULER */

  const [
    activeScheduler,
    setActiveScheduler,
  ] = useState(null);

  const [
    selectedPlatforms,
    setSelectedPlatforms,
  ] = useState([]);

  const [
    scheduledDate,
    setScheduledDate,
  ] = useState("");

  const [
    scheduledTime,
    setScheduledTime,
  ] = useState("");

  const [scheduling, setScheduling] =
    useState(false);

  const fetchGenerations =
    async () => {

      setGenerations(
        dummyGenerationData
      );
    };

  useEffect(() => {

    fetchGenerations();

  }, []);

  const handleGenerate =
    async () => {

      setLoading(true);

      setTimeout(() => {

        setLoading(false);

      }, 2000);
    };

  const handleSchedule =
    async () => {

      setScheduling(true);

      setTimeout(() => {

        setScheduling(false);

      }, 2000);
    };

  const tones = [
    "Professional",
    "Creative",
    "Funny",
    "Minimalist",
    "Excited",
  ];
 

  return (
     <div
        className="
        max-w-4xl
        mx-auto

        space-y-12
        pb-20

        animate-in fade-in
        duration-700
      "
      >

        {/* INPUT */}

        <div
          className="
          space-y-6
          text-center
          mt-20
        "
        >

          <h1
            className={`
            text-3xl
            tracking-tight

            ${theme === "light"
                ? "text-slate-700"
                : "text-white"
              }
          `}
          >
            What should we create today ?
          </h1>

          {/* TEXTAREA */}

          <div
            className="
            relative
            group
            mt-12
          "
          >

            <textarea
              rows={10}
              value={prompt}
              onChange={(e) =>
                setPrompt(
                  e.target.value
                )
              }
              placeholder="Share your idea.. (e.g. A post about the launch of our new eco-friendly coffee beans)"
              className={`
              w-full

              p-6

              rounded-xl
              border

              outline-none
              resize-none

              h-40

              transition-all duration-300

              ${theme === "light"

                  ? "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-slate-400"

                  : "bg-[#111111] border-[#ffffff10] text-white placeholder-slate-500 focus:border-[#ffffff25]"
                }
            `}
            />

            {/* ACTIONS */}

            <div
              className="
              absolute
              bottom-4 right-2.5

              flex items-center
              gap-3

              text-sm
            "
            >

              {/* TOGGLE */}

              <button
                onClick={() =>
                  setGenerateImage(
                    !generateImage
                  )
                }
                className={`
                flex items-center
                gap-3

                py-2 px-3

                rounded-lg

                ${theme === "light"

                    ? "bg-red-50"

                    : "bg-[#1a1a1a]"
                  }
              `}
              >

                <span
                  className={`
                  ${theme === "light"

                      ? "text-slate-700"

                      : "text-slate-300"
                    }
                `}
                >
                  AI Image
                </span>

                <div
                  className={`
                  relative
                  inline-flex

                  h-5 w-9

                  rounded-full

                  transition-colors duration-200

                  ${generateImage
                      ? "bg-red-500"
                      : theme === "light"

                        ? "bg-slate-200"

                        : "bg-[#333]"
                    }
                `}
                >

                  <span
                    className={`
                    pointer-events-none

                    size-4

                    rounded-full
                    bg-white

                    transform
                    translate-y-0.5

                    transition

                    ${generateImage
                        ? "translate-x-4.5"
                        : "translate-x-0.5"
                      }
                  `}
                  />
                </div>
              </button>

              {/* GENERATE */}

              <button
                disabled={loading}
                onClick={() =>
                  handleGenerate()
                }
                className={`
                flex items-center
                gap-2

                px-4 py-2

                rounded-lg

                transition-all

                ${theme === "light"

                    ? "bg-slate-900 hover:bg-slate-800 text-white"

                    : "bg-white hover:bg-slate-200 text-black"
                  }
              `}
              >

                {
                  loading

                    ? (
                      <>
                        <Loader2Icon
                          className="
                          size-4
                          animate-spin
                        "
                        />

                        <span>
                          Generating...
                        </span>
                      </>
                    )

                    : (
                      <>
                        Generate

                        <ArrowRightIcon
                          className="size-4"
                        />
                      </>
                    )
                }
              </button>
            </div>
          </div>

          {/* TONES */}

          <div
            className="
            flex flex-wrap
            justify-center
            gap-2
          "
          >

            {
              tones.map((tones, idx) => (

                <button
                  key={idx}
                  onClick={() =>
                    setTone(tones)
                  }
                  className={`
                  px-4 py-1.5

                  rounded-full
                  text-sm

                  border

                  transition-all

                  ${tone === tones

                      ? "bg-red-500 border-red-500 text-white"

                      : theme === "light"

                        ? "bg-white border-slate-200 text-slate-500 hover:border-slate-300"

                        : "bg-[#111111] border-[#ffffff10] text-slate-400 hover:border-[#ffffff25]"
                    }
                `}
                >
                  {tones}
                </button>
              ))
            }
          </div>
        </div>

        {/* GENERATIONS */}

        <div
          className={`
          space-y-6
          pt-12
          border-t

          ${theme === "light"
              ? "border-slate-100"
              : "border-[#ffffff10]"
            }
        `}
        >

          <div
            className={`
            flex items-center
            justify-between

            ${theme === "light"
                ? "text-slate-600"
                : "text-slate-300"
              }
          `}
          >

            <div
              className="
              flex items-center
              gap-2
            "
            >

              <HistoryIcon
                className="size-5"
              />

              <h2 className="text-xl">
                Recent Generations
              </h2>
            </div>

            <span
              className={`
              text-sm
              px-2

              ${theme === "light"

                  ? "text-slate-500 bg-slate-50"

                  : "text-slate-400 bg-[#1a1a1a]"
                }
            `}
            >
              {generations.length} total
            </span>
          </div>

          {/* CARDS */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
          >

            {
              generations.map(
                (generation, idx) => (

                  <div
                    key={idx}
                    className={`
                    group

                    rounded-2xl
                    border

                    p-5

                    transition-all

                    ${theme === "light"

                        ? "bg-white border-slate-100 hover:border-red-200"

                        : "bg-[#111111] border-[#ffffff10] hover:border-red-500/30"
                      }
                  `}
                  >

                    <div
                      className="
                      flex flex-col
                      h-full
                      space-y-4
                    "
                    >

                      <div
                        className="
                        flex items-center
                        justify-between
                      "
                      >

                        <span
                          className={`
                          text-xs
                          uppercase
                          tracking-widest

                          ${theme === "light"

                              ? "text-slate-400"

                              : "text-slate-500"
                            }
                        `}
                        >
                          {
                            new Date(
                              generation.createdAt
                            ).toLocaleString()
                          }
                        </span>

                        <span
                          className="
                          text-xs

                          text-red-500
                          bg-red-500/10

                          px-2 py-0.5

                          rounded-md
                        "
                        >
                          {generation.tone}
                        </span>
                      </div>

                      <p
                        className={`
                        text-sm
                        leading-relaxed

                        line-clamp-3

                        flex-1

                        ${theme === "light"

                            ? "text-slate-600"

                            : "text-slate-300"
                          }
                      `}
                      >
                        {generation.content}
                      </p>

                      {
                        generation.mediaUrl && (

                          <div
                            className={`
                            rounded-xl
                            border
                            overflow-hidden

                            ${theme === "light"

                                ? "border-slate-50 bg-slate-50"

                                : "border-[#ffffff10] bg-[#1a1a1a]"
                              }
                          `}
                          >

                            <img
                              src={
                                generation.mediaUrl
                              }
                              alt="gen"
                              className="
                              w-full
                              aspect-video
                              object-cover

                              opacity-90
                              group-hover:opacity-100

                              transition-opacity
                            "
                            />
                          </div>
                        )
                      }

                      <div
                        className="
                        flex items-center
                        gap-2
                        pt-2
                      "
                      >

                        <button
                          onClick={() =>
                            setActiveScheduler(
                              generation
                            )
                          }
                          className={`
                          flex-1

                          text-xs

                          py-2.5

                          rounded-lg

                          transition-all

                          ${theme === "light"

                              ? "bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600"

                              : "bg-[#1a1a1a] hover:bg-red-500 hover:text-white text-slate-300"
                            }
                        `}
                        >
                          Schedule Post
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )
            }

            {/* EMPTY */}

            {
              generations.length === 0 && (

                <div
                  className="
                  col-span-full

                  py-20
                  text-center

                  space-y-2
                "
                >

                  <div
                    className={`
                    size-12
                    rounded-2xl

                    flex items-center justify-center

                    mx-auto

                    ${theme === "light"

                        ? "bg-slate-50 text-slate-300"

                        : "bg-[#1a1a1a] text-slate-600"
                      }
                  `}
                  >

                    <Wand2Icon
                      className="size-6"
                    />
                  </div>

                  <p
                    className={`
                    text-sm

                    ${theme === "light"

                        ? "text-slate-400"

                        : "text-slate-500"
                      }
                  `}
                  >
                    No content generated yet.
                  </p>
                </div>
              )
            }
          </div>
        </div>

        {/* MODAL */}

        {
          activeScheduler && (

            <div
              className="
              fixed inset-0

              min-h-screen

              z-50

              flex items-center justify-center

              p-4

              bg-black/60
              backdrop-blur-md
            "
            >

              <div
                className={`
                w-full
                max-w-2xl

                rounded-xl

                overflow-hidden

                flex flex-col

                max-h-[90vh]

                border

                ${theme === "light"

                    ? "bg-white border-slate-100"

                    : "bg-[#111111] border-[#ffffff10]"
                  }
              `}
              >

                {/* HEADER */}

                <div
                  className={`
                  flex items-center
                  justify-between

                  px-8 py-4

                  border-b

                  ${theme === "light"

                      ? "border-slate-100 bg-slate-50/30"

                      : "border-[#ffffff10] bg-[#1a1a1a]"
                    }
                `}
                >

                  <h3
                    className={`
                    ${theme === "light"
                        ? "text-slate-900"
                        : "text-white"
                      }
                  `}
                  >
                    Schedule Generation
                  </h3>

                  <button
                    onClick={() =>
                      setActiveScheduler(
                        null
                      )
                    }
                    className={`
                    p-2
                    rounded-full

                    transition-colors

                    ${theme === "light"

                        ? "hover:bg-slate-100 text-slate-400"

                        : "hover:bg-[#222] text-slate-500"
                      }
                  `}
                  >

                    <XIcon
                      className="size-5"
                    />
                  </button>
                </div>

                {/* BODY */}

                <div
                  className="
                  flex-1
                  overflow-y-auto

                  p-8
                  space-y-4
                "
                >

                  <div
                    className={`
                    rounded-2xl

                    p-6

                    border

                    ${theme === "light"

                        ? "bg-slate-50 border-slate-100"

                        : "bg-[#1a1a1a] border-[#ffffff10]"
                      }
                  `}
                  >

                    <p
                      className={`
                      text-sm
                      leading-relaxed
                      whitespace-pre-wrap

                      ${theme === "light"

                          ? "text-slate-800"

                          : "text-slate-300"
                        }
                    `}
                    >
                      {
                        activeScheduler.prompt
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
  );
  
}
export default AIComposer;