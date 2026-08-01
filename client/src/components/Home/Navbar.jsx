import { Link } from "react-router-dom";
import {
    ArrowRightIcon,
    Sun,
    Moon
} from "lucide-react";

import {
    useContext,
    useEffect,
    useState,
} from "react";

import { themeContext } from "../../context/theme/ThemeContext";
import { authContext } from "../../context/auth/AuthContext";

export default function Navbar() {

    const { user } = useContext(authContext)

    const { theme, setTheme } = useContext(themeContext);

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {

        document.documentElement.classList.remove(
            "light",
            "dark"
        );

        document.documentElement.classList.add(
            theme
        );

    }, [theme]);

    const themeHandle = () => {

        setTheme(
            theme === "light"
                ? "dark"
                : "light"
        );
    };

    return (
        <nav
            className={`
                sticky top-0 z-50
                border-b backdrop-blur-lg
                transition-all duration-300

                ${theme === "dark"
                    ? "bg-black border-[#ffffff15]"
                    : "bg-white/80 border-slate-200"
                }
            `}
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* LOGO */}

                <Link
                    to="/"
                    onClick={() => scrollTo(0, 0)}
                    className="flex items-center gap-2"
                >
                    <img
                        src="/logo.svg"
                        alt="logo"
                        className="size-7"
                    />

                    <span
                        className={`
                            text-xl lg:text-2xl
                            font-medium font-serif
                            transition-all

                            ${theme === "dark"
                                ? "text-white"
                                : "text-slate-800"
                            }
                        `}
                    >
                        Scheduler
                    </span>
                </Link>

                {/* DESKTOP NAV */}

                <div
                    className={`
                        hidden md:flex items-center gap-8
                        text-sm transition-all

                        ${theme === "dark"
                            ? "text-slate-300"
                            : "text-slate-500"
                        }
                    `}
                >

                    <a
                        href="#features"
                        className={`
                            transition-all

                            ${theme === "dark"
                                ? "hover:text-white"
                                : "hover:text-slate-900"
                            }
                        `}
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className={`
                            transition-all

                            ${theme === "dark"
                                ? "hover:text-white"
                                : "hover:text-slate-900"
                            }
                        `}
                    >
                        How it works
                    </a>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex items-center gap-3">

                    {/* DESKTOP BUTTONS */}

                    <div className="hidden md:flex items-center gap-3">

                        <Link
                            to="/login"
                            className={`
                                text-sm transition-all

                                ${theme === "dark"
                                    ? "text-slate-300 hover:text-white"
                                    : "text-slate-600 hover:text-slate-900"
                                }
                            `}
                        >
                            {!user?"Sign In":""}
                        </Link>

                        <Link
                            to={user?"/dashboard":"/login"}
                            className="
                                flex items-center gap-1.5
                                text-sm
                                bg-red-500 hover:bg-red-600
                                text-white
                                px-4 py-2
                                rounded-full
                                shadow-sm
                                hover:shadow-red-200
                                hover:shadow-md
                                transition-all
                            "
                        >
                            {!user?"Get Started":"Go to Dashboard"}

                            <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>

                    {/* THEME BUTTON */}

                    <button
                        onClick={themeHandle}
                        className={`
                            border !p-3 rounded-lg
                            transition-all duration-300

                            ${theme === "dark"
                                ? "border-[#ffffff35] text-white hover:bg-[#ffffff10]"
                                : "border-slate-300 text-black hover:bg-slate-100"
                            }
                        `}
                    >
                        {
                            theme === "dark"
                                ? <Sun className="size-5" />
                                : <Moon className="size-5" />
                        }
                    </button>

                    {/* MOBILE MENU BUTTON */}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`
        md:hidden
        w-11 h-11
        flex flex-col
        items-center justify-center
        gap-1.5
        rounded-lg
        border
        transition-all duration-300

        ${theme === "dark"
                                ? "border-[#ffffff20]"
                                : "border-slate-300"
                            }
    `}
                    >

                        {/* TOP LINE */}

                        <span
                            className={`
            w-5 h-[2px]
            rounded-full
            transition-all duration-300

            ${theme === "dark"
                                    ? "bg-white"
                                    : "bg-black"
                                }

            ${menuOpen
                                    ? "rotate-45 translate-y-[8px]"
                                    : ""
                                }
        `}
                        />

                        {/* MIDDLE LINE */}

                        <span
                            className={`
            w-5 h-[2px]
            rounded-full
            transition-all duration-300

            ${theme === "dark"
                                    ? "bg-white"
                                    : "bg-black"
                                }

            ${menuOpen
                                    ? "opacity-0"
                                    : "opacity-100"
                                }
        `}
                        />

                        {/* BOTTOM LINE */}

                        <span
                            className={`
            w-5 h-[2px]
            rounded-full
            transition-all duration-300

            ${theme === "dark"
                                    ? "bg-white"
                                    : "bg-black"
                                }
                                ${menuOpen
                                    ? "-rotate-45 -translate-y-[8px]"
                                    : ""
                                }
        `}
                        />
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}

            <div
                className={`
                    md:hidden overflow-hidden transition-all duration-300

                    ${menuOpen
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                    }

                    ${theme === "dark"
                        ? "bg-black border-[#ffffff10]"
                        : "bg-white border-slate-200"
                    }

                    border-t
                `}
            >

                <div className="px-5 py-5 flex flex-col gap-5">

                    <a
                        href="#features"
                        onClick={() => setMenuOpen(false)}
                        className={`
                            text-sm transition-all

                            ${theme === "dark"
                                ? "text-slate-300 hover:text-white"
                                : "text-slate-700 hover:text-black"
                            }
                        `}
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        onClick={() => setMenuOpen(false)}
                        className={`
                            text-sm transition-all

                            ${theme === "dark"
                                ? "text-slate-300 hover:text-white"
                                : "text-slate-700 hover:text-black"
                            }
                        `}
                    >
                        How it works
                    </a>

                    <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="
                            bg-red-500 hover:bg-red-600
                            text-white text-sm
                            rounded-full
                            px-4 py-3
                            flex items-center justify-center gap-2
                            transition-all
                        "
                    >
                        Get Started

                        <ArrowRightIcon className="size-4" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}