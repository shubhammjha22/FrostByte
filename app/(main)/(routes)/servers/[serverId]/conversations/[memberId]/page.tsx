import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }
  const { serverId, memberId } = await params;
  // console.log("clicked -", memberId);
  const currentMember = await prisma.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }
  // console.log("curr mem-", currentMember);

  const Conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  // console.log("convooo mem-", Conversation);
  if (!Conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = Conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          imgUrl={otherMember.profile.imgUrl}
          name={otherMember.profile.name}
          serverId={serverId}
          type="conversation"
        />
      </div>
    </>
  );
}
