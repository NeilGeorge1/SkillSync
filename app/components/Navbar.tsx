"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  // const {is.}
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on component mount
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsAuthenticated(!!user); // Set to true if user exists, otherwise false
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav className="navbar bg-[rgba(10,25,47,0.9)] px-6 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500"
        >
          SkillSync
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <ul className="flex space-x-8">
              <li>
                <Link href="/profile">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2 rounded-md">
                    Profile
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2 rounded-md">
                    Projects
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2 rounded-md">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="text-white hover:text-red-500 transition-colors px-4 py-2 rounded-md"
                >
                  Log Out
                </a>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-6">
              <li>
                <Link href="/login">
                  <span className="text-white hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md">
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <span className="text-white hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li className="relative">
              <Link href="/signup">
                <span className="text-white bg-gray-800 hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
