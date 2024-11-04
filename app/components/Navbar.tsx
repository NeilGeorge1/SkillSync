import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderGit2, 
  LogOut, 
  Mail, 
  LogIn, 
  UserPlus,
  Menu,
  X,
  ChevronDown,
  User
} from "lucide-react"
import SearchBar from "./SearchBar"

export default function Component({ userData = { fullName: 'Jane Smith' } }) {
  console.log('userData:', userData);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const user = sessionStorage.getItem("user")
    setIsAuthenticated(!!user)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("user")
    setIsAuthenticated(false)
    setIsProfileDropdownOpen(false)
    router.push("/login")
  }

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link href={href}>
      <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md">
        <Icon size={20} />
        <span>{children}</span>
      </span>
    </Link>
  )

  const MobileNavLink = ({ href, icon: Icon, children, onClick }) => (
    <Link href={href} onClick={onClick}>
      <span className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md">
        <Icon size={20} />
        <span>{children}</span>
      </span>
    </Link>
  )

  return (
    <nav 
      id="main-navbar"
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md py-2 shadow-lg' 
          : 'bg-gray-900/90 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 hover:opacity-80 transition-opacity"
          >
            SkillSync
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isAuthenticated ? (
              <>
                <SearchBar />
                <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink href="/projects" icon={FolderGit2}>Projects</NavLink>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors rounded-full"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-700 border border-white flex justify-center items-center">
                      <User size={16} className="text-white" />
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10">
                      <Link href="/profile" onClick={() => setIsProfileDropdownOpen(false)}>
                        <span className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                          Manage Profile
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink href="/login" icon={LogIn}>Login</NavLink>
                <NavLink href="/contact-us" icon={Mail}>Contact Us</NavLink>
                <Link href="/signup">
                  <span className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md">
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <SearchBar />
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/dashboard" icon={LayoutDashboard} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink href="/projects" icon={FolderGit2} onClick={() => setIsMobileMenuOpen(false)}>Projects</MobileNavLink>
                <MobileNavLink href="/profile" icon={() => (
                  <div className="w-6 h-6 rounded-full bg-gray-700 border border-white flex justify-center items-center">
                    <User size={12} className="text-white" />
                  </div>
                )} onClick={() => setIsMobileMenuOpen(false)}>Manage Profile</MobileNavLink>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors px-4 py-2 rounded-md w-full"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" icon={LogIn} onClick={() => setIsMobileMenuOpen(false)}>Login</MobileNavLink>
                <MobileNavLink href="/contact-us" icon={Mail} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</MobileNavLink>
                <MobileNavLink href="/signup" icon={UserPlus} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-blue-400">Sign Up</span>
                </MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}