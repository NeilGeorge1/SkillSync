'use client';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import dayjs from 'dayjs';
import Navbar from "../components/Navbar";
import { db, auth } from "../firebase/config";

interface User {
  id: string;
  fullName: string;
  email: string;
  aboutMe: string;
  skills: string[];
  createdAt: Date;
  userType: 'student' | 'professor';
  uid: string;
}

const UserProfile = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = {
          id: userDoc.id,
          uid: userDoc.data().uid,
          fullName: userDoc.data().fullName,
          email: userDoc.data().email,
          aboutMe: userDoc.data().aboutMe,
          skills: userDoc.data().skills || [],
          //createdAt: userDoc.data().createdAt.toDate(),
          userType: userDoc.data().userType,
        } as User;
        setUserData(data);
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-700 h-12 w-12"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-32"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {userData ? (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative">
                  <div className="relative">
                    <img
                      className="w-36 h-36 rounded-full shadow-2xl ring-4 ring-blue-500 transition-transform duration-300 hover:scale-105"
                      src={`https://ui-avatars.com/api/?name=${userData.fullName}&background=random&size=144`}
                      alt={`${userData.fullName}'s avatar`}
                    />
                    <span className="absolute -bottom-2 right-0 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {userData.userType}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {userData.fullName}
                  </h1>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{userData.email}</span>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined {dayjs(userData.createdAt).format('MMMM D, YYYY')}</span>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-3 text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span>ID: {userData.uid.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                About Me
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {userData.aboutMe || "No bio provided yet."}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {userData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-500 bg-opacity-20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-opacity-30 hover:scale-105 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
                {userData.skills.length === 0 && (
                  <p className="text-gray-400">
                    No skills listed yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center text-gray-400">
              No user data available.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;