"use client";

import { Image as ImageIcon, Link2 } from "lucide-react";
import { FC } from "react";
// import { UserAvatar } from './UserAvatar'
import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserAvatar } from "./user-avatar";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface MiniCreatePostProps {
  session: Session | null;
  groupId: Id<"group"> | null;
  onPublicGroup?: boolean;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({
  session,
  groupId,
  onPublicGroup,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const create = useMutation(api.posts.createAsDraft);

  const handleCreate = () => {
    const promise = create({
      userId: session?.user.id as Id<"users">,
      groupId: groupId as Id<"group">,
      title: "",
      content: "",
      username: session?.user.name as string,
      onPublicGroup: onPublicGroup,
    }).then((documentId) =>
      router.push(`/g/${groupId}/post/${documentId}/edit`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <li className="overflow-hidden rounded-md bg-primary-foreground shadow list-none my-5">
      <div className="h-full px-6 py-4 flex justify-between gap-6 align-middle items-center">
        <div className="relative ">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
        </div>
        <Input onClick={handleCreate} readOnly placeholder="Create post" />
        <Button onClick={handleCreate} variant="ghost">
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button onClick={handleCreate} variant="ghost">
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
