'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, db } from '@/app/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { 
  FileUp, 
  Plus, 
  X, 
  Book, 
  FileText, 
  Code2, 
  Link2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const MakeProject = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [references, setReferences] = useState('');
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const availableSkills = [
    'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
    'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
    'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
    'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
    'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !skillsRequired.includes(skillInput)) {
      setSkillsRequired([...skillsRequired, skillInput]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle || !description || skillsRequired.length === 0 || !file) {
      setError('Please fill in all required fields and upload a file.');
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `projects/${user?.uid}/${projectTitle}/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'projects'), {
        uid: user?.uid,
        title: projectTitle,
        description,
        references,
        skillsRequired,
        fileURL,
        createdAt: new Date(),
      });

      setUploading(false);
      router.push('/projects');
    } catch (error) {
      setUploading(false);
      console.error('Error uploading project:', error);
      setError('Failed to upload project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar/>
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 shadow-xl rounded-xl overflow-hidden backdrop-blur-lg backdrop-filter">
          {/* Header */}
          <div className="bg-gray-700/50 px-6 py-8 border-b border-gray-700">
            <h2 className="text-3xl font-bold text-white text-center">
              Create a New Project
            </h2>
            <p className="mt-2 text-gray-400 text-center">
              Share your project idea with the community
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Project Title */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <Book className="w-4 h-4" />
                Project Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter your project title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your project in detail"
                required
              />
            </div>

            {/* References */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <Link2 className="w-4 h-4" />
                References (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Add any relevant links or references"
              />
            </div>

            {/* Skills Required */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <Code2 className="w-4 h-4" />
                Skills Required
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                >
                  <option value="">Select a skill</option>
                  {availableSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-blue-200 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
                <FileUp className="w-4 h-4" />
                Project Document (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  required
                  accept=".pdf"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;