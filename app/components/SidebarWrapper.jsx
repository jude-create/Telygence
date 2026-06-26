// app/components/SidebarWrapper.jsx
'use client'

import SideBar from "./SideBar";
import Header from "./Header";
import { useSidebarStore } from "../store/SidebarStore";
import { usePathname } from "next/navigation";

export default function SidebarWrapper({ children }) {
  const sidebar = useSidebarStore();
  const pathname = usePathname();

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] text-[#1C1C1C]">
      <SideBar />

      {/* Desktop sidebar spacer */}
      <div
        className={`transition-all duration-300 flex-shrink-0 hidden md:block
        ${sidebar.isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        <Header />
        <main className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F6F7FB] text-black overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
