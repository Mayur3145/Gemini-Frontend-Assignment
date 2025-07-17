'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { loadMoreMessages, resetPagination } from '@/store/slices/messageSlice';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import MessageSkeletonGroup from './MessageSkeletonGroup';

interface ChatMessagesProps {
  chatroomId: string;
}

export default function ChatMessages({ chatroomId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const dispatch = useAppDispatch();
  const { messages: allMessages, isTyping, isLoading, hasMoreMessages, currentPage, messagesPerPage } = 
    useAppSelector((state) => state.messages);
  
  // Get messages for this chatroom
  const messages = allMessages[chatroomId] || [];
  
  // Calculate paginated messages
  const paginatedMessages = messages.slice(0, currentPage * messagesPerPage);
  
  // Simulate initial loading
  useEffect(() => {
    // Simulate initial loading delay
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [chatroomId]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (hasScrolledToBottom && messagesEndRef.current && !initialLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [paginatedMessages.length, isTyping, hasScrolledToBottom, initialLoading]);
  
  // Reset pagination when chatroom changes
  useEffect(() => {
    dispatch(resetPagination());
    setHasScrolledToBottom(true);
    setInitialLoading(true);
    
    // Simulate initial loading delay when chatroom changes
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [chatroomId, dispatch]);
  
  // Handle scroll for infinite loading
  const handleScroll = () => {
    if (!messagesContainerRef.current || initialLoading) return;
    
    const { scrollTop, scrollHeight } = messagesContainerRef.current;
    
    // Check if scrolled to bottom
    const isAtBottom = scrollHeight - scrollTop <= messagesContainerRef.current.clientHeight + 100;
    setHasScrolledToBottom(isAtBottom);
    
    // Check if scrolled to top for loading more messages
    if (scrollTop === 0 && hasMoreMessages && !isLoading) {
      // Save current scroll height
      setPrevScrollHeight(scrollHeight);
      
      // Load more messages
      dispatch(loadMoreMessages(chatroomId));
    }
  };
  
  // Maintain scroll position after loading more messages
  useEffect(() => {
    if (prevScrollHeight > 0 && messagesContainerRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeight;
      
      if (heightDifference > 0) {
        messagesContainerRef.current.scrollTop = heightDifference;
        setPrevScrollHeight(0);
      }
    }
  }, [messages.length, prevScrollHeight]);
  
  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-2 sm:p-4"
      onScroll={handleScroll}
      style={{ height: 'calc(100vh - 180px)' }}
    >
      {/* Loading indicator for more messages */}
      {isLoading && !initialLoading && (
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="inline-block h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-3 sm:border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
        </div>
      )}
      
      {/* Initial loading state with skeletons */}
      {initialLoading ? (
        <MessageSkeletonGroup count={6} />
      ) : (
        /* Messages */
        <div className="flex flex-col-reverse">
          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}
          
          {/* Message items */}
          {paginatedMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {/* Empty state */}
          {paginatedMessages.length === 0 && !isTyping && (
            <div className="text-center text-gray-500 dark:text-gray-400 my-6 sm:my-8">
              <p className="text-sm sm:text-base">No messages yet. Start a conversation!</p>
            </div>
          )}
          
          {/* Invisible element for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
} 