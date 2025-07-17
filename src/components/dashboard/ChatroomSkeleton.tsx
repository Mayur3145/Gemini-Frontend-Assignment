'use client';

export default function ChatroomSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          
          {/* Last message */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        
        {/* Time and delete button */}
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
} 