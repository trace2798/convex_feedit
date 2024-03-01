"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useTagModal } from "@/store/use-tag-modal";

export const TagModal = () => {
  const { data } = useSession();
  const { mutate, pending } = useApiMutation(api.tag.create);

  const { isOpen, onClose, initialValues } = useTagModal();

  const [name, setName] = useState(initialValues.name);

  useEffect(() => {
    setName(initialValues.name);
  }, [initialValues.name]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      name,
      userId: data?.user.id,
    })
      .then(() => {
        toast.success("Snippet renamed");
        onClose();
      })
      //   .catch(() => toast.error("Failed to rename snippet"));
      .catch((error) => console.log(error));
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Snippet title"
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
