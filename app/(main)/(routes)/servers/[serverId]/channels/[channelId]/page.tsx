import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const { serverId, channelId } = await params;
  const profile = await currentProfile();

  if (!profile) {
    redirect("/");
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const members = await prisma.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !members) {
    redirect("/");
  }

  return (
    <>
      <div className="bg-whie dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          name={channel.name}
          serverId={channel.serverId}
          type="channel"
        />
      </div>
    </>
  );
}
