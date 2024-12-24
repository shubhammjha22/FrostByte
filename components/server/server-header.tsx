"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isMod = isAdmin || role === MemberRole.MODERATOR;
  const { onOpen } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button
            onClick={() => setDropdownOpen(true)}
            className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 darK:hover:bg-zinc-700/50 transition"
          >
            {server.name}
            <ChevronDown className="h-5 w-5 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
          {isMod && (
            <DropdownMenuItem
              onClick={() => (
                setDropdownOpen(false), onOpen("invite", { server })
              )}
              className="text-indigo-600 dark:text-indigo-400 py-2 px-3 text-sm cursor-pointer"
            >
              Invite People
              <UserPlus className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => (
                setDropdownOpen(false), onOpen("editServer", { server })
              )}
              className=" py-2 px-3 text-sm cursor-pointer"
            >
              Server Settings
              <Settings className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => (
                setDropdownOpen(false), onOpen("members", { server })
              )}
              className=" py-2 px-3 text-sm cursor-pointer"
            >
              Manage Members
              <Users className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isMod && (
            <DropdownMenuItem className=" py-2 px-3 text-sm cursor-pointer">
              Create Channel
              <PlusCircle className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {isMod && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem className="text-rose-500 py-2 px-3 text-sm cursor-pointer">
              Delete Server
              <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem className="text-rose-500 py-2 px-3 text-sm cursor-pointer">
              Leave Server
              <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
