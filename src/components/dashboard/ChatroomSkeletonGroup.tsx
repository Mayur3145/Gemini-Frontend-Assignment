'use client';

import ChatroomSkeleton from './ChatroomSkeleton';

interface ChatroomSkeletonGroupProps {
  count?: number;
}

export default function ChatroomSkeletonGroup({ count = 5 }: ChatroomSkeletonGroupProps) {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <ChatroomSkeleton key={index} />
      ))}
    </div>
  );
} 