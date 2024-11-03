'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/app/firebase/config'
import { getTechHeadlines } from '@/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { BarChart3, BookOpen, Calendar, ChevronRight, Clock, Users } from 'lucide-react'

const HomePage = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [userType, setUserType] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [techNews, setTechNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/')
    } else {
      const fetchData = async () => {
        const docRef = doc(db, 'users', user.uid)
        try {
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setFirstName(data.fullName.split(' ')[0])
            setUserType(data.userType)
          }
        } catch (error) {
          console.error('Error fetching document:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getTechHeadlines()
        setTechNews(news)
      } catch (error) {
        console.error('Error fetching tech news:', error)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const quickStats = [
    { title: 'Active Projects', value: '5', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Team Members', value: '12', icon: Users, color: 'bg-green-500' },
    { title: 'Hours Logged', value: '87', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Upcoming Deadlines', value: '3', icon: Calendar, color: 'bg-red-500' },
  ]

  const recentActivities = [
    { action: 'Commented on', project: 'AI Image Recognition', time: '2 hours ago' },
    { action: 'Updated', project: 'Blockchain Voting System', time: '5 hours ago' },
    { action: 'Created new task in', project: 'Smart Home IoT', time: 'Yesterday' },
  ]

  const upcomingEvents = [
    { title: 'Team Standup', date: 'Today, 2:00 PM' },
    { title: 'Project Review', date: 'Tomorrow, 10:00 AM' },
    { title: 'Tech Talk: AI Ethics', date: 'Friday, 3:00 PM' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-4">
            Welcome back, {firstName}!
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your hub for collaborative project development and tech innovation.
          </p>
          {userType === 'professor' && (
            <button
              onClick={() => router.push('/make-project')}
              className="mt-6 inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Project
            </button>
          )}
        </section>

        {/* Quick Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <h3 className="text-gray-400 font-medium">{stat.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activities and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activities */}
          <section className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-gray-300">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-blue-400">{activity.project}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 font-medium">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Tech News Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Latest Tech News</h2>
            <div className="flex space-x-2">
              <button className="scroll-btn left p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="scroll-btn right p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {newsLoading ? (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl h-[22rem] w-[25rem] flex-shrink-0 animate-pulse">
                  <div className="h-32 bg-gray-700 rounded-t-xl"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 scrollbar-hide scroll-smooth pb-4" id="news-container">
                {techNews.length > 0 ? (
                  techNews.map((news, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl h-[22rem] w-[25rem] flex-shrink-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={news.urlToImage || '/default-news-image.jpg'}
                          alt={news.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 opacity-50"></div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-white">
                          {news.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {news.description}
                        </p>
                        <a
                          href={news.url}
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 w-full py-8">
                    No news available at the moment.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
      <Footer/>
    </div>
  )
}

export default HomePage