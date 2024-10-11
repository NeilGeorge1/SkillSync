import "./globals.css"; // Import your global CSS
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-400 to-red-400">
              Grow your skills everyday
            </h1>
            <p className="py-6 text-xl text-gray-400">
              Discover the best mentors and mentees. Take the first step to
              reach the future you want.
            </p>
            <a
              href="/signup"
              className="btn btn-outline text-xl text-white font-semibold px-8 py-3 mt-4 hover:bg-white hover:text-black transition duration-300 ease-in-out"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
