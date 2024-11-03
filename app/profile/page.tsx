'use client'

import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import dayjs from 'dayjs'
import { db, auth } from '../firebase/config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Calendar,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Github,
  Linkedin,
  Twitter,
  Edit,
} from 'lucide-react'

interface User {
  id: string
  fullName: string
  email: string
  aboutMe: string
  skills: string[]
  createdAt: Date
  userType: 'student' | 'professor'
  uid: string
  location?: string
  occupation?: string
  education?: string
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

export default function UserProfile() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = {
          id: userDoc.id,
          uid: userDoc.data().uid,
          fullName: userDoc.data().fullName,
          email: userDoc.data().email,
          aboutMe: userDoc.data().aboutMe,
          skills: userDoc.data().skills || [],
          //createdAt: userDoc.data().createdAt?.toDate() || new Date(),
          userType: userDoc.data().userType,
          location: userDoc.data().location || 'Not specified',
          occupation: userDoc.data().occupation || 'Not specified',
          education: userDoc.data().education || 'Not specified',
          githubUrl: userDoc.data().githubUrl,
          linkedinUrl: userDoc.data().linkedinUrl,
          twitterUrl: userDoc.data().twitterUrl,
        } as User
        setUserData(data)
      }
    }
    fetchUserData()
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {userData ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${userData.fullName}&background=random&size=128`}
                  alt={userData.fullName}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-white">{userData.fullName}</h2>
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                  {userData.userType}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <ProfileItem icon={Mail} text={userData.email} />
                <ProfileItem icon={Calendar} text={`Joined ${dayjs(userData.createdAt).format('MMMM D, YYYY')}`} />
                <ProfileItem icon={MapPin} text={userData.location} />
                <ProfileItem icon={Briefcase} text={userData.occupation} />
                <ProfileItem icon={GraduationCap} text={userData.education} />
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <SocialLink href={userData.githubUrl} icon={Github} />
                <SocialLink href={userData.linkedinUrl} icon={Linkedin} />
                <SocialLink href={userData.twitterUrl} icon={Twitter} />
              </div>
              <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">About Me</h3>
                <p className="text-gray-300">
                  {userData.aboutMe || "No bio provided yet."}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <span key={skill} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {userData.skills.length === 0 && (
                    <p className="text-gray-400">No skills listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-10 text-center">
            <p className="text-gray-400">No user data available.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function ProfileItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-300">
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  )
}

function SocialLink({ href, icon: Icon }: { href?: string; icon: React.ElementType }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/4 mx-auto animate-pulse"></div>
            </div>
            <div className="mt-6 space-y-4">
              {Array(5).fill(null).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="w-full h-10 bg-gray-700 rounded mt-6 animate-pulse"></div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {Array(5).fill(null).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}