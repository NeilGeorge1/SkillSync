'use client'

import { useState } from "react"
import { useSignInWithEmailAndPassword, useSendPasswordResetEmail } from "react-firebase-hooks/auth"
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth)
  const [sendPasswordResetEmail, sending, resetError] = useSendPasswordResetEmail(auth)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await signInWithEmailAndPassword(email, password)
      if (res?.user) {
        sessionStorage.setItem("user", JSON.stringify(res.user))
        setEmail("")
        setPassword("")
        router.push("/dashboard")
      } else {
        console.error("No user found in response")
      }
    } catch (e) {
      console.error("Error signing in:", e.message)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address.")
      return
    }
    try {
      const success = await sendPasswordResetEmail(email)
      if (success) {
        setResetSent(true)
      }
    } catch (e) {
      console.error("Error sending password reset email:", e.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-gray-800 text-4xl font-bold mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-10 border border-gray-300 rounded-lg outline-none focus:ring-4 focus:ring-gray-300 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-10 pr-10 border border-gray-300 rounded-lg outline-none focus:ring-4 focus:ring-gray-300 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full p-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 text-sm">{error.message}</p>
        )}

        {resetError && (
          <p className="mt-4 text-center text-red-600 text-sm">{resetError.message}</p>
        )}

        {resetSent && (
          <p className="mt-4 text-center text-green-600 text-sm">
            Password reset email sent. Please check your inbox.
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline mb-10">
            Sign Up
          </Link>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
              >
              Forgot Password?
            </button>
          </div>
        </p>
      </div>
    </div>
  )
}