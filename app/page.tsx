'use client'

import { useEffect } from "react"
import { ChevronRight, Users, Star, Book, CheckCircle } from "lucide-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
      }
    )

    const fadeElements = document.querySelectorAll('.fade-in')
    fadeElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      fadeElements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  return (
    <div className="min-h-screen text-white">
      <Navbar/>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
            Grow Your Skills Every Day
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out delay-100">
            Discover the best mentors and mentees. Take the first step to reach the future you want.
          </p>
          <a
            href="/signup"
            className="group inline-flex items-center gap-2 text-xl text-white font-semibold px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out delay-200"
          >
            Get Started
            <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
              {[
                { icon: Users, value: "10+", label: "Active Mentors", color: "green" },
                { icon: Star, value: "0.9/5", label: "Mentor Rating", color: "yellow" },
                { icon: Book, value: "3+", label: "Skill Categories", color: "pink" },
              ].map((stat, index) => (
                <div key={stat.label} className="p-10 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${stat.color}-500 bg-opacity-10 mb-4`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
              How it Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We connect students and mentors based on skill compatibility. Once matched, they can collaborate on projects and receive real-time feedback. Here's what makes us different:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Skill Matching",
                description: "Our recommender system intelligently matches students with mentors who have the right skills to help them grow.",
                color: "red",
              },
              {
                title: "Collaborative Projects",
                description: "Work on real-world projects that challenge your skills and give you hands-on experience. Collaborate and build something impactful.",
                color: "blue",
              },
              {
                title: "Feedback System",
                description: "Receive continuous feedback from mentors to refine your work and achieve the best possible outcomes.",
                color: "green",
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`p-8 bg-gray-800 rounded-2xl shadow-xl transition-all duration-500 fade-in opacity-0 translate-y-6 hover:shadow-2xl hover:scale-105`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full bg-${feature.color}-500 bg-opacity-10 flex items-center justify-center mb-6`}>
                  <CheckCircle className={`w-8 h-8 text-${feature.color}-400`} />
                </div>
                <h3 className={`text-2xl font-semibold mb-4 text-${feature.color}-400`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Student",
                content: "The mentorship I received was invaluable. It helped me land my dream job!",
              },
              {
                name: "Sarah Lee",
                role: "Mentor",
                content: "Being a mentor on this platform has been incredibly rewarding. I've seen my mentees grow exponentially.",
              },
              {
                name: "Michael Chen",
                role: "Student",
                content: "The collaborative projects gave me real-world experience that I couldn't get anywhere else.",
              },
            ].map((review, index) => (
              <div
                key={review.name}
                className="bg-gray-800 p-8 rounded-2xl shadow-xl fade-in opacity-0 translate-y-6 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="text-gray-300 mb-6">"{review.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold mr-4">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-gray-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}