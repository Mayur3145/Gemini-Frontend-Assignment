'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-center mb-2 sm:mb-4">
      <div className="bg-gray-200 dark:bg-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Gemini is typing</div>
          <div className="flex">
            <span className="animate-bounce mx-[1px] delay-0">.</span>
            <span className="animate-bounce mx-[1px] delay-150">.</span>
            <span className="animate-bounce mx-[1px] delay-300">.</span>
          </div>
        </div>
      </div>
    </div>
  );
} 