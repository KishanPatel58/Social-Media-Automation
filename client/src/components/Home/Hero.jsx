import { Link } from "react-router-dom";
import { ArrowRightIcon, DotIcon } from "lucide-react";
import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

export default function Hero() {

    const { theme } = useContext(themeContext);

    return (
        <section
            className={`
                relative overflow-hidden transition-all duration-300

                ${theme === "dark"
                    ? "bg-black"
                    : "bg-white"
                }
            `}
        >

            {/* GRID */}

            <div
                className={`
                    absolute inset-0 pointer-events-none

                    ${theme === "dark"
                        ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                        : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"
                    }

                    bg-size-[56px_56px]
                `}
            />

            {/* RED GLOW */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.10)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">

                {/* BADGE */}

                <div
                    className={`
                        inline-flex items-center gap-2
                        text-sm px-3.5 py-1.5 rounded-full mb-8 border

                        ${theme === "dark"
                            ? "bg-[#111111] border-[#ffffff18] text-red-400"
                            : "bg-red-50 border-red-100 text-red-500"
                        }
                    `}
                >
                    <span className="size-1.5 bg-red-400 rounded-full" />

                    AI-Powered Social Media Automation
                </div>

                {/* HEADING */}

                <h1
                    className={`
                        font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl transition-all

                        ${theme === "dark"
                            ? "text-white"
                            : "text-slate-900"
                        }
                    `}
                >
                    Schedule smarter.
                    <br />

                    <span className="text-red-400 italic">
                        Grow faster.
                    </span>
                </h1>

                {/* SUBTEXT */}

                <p
                    className={`
                        mt-7 max-w-2xl mx-auto transition-all

                        ${theme === "dark"
                            ? "text-slate-400"
                            : "text-gray-500"
                        }
                    `}
                >
                    Scheduler lets you create, schedule, and auto-engage across all your social platforms — powered by AI that writes your captions and replies for you.
                </p>

                {/* BUTTONS */}

                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">

                    <Link
                        to="/login"
                        className="
                            bg-red-500 text-white rounded-full font-medium
                            hover:bg-red-600
                            hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)]
                            inline-flex items-center gap-2
                            text-[15px]
                            px-8 py-3.5
                            w-full sm:w-auto
                            justify-center
                            transition-all
                        "
                    >
                        Start for free

                        <ArrowRightIcon className="size-4" />
                    </Link>

                    <a
                        href="#how-it-works"
                        className={`
                            rounded-full font-medium inline-flex items-center gap-2
                            text-[15px]
                            px-8 py-3.5
                            w-full sm:w-auto
                            backdrop-blur justify-center
                            transition-all border

                            ${theme === "dark"
                                ? "bg-[#111111] text-white border-[#ffffff18] hover:bg-[#1a1a1a]"
                                : "bg-transparent text-[#333] border-black/10 hover:bg-black/5 hover:border-black/20"
                            }
                        `}
                    >
                        See how it works
                    </a>
                </div>

                {/* SMALL TEXT */}

                <p
                    className={`
                        mt-5 text-xs transition-all

                        ${theme === "dark"
                            ? "text-slate-500"
                            : "text-gray-400"
                        }
                    `}
                >
                    No credit card required · Free forever plan available
                </p>
            </div>

            {/* DASHBOARD */}

            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-0">

                <div
                    className={`
                        rounded-t-2xl overflow-hidden border border-b-0 transition-all

                        ${theme === "dark"
                            ? "border-[#ffffff15]"
                            : "border-gray-200"
                        }
                    `}
                >

                    {/* TOP BAR */}

                    <div
                        className={`
                            flex items-center gap-2 px-4 py-3 border-b transition-all

                            ${theme === "dark"
                                ? "bg-[#111111] border-[#ffffff10]"
                                : "bg-[#f0f0f0] border-black/10"
                            }
                        `}
                    >
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />

                        <div
                            className={`
                                flex-1 mx-4 rounded-md h-5 max-w-xs

                                ${theme === "dark"
                                    ? "bg-[#ffffff12]"
                                    : "bg-white/80"
                                }
                            `}
                        />
                    </div>

                    {/* MAIN CONTENT */}

                    <div
                        className={`
                            p-6 transition-all

                            ${theme === "dark"
                                ? "bg-[#0a0a0a]"
                                : "bg-[#f7f7f7]"
                            }
                        `}
                    >

                        {/* STATS */}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">

                            {[
                                { val: "12", label: "Scheduled" },
                                { val: "48", label: "Published" },
                                { val: "4", label: "Accounts" },
                                { val: "3", label: "AI Rules" },
                            ].map((s) => (

                                <div
                                    key={s.label}
                                    className={`
                                        rounded-xl p-4 border transition-all

                                        ${theme === "dark"
                                            ? "bg-[#111111] border-[#ffffff10]"
                                            : "bg-white border-black/5"
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            text-2xl font-bold tabular-nums

                                            ${theme === "dark"
                                                ? "text-white"
                                                : "text-gray-900"
                                            }
                                        `}
                                    >
                                        {s.val}
                                    </div>

                                    <div
                                        className={`
                                            text-xs mt-1

                                            ${theme === "dark"
                                                ? "text-slate-500"
                                                : "text-gray-400"
                                            }
                                        `}
                                    >
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ACTIVITY */}

                        <div
                            className={`
                                rounded-xl p-4 space-y-3 border transition-all

                                ${theme === "dark"
                                    ? "bg-[#111111] border-[#ffffff10]"
                                    : "bg-white border-black/5"
                                }
                            `}
                        >

                            <div
                                className={`
                                    text-[10px] font-semibold uppercase tracking-widest mb-3

                                    ${theme === "dark"
                                        ? "text-slate-500"
                                        : "text-gray-400"
                                    }
                                `}
                            >
                                Recent Activity
                            </div>

                            {[
                                {
                                    text: "Post published to LinkedIn & Twitter",
                                    time: "2m ago",
                                },
                                {
                                    text: "AI replied to 3 comments",
                                    time: "15m ago",
                                },
                                {
                                    text: "New post scheduled for tomorrow 9am",
                                    time: "1h ago",
                                },
                            ].map((item) => (

                                <div
                                    key={item.text}
                                    className="flex items-center gap-3"
                                >
                                    <DotIcon
                                        className={`
                                            size-5

                                            ${theme === "dark"
                                                ? "text-slate-600"
                                                : "text-gray-300"
                                            }
                                        `}
                                    />

                                    <span
                                        className={`
                                            text-sm flex-1

                                            ${theme === "dark"
                                                ? "text-slate-300"
                                                : "text-gray-600"
                                            }
                                        `}
                                    >
                                        {item.text}
                                    </span>

                                    <span
                                        className={`
                                            text-xs shrink-0

                                            ${theme === "dark"
                                                ? "text-slate-600"
                                                : "text-gray-300"
                                            }
                                        `}
                                    >
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}