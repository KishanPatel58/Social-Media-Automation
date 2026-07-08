import React, { useContext, useEffect, useState } from 'react'
import { themeContext } from '../../context/theme/ThemeContext';
import {HistoryIcon ,Wand2Icon ,} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
const RecentGeneration = () => {
  const { theme } = useContext(themeContext)
  const [
    generations,
    setGenerations,
  ] = useState([]);

  const fetchGenerations = async () => {
    try {
      const { data } = await api.get("/api/posts/generations");
      setGenerations(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    }
  };

  useEffect(() => {

    fetchGenerations();

  }, []);

  return (
    <div
      className={`
          space-y-6
          pt-12

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
  )
}

export default RecentGeneration