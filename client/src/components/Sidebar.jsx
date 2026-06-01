import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOut,
  UsersIcon,
  Wand2Icon,
} from "lucide-react";

import React from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {

  const navigate = useNavigate();

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

  return (

    <aside
      className={`
        fixed md:relative
        inset-y-0 left-0
        z-50

        w-64 shrink-0

        bg-white
        border-r border-slate-200

        flex flex-col

        transition-transform duration-300 ease-in-out

        ${isOpen
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
          className="
                        text-xl
                        tracking-tight
                        text-slate-800
                        flex items-center gap-1.5
                    "
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
          className="
                        text-xs
                        text-slate-500
                        uppercase
                        tracking-wider
                    "
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
                onClick={() =>
                  setIsOpen(false)
                }
                className={`
                                    flex items-center gap-3

                                    px-3 py-2.5
                                    rounded-xl

                                    text-sm

                                    transition-all duration-150

                                    border

                                    ${isActive

                    ? "bg-red-50 text-red-600 border-red-100"

                    : "text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700"
                  }
                                `}
              >

                <link.icon
                  className={`
                                        size-[18px]
                                        shrink-0

                                        ${isActive
                      ? "text-red-500"
                      : "text-slate-500"
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
                                                bg-red-500
                                            "
                    />
                  )
                }
              </NavLink>
            );
          })
        }
      </nav>

      {/* USER FOOTER */}

      <div
        className="
                    p-4
                    border-t border-slate-100
                    shrink-0
                "
      >

        {/* USER CARD */}

        <div
          className="
                        flex items-center gap-3
                        p-2
                        rounded-xl

                        hover:bg-slate-50
                        transition-colors
                    "
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
              className="
                                text-sm
                                text-slate-800
                                truncate
                            "
            >
              {user?.name}
            </div>

            <div
              className="
                                text-xs
                                text-slate-400
                                truncate
                            "
            >
              {user?.email}
            </div>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="
                        mt-2

                        flex items-center gap-2

                        px-3 py-2

                        w-full

                        rounded-xl

                        text-sm
                        text-slate-500

                        hover:bg-red-50
                        hover:text-red-500

                        transition-all duration-150
                    "
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