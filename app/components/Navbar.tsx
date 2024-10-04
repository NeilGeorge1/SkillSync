import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="navbar bg-gray-800 shadow-md py-0">
      <div className="flex-auto">
        {/* Minimalist brand/logo */}
        <Link href="/" className="text-white text-2xl font-semibold tracking-wide">
          SkillSync
        </Link>
      </div>
      <div className="flex-none">
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
      </div>
    </div>
  );
}

export default Navbar;
