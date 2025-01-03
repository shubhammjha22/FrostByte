"use client";

import queryString from "query-string";

import { ServerWithMembersWithProfiles } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function MembersModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const [loading, setLoading] = useState("");
  function handleClose() {
    onClose();
    console.log(isOpen);
  }

  const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  };

  const onKick = async (memberId: string) => {
    try {
      setLoading(memberId);

      const url = `/api/members/${memberId}?${queryString.stringify({
        serverId: server?.id,
      })}`;

      const response = await axios.delete(url);

      router.refresh();

      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoading(memberId);
      const url2 = `/api/members/${memberId}?${queryString.stringify({
        server: server?.id,
      })}`;

      const response = await axios.patch(url2, { role });
      router.refresh();

      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading("");
    }
  };

  return (
    <>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-white text-black overflow-hidden ">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Manage Members
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                {server?.members?.length} Members
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[420px]  pr-10">
              {server?.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex px-4 items-center gap-x-2 mb-6"
                >
                  <UserAvatar src={member.profile.imgUrl} />
                  <div className="flex flex-col gap-y-1">
                    <div className="text-xs font-semibold flex items-center gap-x-1">
                      {member.profile.name}
                      {roleIconMap[member.role]}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member.profile.email}
                    </p>
                  </div>
                  {server.profileId !== member.profileId &&
                    loading !== member.id && (
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="h-4 w-4 mr-2" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    className="flex items-center"
                                    onClick={() =>
                                      onRoleChange(member.id, "GUEST")
                                    }
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center"
                                    onClick={() =>
                                      onRoleChange(member.id, "MODERATOR")
                                    }
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Moderator
                                    {member.role === "MODERATOR" && (
                                      <Check className="h-4 w-4 ml-auto" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onKick(member.id)}
                              className="flex items-center gap-x-1 ml-2 text-sm"
                            >
                              <Gavel className="h-4 w-4 mr-2" />
                              <span>Kick</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  {loading === member.id && (
                    <Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
                  )}
                </div>
              ))}
            </ScrollArea>
            {/* <div className="p-6">All Members</div */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
