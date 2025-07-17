import ChatroomPageClient from '../../../components/chatroom/ChatroomPageClient';

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  return <ChatroomPageClient id={id} />;
}

