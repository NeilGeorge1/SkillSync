'use client';
import Navbar from "../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the path as necessary
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config'; // Import your Firebase auth

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
  const [otherUsers, setOtherUsers] = useState<User[]>([]); // Store all users except the logged-in user

  useEffect(() => {
    const fetchUsersData = async () => {
      if (!user) return; // Return if no user is logged in

      const usersCollectionRef = collection(db, 'users'); // Reference to users collection
      const querySnapshot = await getDocs(usersCollectionRef); // Get all users

      // Map through the documents and filter out the authenticated user
      const data = querySnapshot.docs
        .filter((doc) => doc.id !== user.uid) // Filter out the current logged-in user's document
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(), // Convert Firestore timestamp to JS Date
        })) as User[]; // Type assertion for the array of users

      setOtherUsers(data); // Save the fetched users to state
    };

    fetchUsersData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
      <div className="min-h-screen flex flex-col p-8 space-y-6">
        <Navbar />
        {otherUsers.length > 0 ? (
          otherUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-xl p-6 flex items-center space-x-6 shadow-md transition-transform transform hover:scale-105"
            >
              {/* Dynamic avatar generation */}
              <img
                className="w-20 h-20 rounded-full shadow-lg object-cover"
                src={`https://ui-avatars.com/api/?name=${user.fullName}&background=random&color=fff`}
                alt={`${user.fullName}'s avatar`}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">{user.fullName}</h2>
                <p className="text-gray-400">Main Domain: {user.mainDomain}</p>
                <p className="text-gray-400">Sub Domain: {user.subDomain}</p>
                <p className="text-gray-400">About Me: {user.aboutMe}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-center text-lg">No other users found.</div>
        )}
      </div>
  );      
};

export default UserProfile;
