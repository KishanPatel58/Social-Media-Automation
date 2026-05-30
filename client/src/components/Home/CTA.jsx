import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

export default function CTA() {

    const { theme } = useContext(themeContext);

    return (
        <section
            className={`
                py-20 transition-all duration-300

                ${
                    theme === "dark"
                        ? "bg-black"
                        : "bg-white"
                }
            `}
        >

            <div className="max-w-6xl mx-auto px-5 sm:px-8">

                <div
                    className={`
                        relative rounded-3xl overflow-hidden
                        p-14 sm:p-20
                        text-center
                        transition-all duration-300
                        border

                        ${
                            theme === "dark"
                                ? "bg-[#0f0f0f] border-[#ffffff12]"
                                : "bg-[#fff5f5] border-red-100"
                        }
                    `}
                >

                    {/* TOP GLOW */}

                    <div
                        className="
                            absolute top-0 right-0
                            w-96 h-96 rounded-full
                            pointer-events-none
                            bg-[radial-gradient(circle,rgba(239,68,68,0.10)_0%,transparent_70%)]
                        "
                    />

                    {/* BOTTOM GLOW */}

                    <div
                        className="
                            absolute bottom-0 left-0
                            w-72 h-72 rounded-full
                            pointer-events-none
                            bg-[radial-gradient(circle,rgba(239,68,68,0.06)_0%,transparent_70%)]
                        "
                    />

                    <div className="relative">

                        {/* BADGE */}

                        <div
                            className={`
                                mb-6 inline-flex items-center gap-1.5
                                text-[11px] font-medium
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
                            Ready to grow?
                        </div>

                        {/* HEADING */}

                        <h2
                            className={`
                                font-serif
                                text-4xl sm:text-5xl md:text-6xl
                                leading-tight
                                font-medium
                                transition-all

                                ${
                                    theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                }
                            `}
                        >
                            Automate your social
                            <br />

                            <span className="text-red-400 italic">
                                media today
                            </span>
                        </h2>

                        {/* DESCRIPTION */}

                        <p
                            className={`
                                mt-6 max-w-lg mx-auto text-lg transition-all

                                ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }
                            `}
                        >
                            Join thousands of creators and marketers who trust
                            Scheduler to grow their audience on autopilot.
                        </p>

                        {/* BUTTONS */}

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">

                            {/* PRIMARY BUTTON */}

                            <Link
                                to="/login"
                                className="
                                    bg-red-500 text-white rounded-full
                                    font-semibold
                                    hover:bg-red-600
                                    hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)]
                                    inline-flex items-center gap-2
                                    text-[15px]
                                    px-10 py-4
                                    w-full sm:w-auto
                                    justify-center
                                    transition-all
                                "
                            >
                                Get Started Free

                                <ArrowRightIcon className="size-4" />
                            </Link>

                            {/* SECONDARY BUTTON */}

                            <a
                                href="#pricing"
                                className={`
                                    rounded-full
                                    font-medium
                                    inline-flex items-center gap-2
                                    text-[15px]
                                    px-10 py-4
                                    w-full sm:w-auto
                                    justify-center
                                    transition-all border

                                    ${
                                        theme === "dark"
                                            ? "bg-[#151515] text-white border-[#ffffff15] hover:bg-[#1f1f1f]"
                                            : "bg-transparent text-[#333] border-black/10 hover:bg-black/5 hover:border-black/20"
                                    }
                                `}
                            >
                                View Pricing
                            </a>
                        </div>

                        {/* FOOTER TEXT */}

                        <p
                            className={`
                                mt-6 text-xs transition-all

                                ${
                                    theme === "dark"
                                        ? "text-slate-500"
                                        : "text-gray-400"
                                }
                            `}
                        >
                            No credit card required · Cancel anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}