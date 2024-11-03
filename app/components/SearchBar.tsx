'use client';

import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import debounce from 'lodash/debounce';

interface User {
  uid: string;
  fullName: string;
  userType: 'student' | 'professor';
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      // Only fetch if user is authenticated
      if (!user) return;
      
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const usersList = userSnapshot.docs.map(doc => ({
        uid: doc.id,
        fullName: doc.data().fullName,
        userType: doc.data().userType,
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, [user]);

  // Filter users based on search query
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredUsers([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = users.filter(user => 
      searchTerms.every(term => 
        user.fullName.toLowerCase().includes(term)
      )
    );
    setFilteredUsers(filtered);
  }, [query, users]);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search handler
  const debouncedSearch = debounce((value: string) => {
    setQuery(value);
    setShowResults(true);
    setIsLoading(false);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    debouncedSearch(e.target.value);
  };

  const handleUserSelect = (uid: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/otherProfiles/${uid}`);
  };

  // If authentication is loading, show loading state
  if (authLoading) {
    return (
      <div className="relative w-full max-w-md">
        <div className="w-full px-4 py-2 bg-gray-800 rounded-lg opacity-50">
          <div className="animate-pulse h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the search bar
  if (!user) {
    return null;
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 text-gray-200 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          value={query}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500" />
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.trim() !== '' && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="py-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => handleUserSelect(user.uid)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=32`}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-gray-200 font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-400">{user.userType}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-gray-400 text-center">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;