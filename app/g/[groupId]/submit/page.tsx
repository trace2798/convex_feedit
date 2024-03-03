"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params }: pageProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const { data } = useSession();
  const group = useQuery(api.group.getById, {
    groupId: params.groupId as Id<"group">,
  });
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  console.log(data);
  const { mutate, pending } = useApiMutation(api.posts.create);
  //   if (!group) return notFound();
  const handlePostCreate = () => {
    mutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
      content: content,
      title: title,
      username: data?.user.name,
    })
      .then((id) => {
        toast.success("Post created");
        router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to create group"));
  };
  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-muted-foreground">
            in r/{group?.name}
          </p>
        </div>
      </div>
      <div className="w-full">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="pl-6 w-full"
          placeholder="Title of your post"
        />
      </div>
      <div className="w-full py-5 rounded-lg border min-h-[40vh]">
        <Editor
          onChange={(value) => setContent(value)}
          initialContent={""}
          editable={true}
        />
      </div>
      <div className="w-full flex justify-end pb-5">
        <Button disabled={pending} type="submit" className="w-full" onClick={handlePostCreate}>
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
