import ChatroomPageClient from './ChatroomPageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;

  return <ChatroomPageClient id={id} />;
}
