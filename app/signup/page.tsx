'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { db } from '@/app/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const availableSkills = [
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
  'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
];

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [customSkill, setCustomSkill] = useState<string>('');
  const [aboutMe, setAboutMe] = useState<string>(''); // New About Me state
  const [userType, setUserType] = useState<'student' | 'professor'>('student');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
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
    if (!aboutMe) {
      setErrorMsg('About Me section is required.');
      return false;
    }
    if (skills.length === 0) {
      setErrorMsg('At least one skill is required.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res?.user) {
        setErrorMsg('');
        setSuccessMsg('Account created successfully!');

        try {
          const userDocRef = doc(db, 'users', res.user.uid);
          await setDoc(userDocRef, {
            uid: res.user.uid,
            fullName,
            email,
            skills,
            userType,
            aboutMe, // Save the about me section
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
        setSkills([]);
        setSelectedSkill('');
        setCustomSkill('');
        setAboutMe(''); // Reset About Me field
      }
    } catch (authError: any) {
      console.error(authError.message);
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

  const handleAddSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
      setSelectedSkill('');
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill && !skills.includes(customSkill)) {
      setSkills([...skills, customSkill]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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

        {/* Dropdown for user type selection */}
        <label htmlFor="user-type" className="block mb-2 text-gray-600">Select User Type:</label>
        <select
          id="user-type"
          value={userType}
          onChange={(e) => setUserType(e.target.value as 'student' | 'professor')}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        {/* Skill dropdown */}
        <label htmlFor="skill-select" className="block mb-2 text-gray-600">Select Skills:</label>
        <select
          id="skill-select"
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full p-4 mb-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Choose a skill</option>
          {availableSkills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        <button 
          onClick={handleAddSkill}
          className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 mb-4"
        >
          Add Skill
        </button>

        {/* Custom skill input */}
        <input
          type="text"
          placeholder="Add Custom Skill"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button 
          onClick={handleAddCustomSkill}
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 mb-4"
        >
          Add Custom Skill
        </button>

        {/* Display added skills */}
        <div className="flex flex-wrap mb-4">
          {skills.map((skill) => (
            <span key={skill} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full mr-2 mb-2 flex items-center">
              {skill}
              <button 
                onClick={() => handleRemoveSkill(skill)}
                className="text-red-600 ml-2"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        
        {/* About Me textarea */}
        <textarea
          placeholder="Tell us something about yourself..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
