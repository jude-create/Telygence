"use client";

import { ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutModal from "../modals/LogoutModal";
import { useSidebarStore } from "../store/SidebarStore";
import SidebarNavItem from "./sidebar/SidebarNavItem";

const topNavItems = [
  { name: "Dashboard", path: "/", img: "/images/dashboard.png" },
  { name: "Templates", path: "/templates", img: "/images/template.png" },
  { name: "Drafts", path: "/drafts", img: "/images/draft.png" },
  { name: "Tasks", path: "/tasks", img: "/images/task.png" },
];

const bottomNavItems = [
  { name: "Get Extension", path: "https://example.com/extension", img: "/images/extension.png", external: true },
  { name: "Support", path: "https://example.com/support", img: "/images/support.png", external: true },
  { name: "My Account", path: "/account", img: "/images/Group.png" },
  { name: "Log out", path: "/logout", img: "/images/logout.png", asButton: true },
];

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const sidebar = useSidebarStore();
  const setMobile = useSidebarStore((state) => state.setMobile);
  const setCollapsed = useSidebarStore((state) => state.setCollapsed);
  const [mounted, setMounted] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    handleResize();
    const saved = window.localStorage.getItem("telygence-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
    setMounted(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobile, setCollapsed]);

  useEffect(() => {
    if (mounted && !sidebar.isMobile) {
      window.localStorage.setItem("telygence-sidebar-collapsed", String(sidebar.isCollapsed));
    }
  }, [mounted, sidebar.isCollapsed, sidebar.isMobile]);

  if (!mounted) return null;

  const handleNavClick = () => {
    if (sidebar.isMobile) sidebar.closeMobileDrawer();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.clear();
      sessionStorage.clear();
      await signOut({ redirectUrl: "/sign-in" });
    } finally {
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      router.replace("/sign-in");
      router.refresh();
    }
  };

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);
  const collapsed = sidebar.isCollapsed && !sidebar.isMobile;

  return (
    <>
      {sidebar.isMobile && sidebar.isOpen && (
        <div onClick={sidebar.closeMobileDrawer} className="h-full w-full fixed top-0 left-0 bg-gray-900/45 backdrop-blur-[1px] z-40" />
      )}

      <aside className={`fixed top-0 pt-4 left-0 h-full md:h-screen z-50 flex flex-col shadow-lg bg-[#1E1636] text-[#DDD6F6] transition-all duration-300 ease-in-out ${!sidebar.isMobile && (sidebar.isCollapsed ? "w-20 px-3" : "w-64 px-4")} ${sidebar.isMobile && "w-[82%] max-w-[320px] px-5 py-5"} ${sidebar.isMobile && (sidebar.isOpen ? "translate-x-0" : "-translate-x-full")}`}>
        <div className="flex items-center mb-6 h-12 justify-between">
          {collapsed ? (
            <button
              className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 cursor-pointer group"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={sidebar.toggleSidebar}
              aria-label="Expand sidebar"
            >
              <Image src="/images/light.png" alt="Telygence" width={44} height={44} className={`h-9 w-9 object-contain transition-opacity duration-200 ${isLogoHovered ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isLogoHovered ? "opacity-100" : "opacity-0"}`}>
                <ArrowRightStartOnRectangleIcon className="w-6 h-6 text-gray-300" />
              </span>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 shrink-0">
                  <Image src="/images/light.png" alt="Telygence" width={44} height={44} className="h-9 w-9 object-contain" />
                </span>
                <div className="min-w-0">
                  <p className="text-white text-lg font-semibold leading-tight">Telygence</p>
                  <p className="text-[#BEB6E5] text-xs leading-tight">AI workspace</p>
                </div>
              </div>
              <button onClick={sidebar.toggleSidebar} className="ml-auto p-2 rounded-lg hover:bg-[#3B2D6D] transition hidden md:block" aria-label="Collapse sidebar">
                <ArrowLeftStartOnRectangleIcon className="w-7 h-7 text-gray-300" />
              </button>
              <button onClick={sidebar.closeMobileDrawer} className="ml-auto p-2 rounded-lg hover:bg-[#3B2D6D] transition md:hidden" aria-label="Close navigation menu">
                <XMarkIcon className="w-6 h-6 text-gray-300" />
              </button>
            </>
          )}
        </div>

        <nav className="mt-1">
          <ul className="space-y-2">
            {topNavItems.map((item) => (
              <SidebarNavItem key={item.name} item={item} isActive={isActive(item.path)} isCollapsed={sidebar.isCollapsed} isMobile={sidebar.isMobile} onClick={handleNavClick} />
            ))}
          </ul>
        </nav>

        <div className="md:flex-grow" />

        <nav>
          <ul className="md:space-y-2 space-y-4 pb-14">
            {bottomNavItems.map((item) => (
              <SidebarNavItem
                key={item.name}
                item={item}
                isActive={!item.external && isActive(item.path)}
                isCollapsed={sidebar.isCollapsed}
                isMobile={sidebar.isMobile}
                onClick={item.asButton ? () => setIsLogoutModalOpen(true) : handleNavClick}
              />
            ))}
          </ul>
        </nav>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
