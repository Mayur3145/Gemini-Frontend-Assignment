'use client'

import ChatroomPageClient from '../../../components/chatroom/ChatroomPageClient';

// Use this exact type definition
export default function Page({ params }: { params: { id: string } }) {
  return <ChatroomPageClient id={params.id} />;
}
