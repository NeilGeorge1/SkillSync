'use client'
import { updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth'
import dayjs from 'dayjs'
import { db, auth, storage } from '../firebase/config'
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
  Save,
  X,
  Plus,
  Trash2,
  Key
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Ensure that db and auth are correctly configured in '../firebase/config'
// Ensure that Navbar and Footer components are correctly implemented in '../components/Navbar' and '../components/Footer'

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
  avatarUrl?: string
}

export default function UserProfile() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<Partial<User>>({})
  const [newSkill, setNewSkill] = useState('')
  const router = useRouter()

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
          avatarUrl: userDoc.data().avatarUrl,
        } as User
        setUserData(data)
        setEditedData(data)
      }
    }
    fetchUserData()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value })
  }

  const handleSave = async (field: string) => {
    if (!user) return
    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, { [field]: editedData[field as keyof User] })
    setUserData({ ...userData, ...editedData } as User)
    setEditingField(null)
  }

  const handleAddSkill = async () => {
    if (newSkill && !userData?.skills.includes(newSkill)) {
      const updatedSkills = [...(userData?.skills || []), newSkill]
      const userDocRef = doc(db, 'users', user!.uid)
      await updateDoc(userDocRef, { skills: updatedSkills })
      setUserData({ ...userData!, skills: updatedSkills })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = userData!.skills.filter(skill => skill !== skillToRemove)
    const userDocRef = doc(db, 'users', user!.uid)
    await updateDoc(userDocRef, { skills: updatedSkills })
    setUserData({ ...userData!, skills: updatedSkills })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0]
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      const userDocRef = doc(db, 'users', user.uid)
      await updateDoc(userDocRef, { avatarUrl: downloadURL })
      setUserData({ ...userData!, avatarUrl: downloadURL })
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action will permanently delete all your data, including past projects and connections. This action cannot be undone."
    )
    if (confirmDelete) {
      try {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', user.uid))
        // Delete user from Firebase Authentication
        await deleteUser(user)
        // Redirect to home page or sign up page
        router.push('/')
      } catch (error) {
        console.error("Error deleting account:", error)
        alert("An error occurred while deleting your account. Please try again.")
      }
    }
  }

  const handleChangePassword = async () => {
    if (!user || !user.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      alert("A password reset email has been sent to your email address.")
    } catch (error) {
      console.error("Error sending password reset email:", error)
      alert("An error occurred while sending the password reset email. Please try again.")
    }
  }

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
              <div className="text-center relative">
                <div className="relative inline-block">
                  <img
                    src={userData.avatarUrl || `https://ui-avatars.com/api/?name=${userData.fullName}&background=random&size=128`}
                    alt={userData.fullName}
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                    <Edit className="w-4 h-4 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      onChange={handleAvatarChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-bold text-white">{userData.fullName}</h2>
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                  {userData.userType}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <ProfileItem icon={Mail} text={userData.email} />
                <ProfileItem icon={Calendar} text={`Joined ${dayjs(userData.createdAt).format('MMMM D, YYYY')}`} />
                {/*
                <ProfileItem icon={MapPin} text={userData.location} />
                <ProfileItem icon={Briefcase} text={userData.occupation} />
                <ProfileItem icon={GraduationCap} text={userData.education} />
                */}
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <SocialLink href={userData.githubUrl} icon={Github} />
                <SocialLink href={userData.linkedinUrl} icon={Linkedin} />
                <SocialLink href={userData.twitterUrl} icon={Twitter} />
              </div>
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleChangePassword}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">About Me</h3>
                  {editingField === 'aboutMe' ? (
                    <button onClick={() => handleSave('aboutMe')} className="text-blue-500 hover:text-blue-400">
                      <Save className="w-5 h-5" />
                    </button>
                  ) : (
                    <button onClick={() => setEditingField('aboutMe')} className="text-gray-400 hover:text-white">
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {editingField === 'aboutMe' ? (
                  <textarea
                    name="aboutMe"
                    value={editedData.aboutMe || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded p-2"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-300">
                    {userData.aboutMe || "No bio provided yet."}
                  </p>
                )}
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Skills & Expertise</h3>
                  <button onClick={() => setEditingField('skills')} className="text-gray-400 hover:text-white">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <span key={skill} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
                      {skill}
                      {editingField === 'skills' && (
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </span>
                  ))}
                  {userData.skills.length === 0 && (
                    <p className="text-gray-400">No skills listed yet.</p>
                  )}
                </div>
                {editingField === 'skills' && (
                  <div className="mt-4 flex">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill"
                      className="flex-grow bg-gray-700 text-white rounded-l p-2"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
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
                  <div className="h-4 bg-gray-700 rounded w-full  animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              {Array(3).fill(null).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
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