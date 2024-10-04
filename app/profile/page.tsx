// pages/profile.tsx
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Profile() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen text-gray-100 flex items-center justify-center px-6 py-10">
        <div className="bg-gray-900 bg-opacity-70 shadow-xl p-10 rounded-2xl max-w-lg w-full">
          <div className="flex flex-col items-center">
            <Image
              src="/ProfilePicture.jpg"
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full shadow-lg"
            />
            <h1 className="text-4xl font-bold mt-6 text-gray-200">John Doe</h1>
            <p className="text-sm text-gray-400 mt-2">
              Marketing Specialist | Tech Enthusiast
            </p>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-xl font-medium text-gray-100">About Me</h2>
            <p className="mt-4 text-gray-400">
              I’m an experienced marketing specialist with a passion for
              curating educational content. Currently working on various
              exciting digital campaigns!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
