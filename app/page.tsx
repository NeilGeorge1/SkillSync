"use client";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { ChevronRight, Users, Star, Book } from "lucide-react";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      fadeElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero relative min-h-[80vh] w-full flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>

        <div className="hero-content text-center relative z-10">
          <div className="max-w-2xl mx-auto fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <h1 className="text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-400 to-red-400 px-4 sm:px-0">
              Grow your skills every day
            </h1>
            <p className="py-6 text-xl text-gray-400 px-4 sm:px-0">
              Discover the best mentors and mentees. Take the first step to
              reach the future you want.
            </p>
            <a
              href="/signup"
              className="group inline-flex items-center gap-2 text-xl text-white font-semibold px-8 py-3 mt-4 border-2 border-white/20 rounded-lg hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
            >
              Get Started
              <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-20 mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-800 p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
              <div className="flex items-center justify-center gap-4 p-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-white">10+</div>
                  <div className="text-gray-400">Active Mentors</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 p-4">
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <Star className="w-8 h-8 text-pink-400" />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-white">0.9/5</div>
                  <div className="text-gray-400">Mentor Rating</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 p-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <Book className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-white">3+</div>
                  <div className="text-gray-400">Skill Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <h2 className="text-4xl font-bold text-gray-100">
              How it Works
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              We connect students and mentors based on skill compatibility. Once
              matched, they can collaborate on projects and receive real-time
              feedback. Here's what makes us different:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Skill Matching",
                description: "Our recommender system intelligently matches students with mentors who have the right skills to help them grow.",
                hoverColor: "blue",
              },
              {
                title: "Collaborative Projects",
                description: "Work on real-world projects that challenge your skills and give you hands-on experience. Collaborate and build something impactful.",
                hoverColor: "pink",
              },
              {
                title: "Feedback System",
                description: "Receive continuous feedback from mentors to refine your work and achieve the best possible outcomes.",
                hoverColor: "red",
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`feature-card p-8 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-${feature.hoverColor}-400/30 transition-all duration-500 fade-in opacity-0 translate-y-6 group`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <h3 className={`text-2xl font-semibold text-white group-hover:text-${feature.hoverColor}-400 transition-colors duration-300`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}