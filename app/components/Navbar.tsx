"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  UserCircle, 
  FolderGit2, 
  LogOut, 
  Mail, 
  LogIn, 
  UserPlus 
} from "lucide-react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsAuthenticated(!!user);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <nav 
      id="main-navbar"
      className={`w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[rgba(10,25,47,0.95)] backdrop-blur-md py-3 shadow-lg' 
          : 'bg-[rgba(10,25,47,0.9)] py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 hover:opacity-80 transition-opacity"
        >
          SkillSync
        </Link>

        <div className="flex items-center">
          {isAuthenticated ? (
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/dashboard">
                  <span className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-4 py-2 rounded-md">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <span className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-4 py-2 rounded-md">
                    <UserCircle size={20} />
                    <span>Profile</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <span className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors px-4 py-2 rounded-md">
                    <FolderGit2 size={20} />
                    <span>Projects</span>
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors px-4 py-2 rounded-md"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/login">
                  <span className="flex items-center space-x-2 text-white hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md">
                    <LogIn size={20} />
                    <span>Login</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <span className="flex items-center space-x-2 text-white hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md">
                    <Mail size={20} />
                    <span>Contact Us</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <span className="flex items-center space-x-2 text-white bg-gray-800 hover:bg-white hover:text-gray-900 transition-colors px-4 py-2 rounded-md">
                    <UserPlus size={20} />
                    <span>Sign Up</span>
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