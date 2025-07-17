'use client';

import { useState, useRef } from 'react';
import { Message } from '@/store/slices/messageSlice';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isUserMessage = message.sender === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };
  
  // For mobile devices, we'll use touch events
  const handleTouchStart = () => {
    setShowActions(true);
    
    // Hide actions after 3 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowActions(false);
    }, 3000);
  };
  
  return (
    <div 
      className={`group flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-2 sm:mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={handleTouchStart}
    >
      <div 
        className={`relative max-w-[90%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
          isUserMessage 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {/* Message content */}
        <div className="mb-1">
          {message.content}
        </div>
        
        {/* Image if present */}
        {message.imageUrl && (
          <div className="mt-2 relative">
            <Image 
              src={message.imageUrl} 
              alt="Uploaded image" 
              width={300} 
              height={200} 
              className="rounded-md max-w-full object-contain"
            />
          </div>
        )}
        
        {/* Timestamp */}
        <div className={`text-[10px] sm:text-xs mt-1 ${
          isUserMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {formattedTime}
        </div>
        
        {/* Copy button - visible on hover/touch */}
        <div 
          className={`absolute top-1 sm:top-2 right-1 sm:right-2 transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleCopyClick}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Copy message"
            aria-label="Copy message"
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 