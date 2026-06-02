import {
    CalendarDaysIcon,
    LayoutDashboardIcon,
    LogOut,
    Moon,
    Sun,
    UsersIcon,
    Wand2Icon,
} from "lucide-react";
const { VITE_AI_COMPOSER_FEATURE_ENABLED } = import.meta.env;
import { useContext } from "react";
import {toast} from "react-hot-toast"
import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { themeContext } from "../context/theme/ThemeContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const condetion = VITE_AI_COMPOSER_FEATURE_ENABLED === "true"
    const navigate = useNavigate();

    const { theme, setTheme } =
        useContext(themeContext);

    const { logout, user } = {

        logout: () => {
            window.location.href = "/";
        },

        user: {
            name: "Kishan Patel",
            email: "patelkishan@gmail.com",
        },
    };

    const location = useLocation();

    const navlinks = [
        {
            name: "Dashboard",
            to: "/dashboard",
            icon: LayoutDashboardIcon,
        },
        {
            name: "Accounts",
            to: "/accounts",
            icon: UsersIcon,
        },
        {
            name: "Scheduler",
            to: "/schedule",
            icon: CalendarDaysIcon,
        },
        {
            name: "AI Composer",
            to: "/ai-composer",
            icon: Wand2Icon,
        },
    ];

    const themeHandle = () => {

        setTheme(
            theme === "light"
                ? "dark"
                : "light"
        );
    };

    return (

        <aside
            className={`
                fixed md:relative
                inset-y-0 left-0
                z-50

                w-64 shrink-0

                ${
                    theme === "light"
                        ? "bg-white border-slate-200"
                        : "bg-[#0f0f10] border-[#ffffff15]"
                }

                border-r

                flex flex-col

                transition-all duration-300 ease-in-out

                ${
                    isOpen
                        ? "translate-x-0 pointer-events-auto"
                        : "-translate-x-full md:translate-x-0 pointer-events-none md:pointer-events-auto"
                }
            `}
        >

            {/* LOGO */}

            <div
                onClick={() => navigate("/")}
                className="
                    p-6 pb-4
                    cursor-pointer
                    shrink-0
                "
            >

                <div
                    className={`
                        text-xl
                        tracking-tight

                        flex items-center gap-1.5

                        ${
                            theme === "light"
                                ? "text-slate-800"
                                : "text-white"
                        }
                    `}
                >

                    <img
                        src="/logo.svg"
                        alt="logo"
                        className="size-6"
                    />

                    <span>
                        Scheduler
                    </span>
                </div>
            </div>

            {/* NAV TITLE */}

            <div className="px-6 py-2 shrink-0">

                <span
                    className={`
                        text-xs
                        uppercase
                        tracking-wider

                        ${
                            theme === "light"
                                ? "text-slate-500"
                                : "text-slate-400"
                        }
                    `}
                >
                    Menu
                </span>
            </div>

            {/* NAV LINKS */}

            <nav
                className="
                    flex-1
                    px-3
                    space-y-1
                    overflow-y-auto
                "
            >

                {
                    navlinks.map((link, idx) => {

                        const isActive =
                            location.pathname === link.to;

                        return (

                            <NavLink
                                key={idx}
                                to={link.to}
                                end={link.to === "/dashboard"}
                                onClick={() =>{
                                    setIsOpen(false)
                                    if(link.to === "/ai-composer"){
                                        toast.error("This feature is under development.")
                                    }
                                }}
                                className={`
                                    flex items-center gap-3

                                    px-3 py-2.5
                                    rounded-xl

                                    text-sm

                                    transition-all duration-150

                                    border

                                    ${
                                        isActive

                                            ? "bg-red-500 text-white border-red-500"

                                            : theme === "light"

                                                ? "text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700"

                                                : "text-slate-400 hover:bg-[#ffffff08] border-transparent hover:text-white"
                                    }
                                `}
                            >

                                <link.icon
                                    className={`
                                        size-[18px]
                                        shrink-0

                                        ${
                                            isActive

                                                ? "text-white"

                                                : theme === "light"

                                                    ? "text-slate-500"

                                                    : "text-slate-400"
                                        }
                                    `}
                                />

                                <span>
                                    {link.name}
                                </span>

                                {
                                    isActive && (
                                        <span
                                            className="
                                                ml-auto
                                                w-[5px]
                                                h-5
                                                rounded-full
                                                bg-white
                                            "
                                        />
                                    )
                                }
                            </NavLink>
                        );
                    })
                }
            </nav>

            {/* FOOTER */}

            <div
                className={`
                    p-4
                    border-t
                    shrink-0

                    ${
                        theme === "light"
                            ? "border-slate-100"
                            : "border-[#ffffff10]"
                    }
                `}
            >

                {/* USER CARD */}

                <div
                    className={`
                        flex items-center gap-3
                        p-2
                        rounded-xl

                        transition-colors

                        ${
                            theme === "light"
                                ? "hover:bg-slate-50"
                                : "hover:bg-[#ffffff08]"
                        }
                    `}
                >

                    {/* AVATAR */}

                    <div
                        className="
                            size-8
                            rounded-full

                            bg-gradient-to-br
                            from-red-400
                            to-pink-400

                            flex items-center justify-center

                            text-white
                            text-sm
                            font-medium

                            shrink-0
                        "
                    >
                        {
                            user?.name
                                ?.charAt(0)
                                .toUpperCase() || "U"
                        }
                    </div>

                    {/* USER INFO */}

                    <div className="flex-1 min-w-0">

                        <div
                            className={`
                                text-sm
                                truncate

                                ${
                                    theme === "light"
                                        ? "text-slate-800"
                                        : "text-white"
                                }
                            `}
                        >
                            {user?.name}
                        </div>

                        <div
                            className={`
                                text-xs
                                truncate

                                ${
                                    theme === "light"
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            {user?.email}
                        </div>
                    </div>

                    {/* THEME BUTTON */}

                    <button
                        onClick={themeHandle}
                        className={`
                            border
                            p-2.5
                            rounded-lg

                            transition-all duration-300

                            ${
                                theme === "dark"

                                    ? "border-[#ffffff20] text-white hover:bg-[#ffffff10]"

                                    : "border-slate-300 text-black hover:bg-slate-100"
                            }
                        `}
                    >

                        {
                            theme === "dark"

                                ? <Sun className="size-4" />

                                : <Moon className="size-4" />
                        }
                    </button>
                </div>

                {/* LOGOUT */}

                <button
                    onClick={logout}
                    className={`
                        mt-2

                        flex items-center gap-2

                        px-3 py-2

                        w-full

                        rounded-xl

                        text-sm

                        transition-all duration-150

                        ${
                            theme === "light"

                                ? "text-slate-500 hover:bg-red-50 hover:text-red-500"

                                : "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                        }
                    `}
                >

                    <LogOut className="size-4" />

                    <span>
                        Sign Out
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;