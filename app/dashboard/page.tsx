'use client';
import Navbar from '../components/Navbar';
import Rights from '../components/Rights';
import UploadPDF from '../components/UploadPDF';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const HomePage = () => {
  const [user, loading] = useAuthState(auth); // Use loading state
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New loading state for fetching user data

  useEffect(() => {
    // Check if the user is signed in
    if (loading) return; // Wait for loading to complete

    if (!user) {
      // Redirect to home if user is not signed in
      router.push('/');
    } else {
      // User is signed in, fetch user data
      const fetchData = async () => {
        const docRef = doc(db, 'users', user.uid);

        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fullName = docSnap.data().fullName;
            const firstName = fullName.split(' ')[0]; // Extract first name
            setFirstName(firstName);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching
        }
      };

      fetchData(); // Call fetchData if user is signed in
    }
  }, [user, loading, router]); // Add dependencies

  // Show loading indicator while fetching user data
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white ">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-center p-16">
        <h1 className="text-5xl font-bold">Welcome, {firstName}!</h1>
        <p className="text-lg mb-6">This is your dashboard for collaborative project development.</p>
      </section>
    </div>
  );
};

export default HomePage;
