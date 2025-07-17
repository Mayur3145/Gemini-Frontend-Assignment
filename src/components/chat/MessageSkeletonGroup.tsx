'use client';

import MessageSkeleton from './MessageSkeleton';

interface MessageSkeletonGroupProps {
  count?: number;
}

export default function MessageSkeletonGroup({ count = 5 }: MessageSkeletonGroupProps) {
  return (
    <div className="flex flex-col-reverse">
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </div>
  );
} 