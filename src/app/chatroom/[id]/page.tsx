import ChatroomPageClient from '../../../components/chatroom/ChatroomPageClient';

export default async function Page({ params }: { params: { id: string } }) {
  // No need to manually await params here unless you're doing async logic
  return <ChatroomPageClient id={params.id} />;
}
