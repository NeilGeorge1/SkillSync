'use client';

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage, db } from '@/app/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const MakeProject = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  // State for project form fields
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [references, setReferences] = useState('');
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Predefined list of skills for dropdown
  const availableSkills = [
    'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
    'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
    'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
    'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
    'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
  ];

  // Handle file upload to Firebase Storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (skillInput && !skillsRequired.includes(skillInput)) {
      setSkillsRequired([...skillsRequired, skillInput]);
    }
    setSkillInput('');
  };

  // Handle removing a skill
  const handleRemoveSkill = (skill: string) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skill));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !description || skillsRequired.length === 0 || !file) {
      setError('Please fill in all required fields and upload a file.');
      return;
    }

    try {
      setUploading(true);

      // Upload project file to Firebase Storage
      const storageRef = ref(storage, `projects/${user?.uid}/${projectTitle}/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      // Add project details to Firestore
      await addDoc(collection(db, 'projects'), {
        uid: user?.uid,
        title: projectTitle,
        description,
        references,
        skillsRequired,
        fileURL,
        createdAt: new Date(),
      });

      // Redirect to a projects page or clear form (optional)
      setUploading(false);
      router.push('/projects'); // Example redirection
    } catch (error) {
      setUploading(false);
      console.error('Error uploading project:', error);
      setError('Failed to upload project. Please try again.');
    }
  };

  return (
    <div className="min-h-screen text-white flex justify-center items-center p-8">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Create a New Project</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Project Title */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="projectTitle">
              Title of Project
            </label>
            <input
              type="text"
              id="projectTitle"
              className="w-full p-3 bg-gray-700 rounded-md text-white"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 bg-gray-700 rounded-md text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* References */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="references">
              References (Optional)
            </label>
            <input
              type="text"
              id="references"
              className="w-full p-3 bg-gray-700 rounded-md text-white"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
            />
          </div>

          {/* Skills Required with Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="skillsRequired">
              Skills Required
            </label>
            <div className="flex items-center mb-2">
              <select
                className="w-full p-3 bg-gray-700 rounded-md text-white mr-2"
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Skill
              </button>
            </div>

            {/* Display Selected Skills */}
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-red-300 hover:text-red-500"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="file">
              Attach a document detailing the proposal(pdf)
            </label>
            <input
              type="file"
              id="file"
              className="w-full p-3 bg-gray-700 rounded-md text-white"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeProject;
