import { Link } from "react-router-dom";
import { useContext } from "react";
import { themeContext } from "../../context/theme/ThemeContext";

const footerLinks = {
    Product: ["Features", "How it works", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {

    const { theme } = useContext(themeContext);

    return (
        <footer
            className={`
                transition-all duration-300 border-t

                ${
                    theme === "dark"
                        ? "bg-black border-[#ffffff10]"
                        : "bg-[#fafafa] border-black/10"
                }
            `}
        >

            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">

                {/* TOP SECTION */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* BRAND */}

                    <div className="lg:col-span-2">

                        <Link
                            to="/"
                            onClick={() => scrollTo(0, 0)}
                            className="inline-flex items-center gap-2 mb-5"
                        >
                            <img
                                src="/logo.svg"
                                alt="logo"
                                className="size-6"
                            />

                            <span
                                className={`
                                    font-medium font-serif text-xl transition-all

                                    ${
                                        theme === "dark"
                                            ? "text-white"
                                            : "text-gray-800"
                                    }
                                `}
                            >
                                Scheduler
                            </span>
                        </Link>

                        <p
                            className={`
                                text-sm leading-relaxed max-w-xs transition-all

                                ${
                                    theme === "dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }
                            `}
                        >
                            The AI-powered social media scheduler
                            that helps creators and teams grow faster
                            with less effort.
                        </p>
                    </div>

                    {/* FOOTER LINKS */}

                    {Object.entries(footerLinks).map(
                        ([category, links]) => (

                            <div key={category}>

                                {/* CATEGORY */}

                                <div
                                    className={`
                                        text-xs font-semibold uppercase
                                        tracking-widest mb-5 transition-all

                                        ${
                                            theme === "dark"
                                                ? "text-slate-500"
                                                : "text-gray-600"
                                        }
                                    `}
                                >
                                    {category}
                                </div>

                                {/* LINKS */}

                                <ul className="space-y-1">

                                    {links.map((link) => (

                                        <li key={link}>

                                            <a
                                                href="#"
                                                className={`
                                                    text-sm transition-all

                                                    ${
                                                        theme === "dark"

                                                            ? "text-slate-400 hover:text-white"

                                                            : "text-gray-500 hover:text-gray-900"
                                                    }
                                                `}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>

                {/* BOTTOM BAR */}

                <div
                    className={`
                        flex flex-col sm:flex-row
                        items-center justify-between
                        gap-4 pt-8 border-t transition-all

                        ${
                            theme === "dark"
                                ? "border-[#ffffff10]"
                                : "border-black/10"
                        }
                    `}
                >

                    {/* COPYRIGHT */}

                    <p
                        className={`
                            text-xs transition-all

                            ${
                                theme === "dark"
                                    ? "text-slate-500"
                                    : "text-gray-400"
                            }
                        `}
                    >
                        © {new Date().getFullYear()} Scheduler.
                        All rights reserved.
                    </p>

                    {/* BOTTOM LINKS */}

                    <div className="flex items-center gap-6">

                        <a
                            href="#"
                            className={`
                                text-xs transition-all

                                ${
                                    theme === "dark"

                                        ? "text-slate-500 hover:text-white"

                                        : "text-gray-400 hover:text-gray-700"
                                }
                            `}
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className={`
                                text-xs transition-all

                                ${
                                    theme === "dark"

                                        ? "text-slate-500 hover:text-white"

                                        : "text-gray-400 hover:text-gray-700"
                                }
                            `}
                        >
                            Terms of Service
                        </a>

                        <Link
                            to="/login"
                            className={`
                                text-xs transition-all

                                ${
                                    theme === "dark"

                                        ? "text-slate-500 hover:text-white"

                                        : "text-gray-400 hover:text-gray-700"
                                }
                            `}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}