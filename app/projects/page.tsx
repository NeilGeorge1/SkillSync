'use client'

import { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, storage, db } from "../firebase/config"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { filterProjects } from "../recommender/contentFiltering"
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
  orderBy
} from "firebase/firestore"
import { 
  FileUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  User,
  Calendar,
  Loader,
  Briefcase,
  PlusCircle,
  MinusCircle,
  FileQuestion
} from 'lucide-react'

// Types
interface Project {
  id: string
  title: string
  description: string
  uid: string
  fileURL: string
  assignedStudents?: string[]
}

interface JoinRequest {
  id: string
  projectId: string
  studentId: string
  studentName: string
  timestamp: string
  resumeURL: string
  status: 'pending' | 'accepted' | 'rejected'
}

const AVAILABLE_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
  'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
].sort();

export default function Component() {
  const [user, loading] = useAuthState(auth)
  const [userType, setUserType] = useState<string | null>(null)
  const [resumeExists, setResumeExists] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [uploadStatus, setUploadStatus] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set())
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [professorNames, setProfessorNames] = useState<Record<string, string>>({})
  const [incomingRequests, setIncomingRequests] = useState<JoinRequest[]>([])
  const [assignedStudents, setAssignedStudents] = useState<Record<string, string[]>>({})
  const [error, setError] = useState<string | null>(null)

  const fetchIncomingRequests = async () => {
    if (!user) {
      console.log("User not set, skipping fetchIncomingRequests");
      return;
    }
    
    setError(null);
    setIsLoadingRequests(true);
    
    try {
      console.log("Fetching incoming requests for professor:", user.uid);
      const requestsQuery = query(
        collection(db, "joinRequests"),
        where("professorId", "==", user.uid),
        where("status", "==", "pending")
      );
      
      const snapshot = await getDocs(requestsQuery);
      
      console.log("Snapshot size:", snapshot.size);
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JoinRequest[];
      
      console.log("Parsed requests:", requests);
      setIncomingRequests(requests);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
      setError("Failed to fetch incoming requests: " + (error as Error).message);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserType()
    }
  }, [user])

  useEffect(() => {
    if (user && userType === "student") {
      fetchPendingRequests()
      checkResumeExists()
    } else if (user && userType === "professor") {
      console.log("Professor logged in, fetching projects and incoming requests");
      fetchProjects()
      fetchIncomingRequests()
    }
  }, [user, userType])

  useEffect(() => {
    if (projects.length > 0 && userType === "student") {
      const uniqueProfessorIds = new Set(projects.map(project => project.uid))
      uniqueProfessorIds.forEach(id => {
        if (!professorNames[id]) {
          fetchProfessorName(id)
        }
      })
    }
  }, [projects])

  const fetchUserType = async () => {
    if (!user) return
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        setUserType(userDoc.data().userType)
      } else {
        setError("User profile not found")
      }
    } catch (error) {
      console.error("Error fetching user type:", error)
      setError("Failed to fetch user type")
    }
  }

  const fetchProfessorName = async (professorId: string) => {
    try {
      const professorDoc = await getDoc(doc(db, "users", professorId))
      if (professorDoc.exists()) {
        const data = professorDoc.data()
        const professorName = data.displayName || data.email?.split('@')[0] || "Unknown Professor"
        setProfessorNames(prev => ({
          ...prev,
          [professorId]: professorName
        }))
      }
    } catch (error) {
      console.error("Error fetching professor name:", error)
      setProfessorNames(prev => ({
        ...prev,
        [professorId]: "Unknown Professor"
      }))
    }
  }

  const fetchPendingRequests = async () => {
    if (!user) return
    setIsLoadingRequests(true)
    try {
      const requestsQuery = query(
        collection(db, "joinRequests"),
        where("studentId", "==", user.uid)
      )
      const snapshot = await getDocs(requestsQuery)
      
      const pendingProjectIds = new Set(
        snapshot.docs
          .filter(doc => doc.data().status === "pending")
          .map(doc => doc.data().projectId)
      )
      
      setPendingRequests(pendingProjectIds)
    } catch (error) {
      console.error("Error fetching pending requests:", error)
      setError("Failed to fetch pending requests")
    } finally {
      setIsLoadingRequests(false)
    }
  }

  const checkResumeExists = async () => {
    if (!user) return
    try {
      await getDownloadURL(ref(storage, `resumes/${user.uid}/resume.pdf`))
      setResumeExists(true)
      fetchProjects()
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        setResumeExists(false)
      } else {
        console.error("Error checking resume:", error)
        setError("Failed to check resume status")
      }
    }
  }

  const fetchProjects = async () => {
    if (!user) return;
  
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
  
      let filteredProjects;
  
      if (userType === "professor") {
        filteredProjects = data.filter((project) => project.uid === user.uid);
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userSkills = userDoc.exists() ? userDoc.data().skills : [];
        
        filteredProjects = filterProjects(data, userSkills);
        
        console.log('User skills:', userSkills);
        console.log('Filtered projects:', filteredProjects);
      }
  
      setProjects(filteredProjects);
  
      if (userType === "professor") {
        const studentAssignments: Record<string, string[]> = {};
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file?.type === "application/pdf") {
      setSelectedFile(file)
      setUploadStatus("")
    } else {
      setSelectedFile(null)
      setUploadStatus("Please select a PDF file.")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      setUploadStatus("Please select a file first.")
      return
    }

    setUploadStatus("Uploading...")
    const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`)

    try {
      await uploadBytes(fileRef, selectedFile)
      setUploadStatus("Upload successful!")
      setResumeExists(true)
      fetchProjects()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("Upload failed. Please try again.")
      setError("Failed to upload resume")
    }
  }

  const handleJoinRequest = async (projectId: string, professorId: string) => {
    if (!user || pendingRequests.has(projectId)) return
    
    try {
      const requestRef = doc(db, "joinRequests", `${projectId}_${user.uid}`)
      
      const existingRequest = await getDoc(requestRef)
      if (existingRequest.exists()) {
        const status = existingRequest.data().status
        if (status === "pending") {
          setPendingRequests(prev => new Set([...prev, projectId]))
          return
        }
      }

      const fileRef = ref(storage, `resumes/${user.uid}/resume.pdf`)
      const resumeURL = await getDownloadURL(fileRef)
      
      await setDoc(requestRef, {
        projectId,
        studentId: user.uid,
        professorId,
        status: "pending",
        studentName: user.displayName || user.email?.split("@")[0] || "Anonymous Student",
        timestamp: new Date().toISOString(),
        resumeURL
      })
      
      setPendingRequests(prev => new Set([...prev, projectId]))
    } catch (error) {
      console.error("Error sending join request:", error)
      setError("Failed to send join request")
    }
  }

  const handleAcceptRequest = async (requestId: string, projectId: string, studentName: string) => {
    try {
      const requestRef = doc(db, "joinRequests", requestId)
      await updateDoc(requestRef, { status: "accepted" })

      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, {
        assignedStudents: arrayUnion(studentName)
      })

      setAssignedStudents((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), studentName],
      }))

      setIncomingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      )

      fetchProjects()
    } catch (error) {
      console.error("Error accepting request:", error)
      setError("Failed to accept request")
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const requestRef = doc(db, "joinRequests", requestId)
      await updateDoc(requestRef, { status: "rejected" })

      setIncomingRequests(prev => 
        prev.filter(request => request.id !== requestId)
      )
    } catch (error) {
      console.error("Error rejecting request:", error)
      setError("Failed to reject request")
    }
  }

  const handleRemoveStudent = async (projectId: string, studentName: string) => {
    try {
      const projectRef = doc(db, "projects", projectId)
      await updateDoc(projectRef, {
        assignedStudents: arrayRemove(studentName)
      })

      setAssignedStudents((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter(name => name !== studentName)
      }))

      fetchProjects()
    } catch (error) {
      console.error("Error removing student:", error)
      setError("Failed to remove student")
    }
  }

  const ResumeUploadSection = () => (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
        <FileUp className="mr-2" />
        Resume Upload
      </h2>
      <p className="mb-4 text-gray-300">
        {resumeExists
          ? "You have already uploaded a resume. Upload a new one to update."
          : "Upload resume first to see recommended projects."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors duration-200">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <span className="flex items-center justify-center">
            <FileText className="mr-2" />
            {selectedFile ? selectedFile.name : "Choose PDF file"}
          </span>
        </label>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <FileUp className="mr-2" />
          {resumeExists ? "Update Resume" : "Upload Resume"}
        </button>
      </div>
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-300">{uploadStatus}</p>
      )}
    </div>
  
  )

  const ProjectCard = ({ project }: { project: Project }) => {
    const isPending = pendingRequests.has(project.id)
    const professorName = professorNames[project.uid] || "Loading..."

    return (
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2 text-white flex items-center">
          <Briefcase className="mr-2" />
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">Project ID: {project.id}</p>
        {userType !== "professor" && (
          <>
            <p className="mb-2 text-gray-300">
              <span className="font-medium">Proposed by:</span>{" "}
              <span className="text-blue-400">{professorName}</span>
            </p>
            <p className="mb-4 text-gray-300">
              Proposal: <a href={project.fileURL} className="text-blue-400 hover:underline">Click here to view</a>
            </p>
            <p className="mb-4 text-gray-300">Description: {project.description}</p>

            <button
              onClick={() => handleJoinRequest(project.id, project.uid)}
              disabled={isPending}
              className={`py-2 px-4 rounded transition-colors duration-200 flex items-center ${
                isPending
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isPending ? <Clock className="mr-2" /> : <PlusCircle className="mr-2" />}
              {isPending ? "Request Pending" : "Join Project"}
            </button>
          </>
        )}

        {userType === "professor" && (
          <div>
            <h4 className="font-medium mt-4 mb-2 text-white flex items-center">
              <Users className="mr-2" />
              Assigned Students:
            </h4>
            {assignedStudents[project.id]?.length > 0 ? (
              <ul className="space-y-2">
                {assignedStudents[project.id].map((studentName) => (
                  <li key={studentName} className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center">
                      <User className="mr-2" />
                      {studentName}
                    </span>
                    <button
                      onClick={() => handleRemoveStudent(project.id, studentName)}
                      className="text-red-400 hover:text-red-500 transition-colors duration-200 flex items-center"
                    >
                      <MinusCircle className="mr-1" />
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
    )
  }

  const IncomingRequestCard = ({ request }: { request: JoinRequest }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <p className="mb-2 text-white">
        <span className="font-semibold">{request.studentName}</span> has requested to join{" "}
        <span className="text-blue-400 font-semibold">{request.projectId}</span>
      </p>
      <a href={request.resumeURL} className="text-blue-400 hover:underline text-sm block mb-2 flex items-center">
        <FileText className="mr-2" />
        Click here to view student's resume
      </a>
      <p className="text-sm text-gray-400 mb-4 flex items-center">
        <Calendar className="mr-2" />
        Requested on: {new Date(request.timestamp).toLocaleDateString()}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => handleAcceptRequest(request.id, request.projectId, request.studentName)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200 flex items-center"
        >
          <CheckCircle className="mr-2" />
          Accept
        </button>
        <button
          onClick={() => handleRejectRequest(request.id)}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200 flex items-center"
        >
          <XCircle className="mr-2" />
          Reject
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {userType === "professor" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
              <Briefcase className="mr-2" />
              Your Projects
            </h2>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                <FileQuestion className="mr-2" />
                Incoming Join Requests
              </h2>
              {isLoadingRequests ? (
                <p className="text-gray-400 flex items-center">
                  <Loader className="animate-spin mr-2" />
                  Loading incoming requests...
                </p>
              ) : incomingRequests.length === 0 ? (
                <p className="text-gray-400">No pending requests at the moment.</p>
              ) : (
                incomingRequests.map((request) => (
                  <IncomingRequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </div>
        )}
        {userType === "student" && (
          <div className="max-w-3xl mx-auto">
            <ResumeUploadSection />
            {resumeExists && (
              <div className="mt-8">
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
                  <Briefcase className="mr-2" />
                  Projects You Can Join
                </h2>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}