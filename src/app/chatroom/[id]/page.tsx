import ChatroomPageClient from './ChatroomPageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ChatroomPageClient id={id} />;
}
