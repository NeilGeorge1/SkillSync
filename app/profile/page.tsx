'use client';
import Navbar from "../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config"; // Import your Firebase config
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Import Firestore database

export default function Profile() {
  const [user, loadingUser] = useAuthState(auth); // Get the current authenticated user
  const [profileData, setProfileData] = useState(null); // State to hold profile data
  const [loadingProfile, setLoadingProfile] = useState(true); // State to track loading

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (loadingUser) return; // Exit if user is still loading
      if (!user) {
        console.error("No user is authenticated.");
        setLoadingProfile(false);
        return; // Exit if there is no user
      }

      const docRef = doc(db, 'users', user.uid); // Reference to the user document using UID
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data()); // Set the profile data
        } else {
          console.error('No such document!');
          setProfileData(null); // No profile data found
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoadingProfile(false); // Set loading to false
      }
    };

    fetchUserProfile();
  }, [user, loadingUser]); // Fetch data when user changes

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No profile data available.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen text-gray-100 flex items-center justify-center px-6 py-10">
        <div className="bg-gray-900 bg-opacity-70 shadow-xl p-10 rounded-2xl max-w-lg w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mt-6 text-gray-200">{profileData.fullName}</h1>
            <p className="text-sm text-gray-400 mt-2">
              {profileData.mainDomain} | {profileData.subDomain}
            </p>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-medium text-gray-100">About Me</h2>
            <p className="mt-4 text-gray-400">
              {profileData.aboutMe || "This user hasn't provided an about section yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
