"use client";

import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { MemberColumn } from "./columns";
// import { removeMember } from "./member-action";

interface CellActionProps {
  data: MemberColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  console.log(data);
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutate, pending } = useApiMutation(api.group_members.removeMember);

  const onConfirm = async () => {
    try {
      setLoading(true);
      mutate({ memberId: data?._id });
      // const response = await removeMember(
      //   params.organizationId as string,
      //   data.id
      // );
      const response = null;
      console.log(response);
      // if (response?.message === "Owner cannot be removed.") {
      //   toast.error("Not permitted. Owner cannot be removed");
      // } else if (response?.message === "Operation not permitted.") {
      //   toast.error("Operation not permitted.");
      // } else {
      //   toast.success("User Removed.");
      // }

      //  toast.success("User Removed.");
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove user");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User ID copied to clipboard.");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data?._id || "")}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
