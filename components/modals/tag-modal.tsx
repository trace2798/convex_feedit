"use client";

import { FormEventHandler, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useTagModal } from "@/store/use-tag-modal";
import { useSession } from "next-auth/react";

export const TagModal = () => {
  const { data } = useSession();
  const { mutate, pending } = useApiMutation(api.tag.create);

  const { isOpen, onClose } = useTagModal();

  const [name, setName] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      name,
      userId: data?.user.id,
    })
      .then(() => {
        toast.success("Tag created");
        onClose();
      })
      .catch(() => toast.error("Failed to create tag"));
    //   .catch((error) => console.log(error));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter Tag Name</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            disabled={pending}
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
