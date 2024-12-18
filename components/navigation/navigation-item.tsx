"use client";

import { cn } from "@/lib/utils";
import ActionToolTip from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItemProp {
  id: string;
  imgUrl: string;
  name: string;
}

export default function NavigationItem({
  id,
  imgUrl,
  name,
}: NavigationItemProp) {
  const params = useParams();
  const router = useRouter();

  function handleClick() {
    console.log("Server id -", id);

    router.push(`/servers/${id}`);
  }

  return (
    <>
      <ActionToolTip side="right" align="center" label={name}>
        <button
          onClick={() => {
            handleClick();
          }}
          className="group relative flex items-center"
        >
          <div
            className={cn(
              "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
              params?.serverId !== id && "group-hover:h-[20px]",
              params?.serverId === id ? "h-[36px]" : "h-[8px]"
            )}
          ></div>
          <div
            className={cn(
              "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
              params?.serverId === id &&
                "bg-primary/10 text-primary rounded-[16px] "
            )}
          >
            <Image fill src={imgUrl} alt="Channel" />
          </div>
        </button>
      </ActionToolTip>
    </>
  );
}
