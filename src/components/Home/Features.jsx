import {
    CalendarDaysIcon,
    Wand2Icon,
    Share2Icon,
    ZapIcon,
    BarChart3Icon,
    HashIcon,
} from "lucide-react";

import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

const features = [
    {
        icon: CalendarDaysIcon,
        title: "Smart Scheduling",
        description:
            "Queue posts across all platforms with a single click. Set it once and let us handle the rest.",
    },
    {
        icon: Wand2Icon,
        title: "AI Content Generator",
        description:
            "Generate on-brand captions and stunning images with our built-in AI. Never stare at a blank page again.",
    },
    {
        icon: BarChart3Icon,
        title: "Activity Dashboard",
        description:
            "Get a bird's eye view of all published posts, scheduled content, and engagement activity in one place.",
    },
    {
        icon: Share2Icon,
        title: "Multi-Platform",
        description:
            "Connect LinkedIn, Instagram. Post everywhere from one unified workspace.",
    },
    {
        icon: ZapIcon,
        title: "Instant Publishing",
        description:
            "Need to go live now? Publish immediately or schedule for peak engagement times with full timezone support.",
    },
    {
        icon: HashIcon,
        title: "Hashtag Suggestions",
        description:
            "Get AI-powered hashtag suggestions to reach a wider audience.",
    },
];

export default function Features() {

    const { theme } = useContext(themeContext);

    return (
        <section
            id="features"
            className={`
                py-24 transition-all duration-300

                ${theme === "dark"
                    ? "bg-black"
                    : "bg-slate-50"
                }
            `}
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6">

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

                            ${theme === "dark"
                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                : "bg-red-500/10 border-red-500/15 text-red-500"
                            }
                        `}
                    >
                        <ZapIcon className="size-3" />

                        Everything you need
                    </div>

                    {/* HEADING */}

                    <h2
                        className={`
                            font-serif
                            text-4xl sm:text-5xl
                            font-medium
                            leading-tight
                            transition-all

                            ${theme === "dark"
                                ? "text-white"
                                : "text-gray-900"
                            }
                        `}
                    >
                        Automate your entire
                        <br />

                        <span className="text-red-400 italic">
                            social media workflow
                        </span>
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        className={`
                            mt-5 max-w-xl mx-auto leading-relaxed transition-all

                            ${theme === "dark"
                                ? "text-slate-400"
                                : "text-gray-500"
                            }
                        `}
                    >
                        From content creation to scheduling —
                        Scheduler handles it all so you can focus
                        on what matters most.
                    </p>
                </div>

                {/* FEATURE GRID */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {features.map((f) => (

                        <div
                            key={f.title}
                            className={`
                                rounded-2xl border p-6
                                transition-all duration-300
                                group hover:-translate-y-1

                                ${theme === "dark"
                                    ? "bg-[#0f0f0f] border-[#ffffff10] hover:border-[#ffffff20] hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)]"
                                    : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100"
                                }
                            `}
                        >

                            {/* ICON */}

                            <div
                                className={`
                                    size-10 rounded-xl
                                    flex items-center justify-center
                                    mb-4 transition-all

                                    ${theme === "dark"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-red-50 text-red-500"
                                    }
                                `}
                            >
                                <f.icon className="size-5" />
                            </div>

                            {/* TITLE */}

                            <h3
                                className={`
                                    mb-2 text-lg font-medium transition-all

                                    ${theme === "dark"
                                        ? "text-white"
                                        : "text-slate-900"
                                    }
                                `}
                            >
                                {f.title}
                            </h3>

                            {/* DESCRIPTION */}

                            <p
                                className={`
                                    text-sm leading-relaxed transition-all

                                    ${theme === "dark"
                                        ? "text-slate-400"
                                        : "text-slate-500/90"
                                    }
                                `}
                            >
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}