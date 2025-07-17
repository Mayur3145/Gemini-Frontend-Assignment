import ChatroomPageClient from '../../../components/chatroom/ChatroomPageClient';

export default async function Page({ params }: { params: { id: string } }) {
  return <ChatroomPageClient id={params.id} />;
}
