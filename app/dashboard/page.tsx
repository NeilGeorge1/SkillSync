'use client';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { db } from '@/app/firebase/config'; // Import Firestore database
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');
  const [firstName, setFirstName] = useState(''); // State to hold first name

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', user.uid); // Reference to the document

      try {
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          const fullName = docSnap.data().fullName; // Get full name from document
          const firstName = fullName.split(' ')[0]; // Extract first name
          setFirstName(firstName); // Set the first name to state
        } else {
          console.log('No such document!'); // Handle the case where the document doesn't exist
        }
      } catch (error) {
        console.error('Error fetching document:', error); // Log the error for further investigation
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means it runs once on mount

  // Check if user is not logged in
  if (!user && !userSession) {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Hero Section */}  
      <section className="text-center p-16">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Welcome, {firstName}!</h1> {/* Display first name here */}
        <p className="text-lg mb-6">This is your dashboard to collaborative project development.</p>
      </section>

      {/* Features Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor-Mentee Matching</h3>
            <p>We match mentors and mentees based on skills, experience, and project preferences.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Project Collaboration</h3>
            <p>Work on projects together, share progress, and grow your skills under expert guidance.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Feedback & Growth</h3>
            <p>Get continuous feedback from mentors, improve, and succeed in your project endeavors.</p>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pair 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor: John Doe</h3>
            <p className="mb-2">Mentee: Jane Smith</p>
            <p className="mb-4">Current Project: AI-based Recommendation System</p>
            <Link href="/project/1" className="text-blue-500 hover:text-blue-700">
              View Project
            </Link>
          </div>
          {/* Pair 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor: Sarah Connor</h3>
            <p className="mb-2">Mentee: Tim Lee</p>
            <p className="mb-4">Current Project: Mobile App Development</p>
            <Link href="/project/2" className="text-blue-500 hover:text-blue-700">
              View Project
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} SkillSync. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
