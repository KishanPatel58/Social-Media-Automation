import React, { useContext, useState, useEffect } from 'react'
import { themeContext } from '../context/theme/ThemeContext';
import {

  CalendarDaysIcon

} from "lucide-react";
import { toast } from 'react-hot-toast';
import api from '../api/axios';
const UpcomingPost = () => {
    const {theme} = useContext(themeContext)
    const [posts, setPosts] =
        useState([]);
    const scheduled = posts.filter(
        (post) => post.status === "scheduled"
    );
    const fetchPosts = async () => {
        try {
            const { data } = await api.get("/api/posts");
            setPosts(data)
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };
    useEffect(() => {

        (async () => await fetchPosts())();

        const interval = setInterval(
            async () => await fetchPosts(),
            10000
        );

        return () => clearInterval(interval);

    }, []);
    return (
        <div
            className={`
            rounded-2xl
            border
            overflow-hidden

            ${theme === "light"

                    ? "bg-white border-slate-200"

                    : "bg-[#111111] border-[#ffffff10]"
                }
          `}
        >

            <div
                className={`
              flex items-center
              gap-2.5

              px-5 py-4

              border-b

              ${theme === "light"

                        ? "border-slate-100"

                        : "border-[#ffffff10]"
                    }
            `}
            >

                <CalendarDaysIcon
                    className={`
                size-4

                ${theme === "light"
                            ? "text-zinc-500"
                            : "text-zinc-400"
                        }
              `}
                />

                <h3
                    className={`
                text-sm

                ${theme === "light"
                            ? "text-slate-900"
                            : "text-white"
                        }
              `}
                >
                    Upcoming
                </h3>

                <span
                    className={`
                ml-auto

                text-xs
                font-bold

                px-2 py-0.5
                rounded-full

                ${theme === "light"

                            ? "bg-zinc-100 text-zinc-700"

                            : "bg-[#1a1a1a] text-zinc-300"
                        }
              `}
                >
                    {scheduled.length}
                </span>
            </div>

            <div
                className={`
              max-h-72
              overflow-y-auto

              divide-y

              ${theme === "light"

                        ? "divide-slate-50"

                        : "divide-[#ffffff08]"
                    }
            `}
            >
                {scheduled.length === 0 ? (
                    <div
                        className={`
                  py-10
                  text-center
                  text-sm

                  ${theme === "light"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }
                `}
                    >
                        No posts scheduled yet
                    </div>
                ) : (
                    scheduled.map((post, idx) => (
                        <div
                            key={idx}
                            className={`
                    px-5 py-4
                    transition-colors

                    ${theme === "light"

                                    ? "hover:bg-slate-50/60"

                                    : "hover:bg-[#1a1a1a]"
                                }
                  `}
                        >

                            <div
                                className="
                      flex items-center
                      justify-between
                      mb-2
                    "
                            >

                                <div
                                    className="
                        flex gap-1.5
                        items-center
                      "
                                >

                                    {
                                        post.platform?.map(
                                            (pl) => {

                                                const meta =
                                                    PLATFORMS.find(
                                                        (
                                                            platform
                                                        ) =>
                                                            platform.id === pl
                                                    );

                                                return meta
                                                    ? (
                                                        <meta.icon
                                                            key={pl}
                                                            className={`
                                    size-3.5

                                    ${theme === "light"

                                                                    ? "text-slate-400"

                                                                    : "text-slate-500"
                                                                }
                                  `}
                                                        />
                                                    )
                                                    : null;
                                            }
                                        )
                                    }
                                </div>

                                <div
                                    className="
                        flex items-center
                        gap-2
                      "
                                >

                                    {
                                        post.mediaType && (
                                            <span
                                                className={`
                              text-xs

                              border

                              px-1.5 py-0.5

                              rounded-md
                              font-semibold
                              capitalize

                              ${theme === "light"

                                                        ? "bg-slate-100 text-slate-600 border-slate-200"

                                                        : "bg-[#1a1a1a] text-slate-300 border-[#ffffff12]"
                                                    }
                            `}
                                            >
                                                {post.mediaType}
                                            </span>
                                        )
                                    }

                                    <span
                                        className={`
                          text-xs

                          ${theme === "light"
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                            }
                        `}
                                    >
                                        {
                                            new Date(
                                                post.scheduledFor
                                            ).toLocaleString()
                                        }
                                    </span>
                                </div>
                            </div>

                            <p
                                className={`
                      text-sm
                      line-clamp-2
                      max-w-md

                      ${theme === "light"
                                        ? "text-slate-500"
                                        : "text-slate-300"
                                    }
                    `}
                            >
                                {post.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default UpcomingPost