import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">SkillSync</h2>
            <p className="text-sm text-gray-400">Empowering skills, connecting futures.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-400 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="mt-8 md:mt-0">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Subscribe to our newsletter</h3>
            <p className="mt-4 text-base text-gray-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input type="email" name="email-address" id="email-address" autoComplete="email" required className="appearance-none min-w-0 w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white" placeholder="Enter your email" />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button type="submit" className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Accessibility
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}