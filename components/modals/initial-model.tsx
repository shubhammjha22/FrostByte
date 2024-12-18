"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";

export default function InitialModal() {
  const formSchema = z.object({
    name: z.string().min(1, { message: "Server Name is required" }),
    imgUrl: z.string().min(1, { message: "Server Img is required" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Valu is ", values);
    try {
      await axios.post("/api/servers", values);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log("Error is -", error);
    }
  };

  return (
    <>
      <Dialog open>
        <DialogContent className="bg-white text-black p-0 overflow-hidden ">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Customize your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image.
              <br /> You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imgUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Label
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
                          placeholder="Enter Server Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary" disabled={isLoading}>
                  Create Server
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
