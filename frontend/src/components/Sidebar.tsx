import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  Settings,
  Sparkles,
  GraduationCap,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("${API_URL}/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.error(err));
  }, []);
  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200";

  const activeNav = "bg-slate-900 text-white shadow-sm";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col">
      {/* Logo */}

      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <GraduationCap size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">TutorGuide AI</h1>

            <p className="text-sm text-slate-500">Instruction Coach</p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeNav : ""}`
          }
        >
          <LayoutDashboard size={20} />
          Overview
        </NavLink>

        <NavLink
          to="/session"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeNav : ""}`
          }
        >
          <PlayCircle size={20} />
          Live Coaching
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeNav : ""}`
          }
        >
          <FileText size={20} />
          Reports
        </NavLink>

        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeNav : ""}`
          }
        >
          <Sparkles size={20} />
          Insights
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeNav : ""}`
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      {/* User Profile */}

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "T"}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {user?.name || "Tutor"}
            </h3>

            <p className="text-sm text-slate-500">Instruction Coach</p>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="
  bg-red-500
  hover:bg-red-600
  text-white
  px-4
  py-2
  rounded-xl
  mt-4
  w-full
  "
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
