"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import "../globals.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res?.user) {
        sessionStorage.setItem("user", JSON.stringify(res.user));
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else {
        console.error("No user found in response");
      }
    } catch (e) {
      console.error("Error signing in:", e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-gray-800 text-4xl font-bold mb-6 text-center">
          Sign In
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
        <button
          onClick={handleSignIn}
          className={`w-full p-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 text-sm">{error.message}</p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
