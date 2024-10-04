'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res?.user) {
        // Only set session and redirect if authentication is successful
        sessionStorage.setItem('user', JSON.stringify(res.user));
        setEmail('');
        setPassword('');
        router.push('/dashboard');
      } else {
        console.error('No user found in response');
      }
    } catch (e) {
      console.error('Error signing in:', e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h1 className="text-gray-800 text-3xl font-bold mb-5 text-center">Sign In</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {error && <p className="mt-2 text-center text-red-600">{error.message}</p>}

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
