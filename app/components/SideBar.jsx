"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SideBar = () => {
  const pathname = usePathname(); // Get the current path
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    console.log("User has logged out"); // Replace with your logout logic
    setIsLogoutModalOpen(false); // Close the modal after logout
  };


  return (
    <>
    <div className="w-1/6 h-screen bg-[#1E1636] fixed shadow-md flex flex-col">
      {/* Top Section */}
      <div>
        {/* Logo Section */}
        <div className="px-7 p-6">
          <Image
            className="w-32 h-7"
            src="/images/light.png"
            alt="Logo"
            width={120}
            height={80}
          />
        </div>

        {/* Main Navigation Links */}
        <nav className="mt-2">
          <ul className="space-y-2">
            {/* Dashboard Link */}
            <li>
              <Link
                href="/"
                className={`flex items-center px-10 py-3  text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-2">
                  <Image
                    className="w-7 h-7"
                    src="/images/dashboard.png"
                    alt="Dashboard Icon"
                    height={40}
                    width={40}
                  />
                </span>
                Dashboard
              </Link>
            </li>

            {/* Templates Link */}
            <li>
              <Link
                href="/templates"
                className={`flex items-center  px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/templates"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-2">
                  <Image
                    src="/images/template.png"
                    className="w-5 h-5"
                    alt="Templates Icon"
                    height={40}
                    width={40}
                  />
                </span>
                Templates
              </Link>
            </li>

            {/* Drafts Link */}
            <li>
              <Link
                href="/drafts"
                className={`flex items-center  px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/drafts"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-2">
                  <Image
                    src="/images/draft.png"
                    className="w-6 h-6"
                    alt="Drafts Icon"
                    height={40}
                    width={40}
                  />
                </span>
                Drafts
              </Link>
            </li>

            {/* Tasks Link */}
            <li>
              <Link
                href="/tasks"
                className={`flex items-center px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/tasks"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-2">
                  <Image
                    src="/images/task.png"
                    className="w-6 h-6"
                    alt="Tasks Icon"
                    height={40}
                    width={40}
                  />
                </span>
                Tasks
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Spacer */}
      <div className="md:flex-grow "></div>

      {/* Bottom Section */}
      <nav>
        <ul className="space-y-2 pb-10">
          {/* Extension Link */}
          <li>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out hover:bg-[#3B2D6D] hover:text-white hover:font-bold"
            >
              <span className="mr-2">
                <Image
                  src="/images/extension.png"
                  className="w-6 h-6"
                  alt="Extension Icon"
                  height={40}
                  width={40}
                />
              </span>
              Get Extension
            </a>
          </li>

          {/* Support Link */}
          <li>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out hover:bg-[#3B2D6D] hover:text-white hover:font-bold"
            >
              <span className="mr-2">
                <Image
                  src="/images/support.png"
                  className="w-6 h-6"
                  alt="Support Icon"
                  height={40}
                  width={40}
                />
              </span>
              Support
            </a>
          </li>

          {/* Account Link */}
          <li>
            <Link
              href="/account"
              className={`flex items-center  px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                pathname === "/account"
                  ? "bg-[#3B2D6D] text-white font-bold"
                  : "hover:bg-[#3B2D6D] hover:text-white"
              }`}
            >
              <span className="mr-2">
                <Image
                  src="/images/Group.png"
                  className="w-6 h-6"
                  alt="Account Icon"
                  height={40}
                  width={40}
                />
              </span>
              My Account
            </Link>
          </li>

          {/* Logout Link */}
          <li>
            <div
              onClick={() => setIsLogoutModalOpen(true)}
              className={`flex items-center px-10 py-3 text-sm rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out cursor-pointer ${
                pathname === "/logout"
                  ? "bg-[#3B2D6D] text-white font-bold"
                  : "hover:bg-[#3B2D6D] hover:text-white"
              }`}
            >
              <span className="mr-2">
                <Image
                  src="/images/logout.png"
                  className="w-6 h-6"
                  alt="Logout Icon"
                  height={40}
                  width={40}
                />
              </span>
              Log out
            </div>
          </li>
        </ul>
      </nav>
    </div>
    
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
