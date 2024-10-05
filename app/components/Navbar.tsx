'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check if user is authenticated on component mount
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    setIsAuthenticated(!!user); // Set to true if user exists, otherwise false
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <div className="navbar bg-gray-800 shadow-md py-0">
      <div className="flex-auto">
        {/* Brand/logo */}
        <Link href="/" className="text-white text-2xl font-semibold tracking-wide">
          SkillSync
        </Link>
      </div>

      <div className="flex-none">
        {isAuthenticated ? (
          <ul className="menu menu-horizontal px-4 space-x-2">
            <li>
              <Link href="/profile">
                <span className="text-white hover:text-gray-400 transition-colors px-4 py-2 rounded">
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link href="/projects">
                <span className="text-white hover:text-gray-400 transition-colors px-4 py-2 rounded">
                  Projects
                </span>
              </Link>
            </li>
            <li>
              <a href="#" onClick={handleLogout} className="text-white hover:text-gray-400 transition-colors px-1 py-1 rounded">
                Log Out
              </a>
            </li>
          </ul>
        ) : (
          <ul className="menu menu-horizontal px-4 space-x-2">
            <li>
              <Link href="/login">
                <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded">
                  Login
                </span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact-us">
                <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded">
                  Contact Us
                </span>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded">
                  Sign Up
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
