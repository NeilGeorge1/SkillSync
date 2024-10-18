'use client';
import Navbar from "../components/Navbar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the path as necessary
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config'; // Import your Firebase auth

// Define an interface for project data
interface Project {
    id: string;
    title: string;
    description: string;
    skillsRequired: string; // Skills required for the project
    fileURL: string; // URL for the uploaded PDF file
    students: string[]; // List of student names involved
}

const UserProjects = () => {
    const [user, loading] = useAuthState(auth); // Get the logged-in user
    const [projects, setProjects] = useState<Project[]>([]); // Store projects for the logged-in professor

    useEffect(() => {
        const fetchProjectsData = async () => {
            if (!user) return; // Return if no user is logged in

            // Reference to the projects collection and filter by user ID
            const projectsCollectionRef = collection(db, 'projects');
            const projectsQuery = query(projectsCollectionRef, where('uid', '==', user.uid));
            const querySnapshot = await getDocs(projectsQuery);

            // Map through the documents to create project objects
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                students: doc.data().students || [], // Assume students are stored in the project document
            })) as Project[]; // Type assertion for the array of projects

            setProjects(data); // Save the fetched projects to state
        };

        fetchProjectsData();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
    <div className="min-h-screen flex flex-col p-8 space-y-6">
        <Navbar />
        <h2 className="text-2xl font-bold text-white mb-4">My Projects</h2>
        {projects.length > 0 ? (
            projects.map((project) => (
                <div
                    key={project.id}
                    className="bg-gray-800 rounded-xl p-6 shadow-md mb-4 transition-transform transform hover:scale-105 hover:bg-gray-700"
                >
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <p className="text-gray-400">Description: {project.description}</p>
                    <p className="text-gray-400">Skills Required: {project.skillsRequired.join(', ')}</p>
                    <p className="text-gray-400">Students Involved: {project.students.join(', ')}</p>
                    {project.fileURL && (
                        <a
                            href={project.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline mt-2 block"
                        >
                            View Proposal
                        </a>
                    )}
                </div>
            ))
        ) : (
            <div className="text-gray-400">No projects found.</div>
        )}
    </div>
);

};

export default UserProjects;
