import {
    ArrowRightIcon,
    CheckCircleIcon,
} from "lucide-react";

import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

const steps = [
    {
        step: "01",
        title: "Connect Your Accounts",
        description:
            "Link your social profiles in seconds. We support Twitter, LinkedIn, Facebook, and Instagram.",
    },
    {
        step: "02",
        title: "Create or Generate Content",
        description:
            "Write your own post or let our AI craft a caption and image based on your prompt.",
    },
    {
        step: "03",
        title: "Schedule & Publish",
        description:
            "Pick a time, select your platforms, and hit schedule. We handle publishing automatically.",
    },
];

export default function HowItWorks() {

    const { theme } = useContext(themeContext);

    return (
        <section
            id="how-it-works"
            className={`
                py-24 transition-all duration-300

                ${
                    theme === "dark"
                        ? "bg-black"
                        : "bg-white"
                }
            `}
        >

            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* TOP SECTION */}

                <div className="text-center mb-16">

                    {/* BADGE */}

                    <div
                        className={`
                            mb-6 inline-flex items-center gap-1.5
                            text-[11px]
                            font-medium
                            tracking-[0.06em]
                            uppercase
                            px-3.5 py-1.5
                            rounded-full
                            border
                            transition-all

                            ${
                                theme === "dark"
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-red-500/10 border-red-500/15 text-red-500"
                            }
                        `}
                    >
                        <CheckCircleIcon className="size-3" />

                        Simple setup
                    </div>

                    {/* HEADING */}

                    <h2
                        className={`
                            font-serif
                            font-medium
                            text-4xl sm:text-5xl
                            leading-tight
                            transition-all

                            ${
                                theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                            }
                        `}
                    >
                        Up and running in{" "}

                        <span className="text-red-400 italic">
                            minutes
                        </span>
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        className={`
                            mt-5 max-w-lg mx-auto leading-relaxed transition-all

                            ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-gray-500"
                            }
                        `}
                    >
                        No complicated onboarding,
                        no steep learning curve.
                        Just connect, create, and grow.
                    </p>
                </div>

                {/* STEPS */}

                <div className="space-y-6">

                    {steps.map((s, i) => (

                        <div
                            key={s.step}
                            className={`
                                flex gap-6 items-start
                                rounded-2xl
                                p-5
                                transition-all duration-300

                                ${
                                    theme === "dark"
                                        ? "bg-[#0f0f0f] border border-[#ffffff10]"
                                        : "bg-white"
                                }
                            `}
                        >

                            {/* STEP NUMBER */}

                            <div
                                className={`
                                    shrink-0
                                    size-12
                                    rounded-2xl
                                    flex items-center justify-center
                                    border transition-all

                                    ${
                                        theme === "dark"
                                            ? "bg-red-500/10 border-red-500/20"
                                            : "bg-red-50 border-red-100"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        text-sm font-medium

                                        ${
                                            theme === "dark"
                                                ? "text-red-400"
                                                : "text-red-500"
                                        }
                                    `}
                                >
                                    {s.step}
                                </span>
                            </div>

                            {/* CONTENT */}

                            <div className="pt-1 flex-1">

                                <h3
                                    className={`
                                        mb-1 text-lg font-medium transition-all

                                        ${
                                            theme === "dark"
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                                    `}
                                >
                                    {s.title}
                                </h3>

                                <p
                                    className={`
                                        text-sm leading-relaxed transition-all

                                        ${
                                            theme === "dark"
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    {s.description}
                                </p>
                            </div>

                            {/* ARROW */}

                            {i < steps.length - 1 && (

                                <div className="hidden sm:block ml-auto shrink-0 self-center">

                                    <ArrowRightIcon
                                        className={`
                                            size-4 transition-all

                                            ${
                                                theme === "dark"
                                                    ? "text-slate-700"
                                                    : "text-slate-200"
                                            }
                                        `}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}