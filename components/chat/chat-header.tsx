import { Hash, Menu } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imgUrl?: string;
}

export default function ChatHeader({
  serverId,
  name,
  type,
  imgUrl,
}: ChatHeaderProps) {
  return (
    <>
      <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 ">
        <MobileToggle serverId={serverId} />
        {type === "channel" && (
          <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        )}
        {type === "conversation" && (
          <UserAvatar src={imgUrl} className="w-8 h-8   mr-2" />
        )}
        <p className="font-semibold text-md text-black dark:text-white">
          {name}
        </p>
      </div>
    </>
  );
}
