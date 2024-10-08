'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { db } from '@/app/firebase/config';  // Import Firestore database
import { doc, setDoc } from 'firebase/firestore';  // Use `setDoc` and `doc`

const SignUp = () => {
  const [email, setEmail] = useState<string>('');  // Explicit type for email
  const [password, setPassword] = useState<string>('');  // Explicit type for password
  const [fullName, setFullName] = useState<string>('');  // Explicit type for full name
  const [mainDomain, setMainDomain] = useState<string>('');  // Explicit type for main domain
  const [subDomain, setSubDomain] = useState<string>('');  // Explicit type for sub domain
  const [aboutMe, setAboutMe] = useState<string>('');  // Explicit type for about me
  const [errorMsg, setErrorMsg] = useState<string>('');  // Explicit type for error message
  const [successMsg, setSuccessMsg] = useState<string>('');  // Explicit type for success message
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
    if (!fullName) {
      setErrorMsg('Full name is required.');
      return false;
    }
    if (!mainDomain) {
      setErrorMsg('Main domain is required.');
      return false;
    }
    if (!subDomain) {
      setErrorMsg('Sub-domain is required.');
      return false;
    }
    if (!aboutMe) {
      setErrorMsg('About me is required.');
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

        // Firestore database write using `setDoc` and UID as the document ID
        try {
          const userDocRef = doc(db, 'users', res.user.uid);  // Create a reference to the user's document with UID as document ID
          await setDoc(userDocRef, {
            uid: res.user.uid,
            fullName,
            mainDomain,
            subDomain,
            email,
            aboutMe,
            createdAt: new Date(),
          });
        } catch (firestoreError) {
          console.error('Error adding document to Firestore:', firestoreError.message);
          setErrorMsg('Failed to save user data in Firestore.');
        }

        // Reset form fields
        setEmail('');
        setPassword('');
        setFullName('');
        setMainDomain('');
        setSubDomain('');
        setAboutMe('');
      }
    } catch (authError: any) {
      console.error(authError.message);
      // Handle Firebase errors and display appropriate message
      if (authError.code === 'auth/email-already-in-use') {
        setErrorMsg('Email already in use. Try logging in.');
      } else if (authError.code === 'auth/invalid-email') {
        setErrorMsg('Invalid email address.');
      } else if (authError.code === 'auth/weak-password') {
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
          type="text" 
          placeholder="Full Name" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        
        <input 
          type="text" 
          placeholder="Main Domain" 
          value={mainDomain} 
          onChange={(e) => setMainDomain(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <input 
          type="text" 
          placeholder="Sub Domain" 
          value={subDomain} 
          onChange={(e) => setSubDomain(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        
        <textarea 
          placeholder="About Me" 
          value={aboutMe} 
          onChange={(e) => setAboutMe(e.target.value)} 
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          rows={3}  // Set number of rows for textarea
        />
        
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
