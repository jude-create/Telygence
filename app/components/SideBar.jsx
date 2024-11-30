"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div className="w-1/6 h-screen bg-[#1E1636] fixed shadow-md flex flex-col">
      {/* Top Section */}
      <div>
        {/* Logo Section */}
        <div className="p-10">
          <Image
            className="w-40 h-9"
            src="/images/light.png"
            alt="Logo"
            width={120}
            height={80}
          />
        </div>

        {/* Main Navigation Links */}
        <nav className="mt-8">
          <ul className="space-y-4">
            {/* Dashboard Link */}
            <li>
              <Link
                href="/"
                className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-3">
                  <Image
                    className="w-9 h-9"
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
                className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/templates"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-4">
                  <Image
                    src="/images/template.png"
                    className="w-8 h-8"
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
                className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/drafts"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-4">
                  <Image
                    src="/images/draft.png"
                    className="w-8 h-8"
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
                className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                  pathname === "/tasks"
                    ? "bg-[#3B2D6D] text-white font-bold"
                    : "hover:bg-[#3B2D6D] hover:text-white"
                }`}
              >
                <span className="mr-4">
                  <Image
                    src="/images/task.png"
                    className="w-8 h-8"
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
      <div className="flex-grow"></div>

      {/* Bottom Section */}
      <nav>
        <ul className="space-y-4 pb-24">
          {/* Extension Link */}
          <li>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out hover:bg-[#3B2D6D] hover:text-white hover:font-bold"
            >
              <span className="mr-4">
                <Image
                  src="/images/extension.png"
                  className="w-9 h-9"
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
              className="flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out hover:bg-[#3B2D6D] hover:text-white hover:font-bold"
            >
              <span className="mr-4">
                <Image
                  src="/images/support.png"
                  className="w-8 h-8"
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
              className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                pathname === "/account"
                  ? "bg-[#3B2D6D] text-white font-bold"
                  : "hover:bg-[#3B2D6D] hover:text-white"
              }`}
            >
              <span className="mr-4">
                <Image
                  src="/images/Group.png"
                  className="w-8 h-8"
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
            <Link
              href="/logout"
              className={`flex items-center px-10 py-6 text-xl rounded-md text-[#DDD6F6] transition-all duration-500 ease-in-out ${
                pathname === "/logout"
                  ? "bg-[#3B2D6D] text-white font-bold"
                  : "hover:bg-[#3B2D6D] hover:text-white"
              }`}
            >
              <span className="mr-4">
                <Image
                  src="/images/logout.png"
                  className="w-8 h-8"
                  alt="Logout Icon"
                  height={40}
                  width={40}
                />
              </span>
              Log out
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
