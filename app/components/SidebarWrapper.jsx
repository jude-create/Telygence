// app/components/SidebarWrapper.jsx
'use client'

import SideBar from "./SideBar";
import Header from "./Header";
import { useSidebarStore } from "../store/SidebarStore";

export default function SidebarWrapper({ children }) {
  const sidebar = useSidebarStore();

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 hidden md:block
        ${sidebar.isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <Header />
        <div className="w-full bg-[#EDEDED] text-black">
          {children}
        </div>
      </div>
    </div>
  );
}