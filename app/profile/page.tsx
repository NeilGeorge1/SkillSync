'use client';
import Navbar from "../components/Navbar";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the path as necessary
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config'; // Adjust the import path for your auth configuration
import dayjs from 'dayjs'; // For formatting dates

// Define an interface for user data
interface User {
  id: string;
  fullName: string;
  email: string;
  aboutMe: string;
  mainDomain: string;
  subDomain: string;
  createdAt: Date;
}

const UserProfile = () => {
  const [user, loading] = useAuthState(auth); // Get the logged-in user
  const [userData, setUserData] = useState<User | null>(null); // Store single user data

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return; // Return if no user is logged in

      const userDocRef = doc(db, 'users', user.uid); // Use user UID to get the document
      const userDoc = await getDoc(userDocRef); // Fetch the document

      if (userDoc.exists()) {
        const data = {
          id: userDoc.id,
          ...userDoc.data(),
          createdAt: userDoc.data().createdAt.toDate(), // Convert Firestore timestamp to JS Date
        } as User; // Type assertion
        setUserData(data); // Save the fetched data
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black p-6">
      <Navbar/>
      {userData ? (
        <div className="bg-gray-900 shadow-md rounded-lg p-6 w-full max-w-2xl mt-8">
          <div className="flex items-center space-x-6 mb-4">
            <img
              className="w-24 h-24 rounded-full shadow-lg"
              src={`https://ui-avatars.com/api/?name=${userData.fullName}&background=random&color=fff`} // Dynamic avatar generation with white text
              alt="User avatar"
            />
            <div>
              <h2 className="text-3xl font-semibold text-white">{userData.fullName}</h2>
              <p className="text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-500">
                Joined on {dayjs(userData.createdAt).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-4 pt-4">
            <h3 className="text-lg font-semibold text-white mb-2">About Me</h3>
            <p className="text-gray-300 text-base mb-4">{userData.aboutMe}</p>

            <h3 className="text-lg font-semibold text-white mb-2">Main Domain</h3>
            <p className="text-gray-300 text-base mb-4">{userData.mainDomain}</p>

            <h3 className="text-lg font-semibold text-white mb-2">Sub Domain</h3>
            <p className="text-gray-300 text-base">{userData.subDomain}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-300 text-xl">No user information available.</div>
      )}
    </div>
  );
};

export default UserProfile;
