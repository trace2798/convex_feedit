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
import { useUpdateRoleModal } from "@/store/use-update-role-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = ["Member", "Admin", "Mod"];

export const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.group_members.updateRole);

  const { isOpen, onClose, initialValues } = useUpdateRoleModal();

  const [title, setTitle] = useState(initialValues.memberRole);

  useEffect(() => {
    setTitle(initialValues.memberRole);
  }, [initialValues.memberRole]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: initialValues.id,
      memberRole: title,
    })
      .then(() => {
        toast.success("Board renamed");
        onClose();
      })
      .catch(() => toast.error("Failed to rename board"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit member role</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board</DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Command>
            {/* <CommandInput placeholder="Search role..." /> */}
            {/* <CommandEmpty>No role found.</CommandEmpty> */}
            <CommandGroup>
              {roles.map((role: string, index) => (
                <CommandItem
                  value={role}
                  key={index}
                  className="capitalize"
                  onSelect={() => {
                    setTitle(role);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      role === title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
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
