import React, { useContext, useState } from "react";
import App from "../App";
import { AppContext } from "../context/AppContext";
import { User, ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarLinks } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`relative h-[calc(100vh-61px)] bg-white border-r border-gray-100 sticky top-[61px] z-20 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-purple-700 hover:border-purple-200 transition-colors z-30"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      <div
        className={`flex flex-col items-center justify-center gap-2.5 pt-6 pb-5 border-b border-gray-50 ${
          collapsed ? "px-2" : "px-5"
        }`}
      >
        <div
          className={`relative rounded-full ring-2 ring-purple-100 shrink-0 transition-all duration-300 ${
            collapsed ? "w-10 h-10" : "w-16 h-16"
          }`}
        >
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.fullName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-purple-50 flex items-center justify-center">
              <User className="text-purple-700" size={collapsed ? 16 : 26} />
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
        </div>

        {!collapsed && (
          <h5 className="text-sm text-gray-800 font-semibold leading-tight text-center truncate w-full">
            {user?.fullName}
          </h5>
        )}
      </div>

      <div
        className={`flex-1 overflow-y-auto py-4 flex flex-col gap-1 ${
          collapsed ? "px-2 items-center" : "px-3"
        }`}
      >
        {sidebarLinks.map((item, index) => {
          const isActive = activeMenu === item.label;
          return (
            <button
              key={index}
              onClick={() => navigate(`/${item.path}`)}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-2.5 text-[13px] py-2 rounded-xl transition-all duration-200 ${
                collapsed ? "w-11 h-11 justify-center px-0" : "w-full px-3"
              } ${
                isActive
                  ? "text-white bg-gradient-to-r from-purple-700 to-purple-500 font-semibold shadow-md shadow-purple-200/70"
                  : "text-gray-500 font-medium hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-40">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
