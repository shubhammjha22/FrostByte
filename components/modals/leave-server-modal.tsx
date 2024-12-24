"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";

export default function LeaveModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onConfirmLeave = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
      return new NextResponse("Internal Server error", { status: 500 });
    } finally {
      setIsLoading(false);
    }
  };

  function handleClose() {
    onClose();
    console.log(isOpen);
  }

  return (
    <>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
          <DialogContent className="bg-white text-black p-0 overflow-hidden ">
            <DialogHeader className="pt-8 px-6">
              <DialogTitle className="text-2xl text-center font-bold">
                Delete Server
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-indigo-500">
                  {" "}
                  {server?.name}{" "}
                </span>{" "}
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <Button disabled={isLoading} onClick={onClose} variant="ghost">
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={onConfirmLeave}
                  variant="primary"
                >
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
