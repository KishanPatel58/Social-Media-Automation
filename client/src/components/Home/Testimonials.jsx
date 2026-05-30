import { StarIcon } from "lucide-react";
import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

const testimonials = [
    {
        name: "Sarah K.",
        role: "Marketing Manager",
        avatar: "S",
        avatarBg: "from-red-400 to-pink-400",
        text: "Scheduler has saved our team 10+ hours a week. The AI composer is genuinely impressive — it writes content that sounds like us.",
    },
    {
        name: "Marcus L.",
        role: "Indie Creator",
        avatar: "M",
        avatarBg: "from-violet-400 to-purple-500",
        text: "I used to dread posting. Now I queue up a whole week of content in 20 minutes. The smart scheduling feature alone is worth it.",
    },
    {
        name: "Priya D.",
        role: "Startup Founder",
        avatar: "P",
        avatarBg: "from-sky-400 to-blue-500",
        text: "Finally a scheduler that's beautiful AND powerful. The clean dashboard makes it easy to see exactly what's going out and when.",
    },
];

export default function Testimonials() {

    const { theme } = useContext(themeContext);

    return (
        <section
            className={`
                py-24 transition-all duration-300

                ${
                    theme === "dark"
                        ? "bg-black"
                        : "bg-slate-50"
                }
            `}
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* TOP SECTION */}

                <div className="text-center mb-14">

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
                        <StarIcon className="size-3" />

                        Testimonials
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
                        Loved by{" "}

                        <span className="text-red-400">
                            creators &amp; teams
                        </span>
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                        className={`
                            mt-5 max-w-md mx-auto transition-all

                            ${
                                theme === "dark"
                                    ? "text-slate-400"
                                    : "text-gray-500"
                            }
                        `}
                    >
                        Join thousands of people who automate their
                        social media with Scheduler.
                    </p>
                </div>

                {/* TESTIMONIAL GRID */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {testimonials.map((t, i) => (

                        <div
                            key={i}
                            className={`
                                rounded-2xl border p-6
                                transition-all duration-300
                                hover:-translate-y-1
                                flex flex-col gap-4

                                ${
                                    theme === "dark"
                                        ? "bg-[#0f0f0f] border-[#ffffff10] hover:border-[#ffffff20] hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)]"
                                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
                                }
                            `}
                        >

                            {/* REVIEW */}

                            <p
                                className={`
                                    text-sm leading-relaxed flex-1 transition-all

                                    ${
                                        theme === "dark"
                                            ? "text-slate-300"
                                            : "text-slate-600"
                                    }
                                `}
                            >
                                "{t.text}"
                            </p>

                            {/* USER INFO */}

                            <div
                                className={`
                                    flex items-center gap-3 pt-2 border-t transition-all

                                    ${
                                        theme === "dark"
                                            ? "border-[#ffffff10]"
                                            : "border-slate-100"
                                    }
                                `}
                            >

                                {/* AVATAR */}

                                <div
                                    className={`
                                        size-9 rounded-full
                                        bg-gradient-to-br
                                        ${t.avatarBg}
                                        flex items-center justify-center
                                        text-white text-sm font-bold
                                        shrink-0
                                    `}
                                >
                                    {t.avatar}
                                </div>

                                {/* NAME + ROLE */}

                                <div>

                                    <div
                                        className={`
                                            text-sm font-medium transition-all

                                            ${
                                                theme === "dark"
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {t.name}
                                    </div>

                                    <div
                                        className={`
                                            text-xs transition-all

                                            ${
                                                theme === "dark"
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                            }
                                        `}
                                    >
                                        {t.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}