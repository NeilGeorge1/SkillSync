'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { User, Mail, Lock, UserPlus, Users, ChevronDown, X, Plus } from 'lucide-react';
import Link from 'next/link';

const AVAILABLE_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
  'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
].sort();

export default function SignUp() {
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

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ ...status, isSubmitting: true, error: '' });

    if (!validateEmail(formData.email)) {
      setStatus({
        error: 'Invalid email. Please include an @ symbol.',
        success: '',
        isSubmitting: false
      });
      return;
    }

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
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16 max-w-7xl mx-auto">
          {/* Left side - Welcome content */}
          <div className="lg:w-1/2 lg:sticky lg:top-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-900 bg-clip-text text-transparent">
              Join our community of innovators
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with fellow developers, share your expertise, and discover new opportunities.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Create your profile</h3>
                  <p className="text-gray-400">Showcase your skills and experience</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Join the network</h3>
                  <p className="text-gray-400">Connect with peers and mentors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Sign up form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Create your account</h2>
              
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
                  <div className="relative">
                    <User className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Users className="absolute top-3 left-3 text-gray-400" size={20} />
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none"
                    >
                      <option value="student">I am a Student</option>
                      <option value="professor">I am a Professor</option>
                    </select>
                    <ChevronDown className="absolute top-3 right-3 text-gray-400 pointer-events-none" size={20} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={formData.selectedSkill}
                          onChange={(e) => setFormData(prev => ({ ...prev, selectedSkill: e.target.value }))}
                          className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none text-gray-400"
                        >
                          <option value="">Select skills...</option>
                          {AVAILABLE_SKILLS.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute top-3 right-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSkill(formData.selectedSkill)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
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
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                        required
                      />
                    </div>

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status.isSubmitting}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.isSubmitting ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-center text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}