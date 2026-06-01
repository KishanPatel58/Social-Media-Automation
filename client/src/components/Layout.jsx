import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";

const pagetitle = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/schedule": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

const Layout = () => {

  const location = useLocation();

  const title =
    pagetitle[location.pathname] || "Social AI";

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  return (

    <div className="flex h-screen bg-slate-50">

      {/* MOBILE OVERLAY */}

      {
        isMobileMenuOpen && (
          <div
            className={`
        fixed inset-0
        bg-black/50
        z-40
        md:hidden

        transition-opacity duration-300

        ${isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
              }
    `}
            onClick={() => setIsMobileMenuOpen(false)}
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
          className="
                        h-16
                        shrink-0
                        bg-white
                        border-b border-slate-200
                        flex items-center
                        px-4 md:px-8
                        gap-4
                    "
        >

          {/* MOBILE MENU BUTTON */}

          <button
            className="
                            md:hidden
                            p-2
                            -ml-2
                            text-slate-500
                            hover:text-slate-700
                            transition-colors
                        "
            onClick={() =>
              setIsMobileMenuOpen(true)
            }
          >
            <MenuIcon className="size-6" />
          </button>

          {/* PAGE TITLE */}

          <div className="min-w-0">

            <h1
              className="
                                text-slate-900
                                truncate
                            "
            >
              {title}
            </h1>

            <p
              className="
                                text-sm text-slate-400
                                hidden sm:block
                            "
            >
              Manage and automate your social presence
            </p>
          </div>
        </header>

        {/* OUTLET SCROLL AREA */}

        <main
          style={{ overflow: "auto" }}
          className="
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-6
                        md:p-8
                        xl:p-12
                        relative
                    "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;