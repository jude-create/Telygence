"use client";

import Image from "next/image";
import Link from "next/link";

export default function SidebarNavItem({
  item,
  isActive,
  isCollapsed,
  isMobile,
  onClick,
  children,
}) {
  const baseClasses = `flex items-center min-h-11 rounded-xl transition-all duration-200 ${
    isCollapsed && !isMobile ? "justify-center px-2" : "px-4"
  } ${
    isActive
      ? "bg-white/10 text-white font-semibold shadow-sm ring-1 ring-white/10"
      : "text-[#DDD6F6] hover:bg-white/10 hover:text-white"
  }`;

  const content = children || (
    <>
      <span className={`transition-all duration-300 ${(!isCollapsed || isMobile) ? "mr-2" : ""}`}>
        <Image src={item.img} alt="" width={24} height={24} className="transition-all duration-300" />
      </span>
      <span className={`whitespace-nowrap text-sm transition-all duration-300 ${isCollapsed && !isMobile ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2"}`}>
        {item.name}
      </span>
    </>
  );

  const tooltip = isCollapsed && !isMobile && (
    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1C1C1C] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-lg">
      {item.name}
    </span>
  );

  return (
    <li className="relative group">
      {item.external ? (
        <a href={item.path} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          {content}
        </a>
      ) : item.asButton ? (
        <button type="button" onClick={onClick} className={`${baseClasses} w-full cursor-pointer`}>
          {content}
        </button>
      ) : (
        <Link href={item.path} className={baseClasses} onClick={onClick}>
          {content}
        </Link>
      )}
      {tooltip}
    </li>
  );
}
