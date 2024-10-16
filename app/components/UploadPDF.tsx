"use client";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config"; // import Firebase storage
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config"; // import Firebase auth

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [user] = useAuthState(auth); // Get the current logged-in user

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if the file exists and is a PDF
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file only.");
      setFile(null); // Reset the file if it's not a PDF
    }
  };

  // Upload the PDF file to Firebase Storage
  const uploadPDF = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload files.");
      return;
    }

    const storageRef = ref(storage, `pdfs/${user.uid}/${file.name}`);
    setUploading(true);

    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);

      // Get the file's download URL
      const url = await getDownloadURL(snapshot.ref);
      setDownloadURL(url);

      console.log("File uploaded successfully! URL:", downloadURL);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setFile(null); // Reset the file input
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-800 min-h-[10vh] min-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upload a PDF File
      </h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-xs text file:mr-2 file:py-2 file:px-2
               file:rounded-full file:border-0
               file:text-xs file:font-semibold
               file:bg-gray-200 file:text-gray-700
               hover:file:bg-gray-300"
      />
      <button
        onClick={uploadPDF}
        disabled={!file || uploading}
        className="mt-4 px-6 py-2 text-xs text-white font-medium rounded-full
                 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-300"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>

      {/* Only show the download link if not uploading and there is a download URL */}
      {!uploading && downloadURL && (
        <div className="mt-4">
          <a
            href={downloadURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
