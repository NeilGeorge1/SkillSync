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
    <nav className="navbar bg-black px-6 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/logo */}
        <Link href="/" className="text-white text-2xl font-semibold tracking-wide hover:opacity-80 transition-opacity">
          SkillSync
        </Link>

        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <ul className="flex space-x-6">
              <li>
                <Link href="/profile">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2">
                    Profile
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2">
                    Projects
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-white hover:text-gray-400 transition-colors px-4 py-2">
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="text-white hover:text-gray-400 transition-colors px-4 py-2"
                >
                  Log Out
                </a>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-6">
              <li>
                <Link href="/login">
                  <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded-md">
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded-md">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/signup">
                  <span className="text-white hover:text-black hover:bg-white transition-colors px-4 py-2 rounded-md">
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
