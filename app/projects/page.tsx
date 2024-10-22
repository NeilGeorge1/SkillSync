"use client";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage, db } from "../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

const UserProjects = () => {
  const [user, loading] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserType();
    }
  }, [user]);

  useEffect(() => {
    if (user && userType) {
      if (userType === 'student') {
        checkResumeExists();
      } else {
        fetchProjects();
      }
    }
  }, [user, userType]);

  const fetchUserType = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserType(userDoc.data().userType);
      } else {
        console.error("No such user found!");
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
    }
  };

  const checkResumeExists = async () => {
    if (!user) return;
    const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`);
    try {
      await getDownloadURL(fileRef);
      setResumeExists(true);
      fetchProjects();
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        setResumeExists(false);
      }
      console.error("Error checking resume:", error);
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const projectsCollectionRef = collection(db, 'projects');
      const querySnapshot = await getDocs(projectsCollectionRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter projects based on user type
      const filteredProjects = userType === 'professor' 
        ? data.filter(project => project.uid === user.uid)  // Show only projects created by this professor
        : data;  // Show all projects for students

      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setSelectedFile(null);
      setUploadStatus('Please select a PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    setUploadStatus('Uploading...');
    const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`);
    
    try {
      await uploadBytes(fileRef, selectedFile);
      setUploadStatus('Upload successful!');
      setResumeExists(true);
      fetchProjects();
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const renderStudentContent = () => (
    !resumeExists ? (
      <div>
        <p className="text-white mb-4">Upload resume first to see recommended projects.</p>
        <input type="file" onChange={handleFileChange} accept=".pdf" className="mb-2" />
        <button 
          onClick={handleUpload} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload PDF
        </button>
        {uploadStatus && <p className="mt-2 text-white">{uploadStatus}</p>}
      </div>
    ) : (
      <div>
        <p className="text-white mb-4">You have already uploaded a resume. Upload a new one if you want to update.</p>
        <input type="file" onChange={handleFileChange} accept=".pdf" className="mb-2" />
        <button 
          onClick={handleUpload} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Latest PDF
        </button>
        {uploadStatus && <p className="mt-2 text-white">{uploadStatus}</p>}
        {renderProjects()}
      </div>
    )
  );

  const renderProjects = () => (
    projects.length > 0 ? (
      projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-800 rounded-xl p-6 shadow-md mb-4 transition-transform transform hover:scale-105 hover:bg-gray-700"
        >
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="text-gray-400">Description: {project.description}</p>
          {userType === 'student' ? (
            <>
              <p className="text-gray-400">
                {`Skills Required: ${project.skillsRequired?.join(', ')}`}
              </p>
              <p className="text-gray-400">
                References: <a href={project.references} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.references}</a>
              </p>
              <p className="text-gray-400">
                Proposal: <a href={project.fileURL} download className="text-blue-500 hover:underline">{project.fileURL}</a>
              </p>
            </>
          ) : (
            <p className="text-gray-400">
              {`Assigned Students: ${project.assignedStudents?.join(', ') || 'No students assigned'}`}
            </p>
          )}
        </div>
      ))
    ) : (
      <div className="text-gray-400">No projects found.</div>
    )
  );

  if (loading) return <div className="text-white">Loading...</div>;
  if (!user) return <div className="text-white">Please log in to see projects.</div>;

  return (
    <div className="min-h-screen flex flex-col space-y-6 p-4">
      <Navbar />
      <h2 className="text-2xl font-bold text-white mb-4">
        {userType === "student" ? "Recommended Projects" : "Your Projects"}
      </h2>
      
      {userType === "student" ? renderStudentContent() : renderProjects()}
    </div>
  );
};

export default UserProjects;