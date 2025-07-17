'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import SearchBar from '@/components/dashboard/SearchBar';
import CreateChatroom from '@/components/dashboard/CreateChatroom';
import ChatroomList from '@/components/dashboard/ChatroomList';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push('/auth');
    }
  }, [user, router]);

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/auth');
  };

  if (!user) {
    return null; // Don't render anything while checking auth status
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex w-full sm:w-auto justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Gemini Dashboard
            </h1>
            
            {/* Mobile menu button */}
            <button 
              className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          <div className={`${showMobileMenu ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto mt-4 sm:mt-0`}>
            <DarkModeToggle />
            <span className="text-gray-600 dark:text-gray-300 mt-4 sm:mt-0 sm:mx-4">
              {user.countryCode} {user.phoneNumber}
            </span>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="py-6 sm:py-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:w-64">
              <SearchBar />
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <CreateChatroom />
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 mt-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Your Chatrooms
            </h2>
            <ChatroomList />
          </div>
        </div>
      </div>
    </div>
  );
} 