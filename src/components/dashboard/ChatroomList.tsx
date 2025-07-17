'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { deleteChatroom, selectChatroom } from '@/store/slices/chatroomSlice';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ChatroomSkeletonGroup from './ChatroomSkeletonGroup';

export default function ChatroomList() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { filteredChatrooms, isLoading } = useAppSelector((state) => state.chatrooms);

  // Handle chatroom selection
  const handleSelectChatroom = (id: string) => {
    dispatch(selectChatroom(id));
    router.push(`/chatroom/${id}`);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chatroom selection
    setDeletingId(id);
    setShowConfirmModal(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await dispatch(deleteChatroom(deletingId)).unwrap();
      toast.success('Chatroom deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chatroom');
    } finally {
      setShowConfirmModal(false);
      setDeletingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Empty state
  if (filteredChatrooms.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No chatrooms found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Create a new chatroom to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {isLoading && filteredChatrooms.length === 0 ? (
          // Loading state with improved skeletons
          <ChatroomSkeletonGroup count={4} />
        ) : (
          // Chatroom list
          filteredChatrooms.map((chatroom) => (
            <div
              key={chatroom.id}
              onClick={() => handleSelectChatroom(chatroom.id)}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {chatroom.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {chatroom.lastMessage || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <button
                    onClick={(e) => handleDeleteClick(chatroom.id, e)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {chatroom.lastMessageTime 
                      ? formatDate(chatroom.lastMessageTime)
                      : formatDate(chatroom.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Chatroom
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this chatroom? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 