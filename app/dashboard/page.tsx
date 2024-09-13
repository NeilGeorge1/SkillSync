import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="navbar bg-gray-800 p-4 shadow-md">
        <div className="flex-1">
          <Link href="/" className="text-white text-2xl font-semibold tracking-wide">
            SkillSync
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal space-x-6">
            <li>
              <Link href="/profile" className="hover:text-gray-400">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-gray-400">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center p-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to SkillSync</h1>
        <p className="text-lg mb-6">Connecting mentors and mentees for collaborative project development.</p>
        <Link href="/signup" className="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition-colors">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor-Mentee Matching</h3>
            <p>We match mentors and mentees based on skills, experience, and project preferences.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Project Collaboration</h3>
            <p>Work on projects together, share progress, and grow your skills under expert guidance.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Feedback & Growth</h3>
            <p>Get continuous feedback from mentors, improve, and succeed in your project endeavors.</p>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pair 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor: John Doe</h3>
            <p className="mb-2">Mentee: Jane Smith</p>
            <p className="mb-4">Current Project: AI-based Recommendation System</p>
            <Link href="/project/1" className="text-blue-500 hover:text-blue-700">
              View Project
            </Link>
          </div>
          {/* Pair 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Mentor: Sarah Connor</h3>
            <p className="mb-2">Mentee: Tim Lee</p>
            <p className="mb-4">Current Project: Mobile App Development</p>
            <Link href="/project/2" className="text-blue-500 hover:text-blue-700">
              View Project
            </Link>
          </div>
          {/* Add more pairs as needed */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} SkillSync. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
