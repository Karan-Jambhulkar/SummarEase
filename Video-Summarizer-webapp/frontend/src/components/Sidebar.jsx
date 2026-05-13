import {
  LayoutDashboard,
  History,
  Info,
  Settings,
  Menu,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Sidebar({
  collapsed,
  setCollapsed,
}) {

  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "About",
      path: "/about",
      icon: Info,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (

    <aside
      className={`
        min-h-screen
        border-r
        border-zinc-200
        dark:border-zinc-800
        bg-white/80
        dark:bg-zinc-950/80
        backdrop-blur-xl
        transition-all
        duration-300
        flex
        flex-col
        ${
          collapsed
            ? "w-24"
            : "w-80"
        }
      `}
    >

      {/* TOP */}
      <div className="flex items-center justify-between p-5">

        {!collapsed && (

          <h1 className="text-4xl font-bold tracking-tight dark:text-white">

            SummarEase

          </h1>

        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="
            h-14
            w-14
            rounded-xl
            flex
            items-center
            justify-center
            hover:bg-zinc-200
            dark:hover:bg-zinc-800
            transition-all
          "
        >

          <Menu className="w-7 h-7 text-slate-800 dark:text-white" />

        </button>

      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 space-y-2">

        {navItems.map((item) => {

          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (

            <Link
              key={item.path}
              to={item.path}
              className={`
                flex
                items-center
                gap-4
                px-5
                py-5
                rounded-2xl
                transition-all
                duration-300
                group
                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      text-white
                      shadow-lg
                      shadow-blue-500/20
                    `
                    : `
                      text-zinc-600
                      dark:text-zinc-300
                      hover:bg-zinc-100
                      dark:hover:bg-zinc-900
                    `
                }
              `}
            >

              <Icon className="w-6 h-6 shrink-0" />

              {!collapsed && (

                <span className="text-lg font-medium">

                  {item.name}

                </span>

              )}

            </Link>
          );
        })}

      </nav>

      {/* FOOTER */}
      {!collapsed && (

        <div className="p-5 text-sm text-zinc-400">

          AI Video Summarization Platform

        </div>

      )}

    </aside>
  );
}

export default Sidebar;