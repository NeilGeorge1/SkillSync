"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";

import Navbar from "./components/Navbar";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect user based on authentication status when "Get Started" is clicked
  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard"); // Redirect to dashboard if authenticated
    } else {
      router.push("/signup"); // Redirect to signup if not authenticated
    }
  };

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div
        className="hero max-h-screen"
        style={{ height: "45vh", marginTop: 0 }}
      >
        <div className="hero-content text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-400 to-red-400">
              Grow your skills every day
            </h1>
            <p className="py-6 text-xl text-gray-400">
              Discover the best mentors and mentees. Take the first step to
              reach the future you want.
            </p>
            <a
              onClick={handleGetStarted}
              className="btn btn-outline text-xl text-white font-semibold px-8 py-3 mt-4 hover:bg-white hover:text-black transition duration-300 ease-in-out"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-100">How it Works</h2>
          <p className="mt-4 text-lg text-gray-400">
            We connect students and mentors based on skill compatibility. Once
            matched, they can collaborate on projects and receive real-time
            feedback. Here's what makes us different:
          </p>

          {/* Feature Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card p-6 bg-gray-900 rounded-lg">
              <h3 className="text-2xl font-semibold text-white">
                Skill Matching
              </h3>
              <p className="mt-4 text-gray-400">
                Our recommender system intelligently matches students with
                mentors who have the right skills to help them grow.
              </p>
            </div>
            <div className="feature-card p-6 bg-gray-900 rounded-lg">
              <h3 className="text-2xl font-semibold text-white">
                Collaborative Projects
              </h3>
              <p className="mt-4 text-gray-400">
                Work on real-world projects that challenge your skills and give
                you hands-on experience. Collaborate and build something
                impactful.
              </p>
            </div>
            <div className="feature-card p-6 bg-gray-900 rounded-lg">
              <h3 className="text-2xl font-semibold text-white">
                Feedback System
              </h3>
              <p className="mt-4 text-gray-400">
                Receive continuous feedback from mentors to refine your work and
                achieve the best possible outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
