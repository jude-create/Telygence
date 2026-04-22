"use client";
import { ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebarStore } from "../store/SidebarStore";

const SideBar = () => {
  const pathname = usePathname(); // Get the current path
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
   const sidebar = useSidebarStore();
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  const handleLogout = () => {
    console.log("User has logged out"); // Replace with your logout logic
    setIsLogoutModalOpen(false); // Close the modal after logout
  };

   const MOBILE_BREAKPOINT = 768

  useEffect(() => {
    const handleResize = () => {
      sidebar.setMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

   const topNavItems = [
    { name: 'Dashboard', path: '/', img: '/images/dashboard.png' },
    { name: 'Templates', path: '/templates', img: "/images/template.png" },
    { name: 'Drafts', path: '/drafts', img: "/images/draft.png" },
    { name: 'Tasks', path: '/tasks', img: "/images/task.png" },
   
  ];

  const bottomNavItems = [
    { name: 'Get Extension', path: 'https://example.com', img: "/images/extension.png", external: true },
    { name: 'Support', path: 'https://example.com', img: "/images/support.png", external: true },
    { name: 'My Account', path: '/account', img: "/images/Group.png" },
    { name: 'Log out', path: '/logout', img: "/images/logout.png" },
  ];

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')


  return (
    <>
      {/* Overlay */}
      {sidebar.isMobile && sidebar.isOpen && (
        <div
          onClick={sidebar.closeMobileDrawer}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

    <aside 
     className={`fixed top-0 md:h-screen left-0 z-50 transition-all duration-300 ease-in-out flex flex-col pt-4 shadow-lg bg-[#1E1636] text-[#DDD6F6]
        ${!sidebar.isMobile ? (sidebar.isCollapsed ? 'w-20 px-3' : 'w-64 px-3') : 'w-full px-5 h-[90%]'}
        ${sidebar.isMobile ? (sidebar.isOpen ? 'translate-y-0' : '-translate-y-full') : ''}`}>
      {/* Top Section */}
      <div>
       <div className="flex items-center mb-4 h-12 justify-between">
  {sidebar.isCollapsed && !sidebar.isMobile ? (
    // 🔹 COLLAPSED
    <div
      className="relative w-60  mx-auto cursor-pointer group"
      onMouseEnter={() => setIsLogoHovered(true)}
      onMouseLeave={() => setIsLogoHovered(false)}
      onClick={sidebar.toggleSidebar}
    >
      {/* Logo */}
      <Image
        src="/images/light.png"
        alt="Logo"
        width={120}
        height={40}
        className={`absolute inset-0 object-contain transition-opacity duration-200 ${
          isLogoHovered ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Hover Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          isLogoHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <ArrowRightStartOnRectangleIcon className="w-6 h-6 text-gray-300" />
      </div>
    </div>
  ) : (
    // 🔹 EXPANDED
    <>
      <div className="flex items-center gap-2">
        <Image
          src="/images/light.png"
          alt="Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
        />
       
      </div>

      <button
        onClick={sidebar.toggleSidebar}
        className="ml-auto p-2 rounded-md hover:bg-[#3B2D6D] transition"
      >
        <ArrowLeftStartOnRectangleIcon className="w-7 h-7 text-gray-300 " />
      </button>
    </>
  )}
</div>

        {/* Main Navigation Links */}
        <nav className="mt-2">
          <ul className="space-y-2">
  {topNavItems.map((item) => (
    <li key={item.name} className="relative group">
  <Link
    href={item.path}
    className={`flex items-center py-3 rounded-md transition-all duration-300
      ${sidebar.isCollapsed && !sidebar.isMobile ? 'justify-center px-2' : 'px-6'}
      ${isActive(item.path)
        ? "bg-[#3B2D6D] text-white font-bold"
        : "text-[#DDD6F6] hover:bg-[#3B2D6D] hover:text-white"
      }`}
  >
    <Image
      src={item.img}
      alt={item.name}
      width={25}
      height={25}
      className={`transition-all duration-300
        ${sidebar.isCollapsed && !sidebar.isMobile ? '' : 'scale-110'}
      `}
    />

    <span
      className={`whitespace-nowrap transition-all duration-300
        ${sidebar.isCollapsed && !sidebar.isMobile
          ? 'opacity-0 w-0 overflow-hidden'
          : 'opacity-100 w-auto ml-3'}
      `}
    >
      {item.name}
    </span>
  </Link>

  {/* Tooltip */}
  {sidebar.isCollapsed && !sidebar.isMobile && (
    <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
      {item.name}
    </span>
  )}
</li>
  ))}
</ul>
        </nav>
      </div>

      {/* Spacer */}
      <div className="md:flex-grow "></div>

      {/* Bottom Section */}
      <nav>
       <ul className="space-y-2 pb-10">
  {bottomNavItems.map((item) => {
    const baseClasses = `flex items-center py-3 rounded-md transition-all duration-300
      ${sidebar.isCollapsed && !sidebar.isMobile ? 'justify-center px-2' : 'px-6'}
      ${isActive(item.path)
        ? "bg-[#3B2D6D] text-white font-bold"
        : "text-[#DDD6F6] hover:bg-[#3B2D6D] hover:text-white"
      }`

    const content = (
      <>
        {/* Icon */}
        <span
          className={`transition-all duration-300
            ${(!sidebar.isCollapsed || sidebar.isMobile) ? 'mr-2' : ''}
          `}
        >
          <Image
            src={item.img}
            alt={item.name}
            width={25}
            height={25}
            className={`transition-all duration-300
              ${sidebar.isCollapsed && !sidebar.isMobile ? '' : 'scale-110'}
            `}
          />
        </span>

        {/* Label (fade instead of hide) */}
        <span
          className={`whitespace-nowrap transition-all duration-300
            ${sidebar.isCollapsed && !sidebar.isMobile
              ? 'opacity-0 w-0 overflow-hidden'
              : 'opacity-100 w-auto ml-2'}
          `}
        >
          {item.name}
        </span>
      </>
    )

    return (
      <li key={item.name} className="relative group">
        
        {/*  Logout */}
        {item.name === "Log out" && (
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className={`${baseClasses} cursor-pointer`}
          >
            {content}
          </div>
        )}

        {/*  External */}
        {item.external && (
          <a
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
          >
            {content}
          </a>
        )}

        {/*  Internal */}
        {!item.external && item.name !== "Log out" && (
          <Link href={item.path} className={baseClasses}>
            {content}
          </Link>
        )}

        {/*  Tooltip (collapsed only) */}
        {sidebar.isCollapsed && !sidebar.isMobile && (
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {item.name}
          </span>
        )}
      </li>
    )
  })}
</ul>
      </nav>
    </aside>
    
    {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E1636] rounded-lg space-y-4 w-[25%] h-[45%]">
            <div className="px-6 pt-4">
              <h2 className="text-base font-semibold text-center text-[#FFFFFF]">Log out of Telygence AI</h2>
            </div>
            <div className="border-t w-full border-[#737373] mb-5" />
            <div className="px-6 pt-8 ">
              <p className="text-base text-[#FFFFFF] text-center ">
              Are you sure you want to log out of your account?
              </p>
            </div>
            <div className="flex space-x-7 p-6 items-center justify-center">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-6 py-2 bg-[#3B2D6D] rounded-md  hover:scale-125  text-[#DDD6F6] transition-all ease-in-out duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#775ADA] hover:scale-125  rounded-md text-[#FFFFFF] transition-all ease-in-out duration-300"
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
