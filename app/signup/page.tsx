'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const AVAILABLE_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
  'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
].sort();

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    skills: [] as string[],
    selectedSkill: '',
    customSkill: '',
    aboutMe: '',
    userType: 'student' as 'student' | 'professor',
  });

  const [status, setStatus] = useState({
    error: '',
    success: '',
    isSubmitting: false
  });

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSkill = (skillToAdd: string) => {
    if (!skillToAdd.trim() || formData.skills.includes(skillToAdd)) return;
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillToAdd],
      selectedSkill: '',
      customSkill: ''
    }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ ...status, isSubmitting: true, error: '' });

    try {
      const res = await createUserWithEmailAndPassword(formData.email, formData.password);
      if (res?.user) {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          ...formData,
          createdAt: new Date().toISOString(),
        });
        setStatus({
          error: '',
          success: 'Account created successfully!',
          isSubmitting: false
        });
      }
    } catch (error: any) {
      setStatus({
        error: error.message || 'An error occurred',
        success: '',
        isSubmitting: false
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
          {/* Left side - Welcome content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-300 mb-6">
              Join our community of innovators
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Connect with fellow developers, share your expertise, and discover new opportunities.
            </p>
            <div className="hidden lg:block">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-400">Create your profile</h3>
                  <p className="text-gray-400">Showcase your skills and experience</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-400">Join the network</h3>
                  <p className="text-gray-300">Connect with peers and mentors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Sign up form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.error && (
                  <div className="bg-red-50 text-red-600 rounded-lg p-4">
                    {status.error}
                  </div>
                )}
                
                {status.success && (
                  <div className="bg-green-50 text-green-600 rounded-lg p-4">
                    {status.success}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="student">I am a Student</option>
                      <option value="professor">I am a Professor</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={formData.selectedSkill}
                        onChange={(e) => setFormData(prev => ({ ...prev, selectedSkill: e.target.value }))}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      >
                        <option value="">Select skills...</option>
                        {AVAILABLE_SKILLS.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddSkill(formData.selectedSkill)}
                        className="px-6 py-3 bg-gray-900 text-gray-100 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-400 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                      
                    <div>
                      <textarea
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                        required
                      />
                    </div>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status.isSubmitting}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.isSubmitting ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;