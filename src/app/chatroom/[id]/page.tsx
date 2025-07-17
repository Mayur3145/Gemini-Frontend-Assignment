'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectChatroom } from '@/store/slices/chatroomSlice';
import Link from 'next/link';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import ChatMessages from '@/components/chat/ChatMessages';
import MessageInput from '@/components/chat/MessageInput';
import { useParams } from '@/hooks/useParams';
import MessageSkeletonGroup from '@/components/chat/MessageSkeletonGroup';

interface ChatroomPageProps {
  params: {
    id: string;
  };
}

export default function ChatroomPage({ params }: ChatroomPageProps) {
  // Use our custom hook to handle params in a future-proof way
  const unwrappedParams = useParams(params);
  const { id } = unwrappedParams;
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { chatrooms, selectedChatroomId } = useAppSelector((state) => state.chatrooms);
  
  const chatroom = chatrooms.find(room => room.id === id);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push('/auth');
    }
  }, [user, router]);

  // Set selected chatroom in Redux
  useEffect(() => {
    if (id) {
      dispatch(selectChatroom(id));
    }
  }, [id, dispatch]);

  // Redirect to dashboard if chatroom not found
  useEffect(() => {
    if (user?.isAuthenticated && !chatroom && !isPageLoading) {
      router.push('/dashboard');
    }
  }, [chatroom, user, router, isPageLoading]);

  // Show loading state
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-screen flex flex-col">
          {/* Header skeleton */}
          <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center animate-pulse">
                <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded mr-2 sm:mr-4"></div>
                <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-6 sm:h-8 w-6 sm:w-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Chat interface skeleton */}
          <div className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4">
            <MessageSkeletonGroup count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !chatroom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-2 sm:mr-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {chatroom.title}
            </h1>
          </div>
          <DarkModeToggle />
        </div>
        
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <ChatMessages chatroomId={id} />
          
          {/* Message Input */}
          <div className="p-2 sm:p-4">
            <MessageInput chatroomId={id} />
          </div>
        </div>
      </div>
    </div>
  );
} 