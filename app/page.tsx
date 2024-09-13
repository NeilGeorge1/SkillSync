import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="hero min-h-screen bg-black">
        <div className="hero-content text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-6xl font-semibold text-white leading-tight">
              Grow your skills everyday
            </h1>
            <p className="py-6 text-xl text-gray-400">
              Discover the best mentors and mentees. Take the first step to reach the future you want.
            </p>
            <a className="btn btn-outline btn-black text-white text-xl px-8 py-3 hover:bg-white hover:text-black">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
