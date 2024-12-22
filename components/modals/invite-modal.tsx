"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export default function InviteModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
          <DialogContent className="bg-white text-black p-0 overflow-hidden ">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Invite Friends
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                {" "}
                Server invite Link
              </Label>
              <div className="flex items-center mt-2 gap-x-2">
                <Input
                  className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                  value={inviteUrl}
                  readOnly
                />
                <Button disabled={isLoading} onClick={onCopy} size="icon">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div>
                <Button
                  disabled={isLoading}
                  variant="link"
                  size="sm"
                  onClick={onNew}
                  className="text-xs text-zinc-500 mt-4"
                >
                  Generate a new Link
                  <RefreshCw className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
