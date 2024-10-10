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

      {/* Features Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-4">Mentor-Mentee Matching</h3>
            <p>We match mentors and mentees based on skills, experience, and project preferences.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-4">Project Collaboration</h3>
            <p>Work on projects together, share progress, and grow your skills under expert guidance.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-4">Feedback & Growth</h3>
            <p>Get continuous feedback from mentors, improve, and succeed in your project endeavors.</p>
          </div>
        </div>
      </section>

      {/* PDF Upload Section */}
      <section className="p-0">
        <h2 className="text-3xl font-bold text-center mb-6">Upload Your PDF Here</h2>
        <div className="flex justify-center">
          <UploadPDF />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
