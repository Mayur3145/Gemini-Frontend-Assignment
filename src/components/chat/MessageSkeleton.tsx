'use client';

export default function MessageSkeleton() {
  // Randomly determine if this skeleton represents a user or AI message
  const isUserMessage = Math.random() > 0.5;
  
  // Randomly determine the width of the message (between 60% and 90%)
  const width = Math.floor(Math.random() * 30) + 60;
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4 animate-pulse`}>
      <div 
        className={`px-4 py-3 rounded-lg ${
          isUserMessage 
            ? 'bg-blue-200 dark:bg-blue-900' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
        style={{ width: `${width}%`, maxWidth: '80%' }}
      >
        {/* Message content lines */}
        <div className="space-y-2">
          {/* Generate 1-3 lines of varying widths */}
          {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
            <div 
              key={i}
              className={`h-4 ${
                isUserMessage 
                  ? 'bg-blue-300 dark:bg-blue-800' 
                  : 'bg-gray-300 dark:bg-gray-600'
              } rounded`}
              style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
            ></div>
          ))}
        </div>
        
        {/* Timestamp */}
        <div className="mt-2">
          <div 
            className={`h-3 ${
              isUserMessage 
                ? 'bg-blue-300 dark:bg-blue-800' 
                : 'bg-gray-300 dark:bg-gray-600'
            } rounded`}
            style={{ width: '40%' }}
          ></div>
        </div>
      </div>
    </div>
  );
} 