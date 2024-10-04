'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const validateInput = () => {
    if (!email.includes('@')) {
      setErrorMsg('Invalid email format.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return; // Validate input before calling Firebase
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res?.user) {
        setErrorMsg(''); // Clear any previous error messages
        setSuccessMsg('Account created successfully!');
        sessionStorage.setItem('user', JSON.stringify(res.user));
        setEmail('');
        setPassword('');
      }
    } catch (e) {
      console.error(e.message);
      // Handle Firebase errors and display appropriate message
      if (e.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already in use. Try logging in.');
      } else if (e.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address.');
      } else if (e.code === 'auth/weak-password') {
        setErrorMsg('Password is too weak.');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h1 className="text-gray-800 text-3xl font-bold mb-5 text-center">Create Account</h1>
        {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}
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
          onClick={handleSignUp}
          className="w-full p-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account? <a href='/login' className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
