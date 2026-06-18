import React, {
    useContext,
    useState,
} from "react";

import Sidebar from "./Sidebar";

import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import { MenuIcon } from "lucide-react";

import { themeContext } from "../context/theme/ThemeContext";
import { useAuth } from "../context/auth/AuthContext";

const pagetitle = {
    "/dashboard": "Dashboard",
    "/accounts": "Social Accounts",
    "/schedule": "Post Scheduler",
    "/ai-composer": "AI Composer",
};

const Layout = () => {

    const location = useLocation();

    const { theme } =
        useContext(themeContext);

    const title =
        pagetitle[location.pathname]
        || "Social AI";

    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="size-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }
    return (

        <div
            className={`
                flex
                h-screen

                transition-colors duration-300

                ${theme === "light"
                    ? "bg-slate-50"
                    : "bg-[#0a0a0a]"
                }
            `}
        >

            {/* MOBILE OVERLAY */}

            {
                isMobileMenuOpen && (
                    <div
                        className={`
                            fixed inset-0

                            z-40
                            md:hidden

                            transition-opacity duration-300

                            ${theme === "light"
                                ? "bg-black/50"
                                : "bg-black/70"
                            }

                            ${isMobileMenuOpen
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none"
                            }
                        `}
                        onClick={() =>
                            setIsMobileMenuOpen(false)
                        }
                    />
                )
            }

            {/* SIDEBAR */}

            <Sidebar
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
            />

            {/* RIGHT SIDE */}

            <div
                className="
                    flex flex-col
                    flex-1
                    min-w-0
                "
            >

                {/* HEADER */}

                <header
                    className={`
                        h-16
                        shrink-0

                        border-b

                        flex items-center
                        px-4 md:px-8
                        gap-4

                        transition-colors duration-300

                        ${theme === "light"

                            ? "bg-white border-slate-200"

                            : "bg-[#111111] border-[#ffffff10]"
                        }
                    `}
                >

                    {/* MOBILE MENU BUTTON */}

                    <button
                        className={`
                            md:hidden

                            p-2
                            -ml-2

                            transition-colors duration-300

                            ${theme === "light"

                                ? "text-slate-500 hover:text-slate-700"

                                : "text-slate-400 hover:text-white"
                            }
                        `}
                        onClick={() =>
                            setIsMobileMenuOpen(true)
                        }
                    >
                        <MenuIcon className="size-6" />
                    </button>

                    {/* PAGE TITLE */}

                    <div className="min-w-0">

                        <h1
                            className={`
                                truncate

                                ${theme === "light"
                                    ? "text-slate-900"
                                    : "text-white"
                                }
                            `}
                        >
                            {title}
                        </h1>

                        <p
                            className={`
                                text-sm
                                hidden sm:block

                                ${theme === "light"
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                }
                            `}
                        >
                            Manage and automate your social presence
                        </p>
                    </div>
                </header>

                {/* OUTLET */}

                <main
                    className={`
                        flex-1
                        overflow-y-auto

                        p-4
                        sm:p-6
                        md:p-8
                        xl:p-12

                        relative

                        transition-colors duration-300

                        ${theme === "light"
                            ? "bg-slate-50"
                            : "bg-[#0a0a0a]"
                        }
                    `}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;