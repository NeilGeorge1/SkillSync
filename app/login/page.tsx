import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-sm w-full bg-gray-800 p-8 rounded-lg shadow-lg border border-white">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Sign In</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-6 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full px-6 py-3 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-white">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link href="#" className="text-blue-500 hover:text-blue-700">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
