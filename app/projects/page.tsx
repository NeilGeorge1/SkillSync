"use client";

import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage, db } from "../firebase/config";
import Navbar from "../components/Navbar";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from "firebase/firestore";

const UserProjects = () => {
  const [user, loading] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [resumeExists, setResumeExists] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [professorNames, setProfessorNames] = useState({});
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserType();
    }
  }, [user]);

  useEffect(() => {
    if (user && userType === "student") {
      fetchPendingRequests();
      checkResumeExists();
    } else if (user && userType === "professor") {
      fetchProjects();
      fetchIncomingRequests();
    }
  }, [user, userType]);

  useEffect(() => {
    // Fetch professor names for all projects
    if (projects.length > 0 && userType === "student") {
      projects.forEach(project => {
        if (!professorNames[project.uid]) {
          fetchProfessorName(project.uid);
        }
      });
    }
  }, [projects]);

  const fetchUserType = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserType(userDoc.data().userType);
      } else {
        setError("User profile not found");
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      setError("Failed to fetch user type");
    }
  };

  const fetchProfessorName = async (professorId) => {
    try {
      const professorDoc = await getDoc(doc(db, "users", professorId));
      if (professorDoc.exists()) {
        const data = professorDoc.data();
        const professorName = data.displayName || data.email?.split('@')[0] || "Unknown Professor";
        setProfessorNames(prev => ({
          ...prev,
          [professorId]: professorName
        }));
      }
    } catch (error) {
      console.error("Error fetching professor name:", error);
      setProfessorNames(prev => ({
        ...prev,
        [professorId]: "Unknown Professor"
      }));
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;
    setIsLoadingRequests(true);
    try {
      const requestsQuery = query(
        collection(db, "joinRequests"),
        where("studentId", "==", user.uid)
      );
      const snapshot = await getDocs(requestsQuery);
      
      const pendingProjectIds = new Set(
        snapshot.docs
          .filter(doc => doc.data().status === "pending")
          .map(doc => doc.data().projectId)
      );
      
      setPendingRequests(pendingProjectIds);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError("Failed to fetch pending requests");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const checkResumeExists = async () => {
    if (!user) return;
    try {
      await getDownloadURL(ref(storage, `resumes/${user.uid}/resume.pdf`));
      setResumeExists(true);
      fetchProjects();
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        setResumeExists(false);
      } else {
        console.error("Error checking resume:", error);
        setError("Failed to check resume status");
      }
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredProjects = userType === "professor"
        ? data.filter((project) => project.uid === user.uid)
        : data;

      setProjects(filteredProjects);

      if (userType === "professor") {
        const studentAssignments = {};
        filteredProjects.forEach((project) => {
          if (project.assignedStudents) {
            studentAssignments[project.id] = project.assignedStudents;
          }
        });
        setAssignedStudents(studentAssignments);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects");
    }
  };

  const fetchIncomingRequests = async () => {
    if (!user) return;
    try {
      const requestsQuery = query(
        collection(db, "joinRequests"),
        where("professorId", "==", user.uid),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(requestsQuery);
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncomingRequests(requestsData);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
      setError("Failed to fetch incoming requests");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus("");
    } else {
      setSelectedFile(null);
      setUploadStatus("Please select a PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setUploadStatus("Uploading...");
    const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`);

    try {
      await uploadBytes(fileRef, selectedFile);
      setUploadStatus("Upload successful!");
      setResumeExists(true);
      fetchProjects();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Please try again.");
      setError("Failed to upload resume");
    }
  };

  const handleJoinRequest = async (projectId, professorId) => {
    if (!user || pendingRequests.has(projectId)) return;
    
    try {
      const requestRef = doc(db, "joinRequests", `${projectId}_${user.uid}`);
      
      const existingRequest = await getDoc(requestRef);
      if (existingRequest.exists()) {
        const status = existingRequest.data().status;
        if (status === "pending") {
          setPendingRequests(prev => new Set([...prev, projectId]));
          return;
        }
      }

      const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`);
      const resumeURL = await getDownloadURL(fileRef)
      
      await setDoc(requestRef, {
        projectId,
        studentId: user.uid,
        professorId,
        status: "pending",
        studentName: user.displayName || user.email?.split("@")[0] || "Anonymous Student",
        timestamp: new Date().toISOString(),
        resumeURL
      });
      
      setPendingRequests(prev => new Set([...prev, projectId]));
    } catch (error) {
      console.error("Error sending join request:", error);
      setError("Failed to send join request");
    }
  };

  const handleAcceptRequest = async (requestId, projectId, studentName) => {
    try {
      const requestRef = doc(db, "joinRequests", requestId);
      await updateDoc(requestRef, { status: "accepted" });

      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        assignedStudents: arrayUnion(studentName)
      });

      setAssignedStudents((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), studentName],
      }));

      // Remove from incoming requests
      setIncomingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );

      // Refresh the projects list
      fetchProjects();
    } catch (error) {
      console.error("Error accepting request:", error);
      setError("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const requestRef = doc(db, "joinRequests", requestId);
      await updateDoc(requestRef, { status: "rejected" });

      // Remove from incoming requests
      setIncomingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError("Failed to reject request");
    }
  };

  const handleRemoveStudent = async (projectId, studentName) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        assignedStudents: arrayRemove(studentName)
      });

      setAssignedStudents((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter(name => name !== studentName)
      }));

      // Refresh the projects list
      fetchProjects();
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student");
    }
  };

  const ResumeUploadSection = () => (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <p className="text-white mb-4">
        {resumeExists
          ? "You have already uploaded a resume. Upload a new one to update."
          : "Upload resume first to see recommended projects."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          className="text-white"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
        >
          {resumeExists ? "Update Resume" : "Upload Resume"}
        </button>
      </div>
      {uploadStatus && (
        <p className="mt-4 text-white text-sm">{uploadStatus}</p>
      )}
    </div>
  );

  const ProjectCard = ({ project }) => {
    const isPending = pendingRequests.has(project.id);
    const professorName = professorNames[project.uid] || "Loading...";

    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-4 transition-all duration-300 hover:scale-102 hover:bg-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
        <p  className="text-gray-300 mb-4">Project ID: {project.id}</p>
        {userType !== "professor" && (
          <>
            <p className="text-gray-300 mb-2">
              <span className="font-medium">Proposed by:</span>{" "}
              <span className="text-blue-400">{professorName}</span>
            </p>
            <p className="text-gray-300 mb-4">
              Proposal: <a href={project.fileURL} className="text-blue-500 hover:underline">Click here to view</a>
            </p>
            <p className="text-gray-300 mb-4">Description : {project.description}</p>

            <button
              onClick={() => handleJoinRequest(project.id, project.uid)}
              disabled={isPending}
              className={`py-2 px-6 rounded transition-colors duration-200 ${
                isPending
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              {isPending ? "Request Pending" : "Join Project"}
            </button>
          </>
        )}

        {userType === "professor" && (
          <div>
            <h4 className="text-white font-medium mt-4 mb-2">Assigned Students:</h4>
            {assignedStudents[project.id]?.length > 0 ? (
              <ul className="space-y-2">
                {assignedStudents[project.id].map((studentName) => (
                  <li key={studentName} className="flex items-center justify-between text-gray-300">
                    <span>{studentName}</span>
                    <button
                      onClick={() => handleRemoveStudent(project.id, studentName)}
                      className="text-red-400 hover:text-red-300 text-sm ml-4"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No students assigned yet</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const IncomingRequestCard = ({ request }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-4 transition-all duration-300">
      <p className="text-white">
        <span className="font-semibold">{request.studentName}</span> has requested to join{" "}
        <span className="text-blue-400 font-semibold">{request.projectId}</span>
      </p>
      <a href={request.resumeURL} className="text-blue-400 text-sm mt-2">
        Click here to view student's resume
      </a>
      <p className="text-gray-400 text-sm mt-2">
        Requested on: {new Date(request.timestamp).toLocaleDateString()}
      </p>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleAcceptRequest(request.id, request.projectId, request.studentName)}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => handleRejectRequest(request.id)}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        {loading && <p className="text-white">Loading...</p>}
        {!loading && userType === "student" && (
          <div className="max-w-3xl mx-auto">
            <ResumeUploadSection />
            {resumeExists && (
              <div className="mt-4">
                <h2 className="text-white text-2xl font-semibold mb-4">Projects You Can Join</h2>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
        {!loading && userType === "professor" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl font-semibold mb-4">Your Projects</h2>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <div className="mt-8">
              <h2 className="text-white text-2xl font-semibold mb-4">Incoming Join Requests</h2>
              {incomingRequests.length === 0 ? (
                <p className="text-white">No pending requests at the moment.</p>
              ) : (
                incomingRequests.map((request) => (
                  <IncomingRequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProjects;

