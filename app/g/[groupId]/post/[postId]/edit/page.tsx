"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowBigDown, ArrowBigUp, Edit3, Loader2 } from "lucide-react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import Tiptap from "@/components/editor/tiptap";
import { Input } from "@/components/ui/input";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const SubRedditEditPostPage = ({ params }: SubRedditPostPageProps) => {
 
  const { data } = useSession();
  console.log(params.postId);
  const router = useRouter();
  const pathname = usePathname();
  console.log(data);
  console.log(pathname);
  const postInfo = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  const { mutate, pending } = useApiMutation(api.posts.update);
  if (postInfo === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (postInfo === null) {
    return <div>Not found</div>;
  }

  console.log(postInfo);
  const { post, group, user } = postInfo;
  const [newcontent, setNewContent] = useState(post.content);
  const [newtitle, setNewTitle] = useState(post.title);
  const handlePublish = () => {
    mutate({
      id: post._id,
      userId: data?.user.id as Id<"users">,
      content: newcontent ?? post.content,
      title: newtitle ?? post.title,
      isPublic: true,
    })
      .then((id) => {
        toast.success("Post updated");
        router.push(`/g/${post.groupId}/post/${post._id}`);
      })
      .catch(() => toast.error("Failed to update post"));
  };
  return (
    <div>
      <div className="h-full flex-col items-center sm:items-start justify-between">
        <div className="flex flex-col mb-5">
          <Link href={`/g/${group[0]._id}`}>
            <h1 className="hover:text-indigo-500">g/{group[0].name}</h1>
          </Link>
          <h1 className="text-muted-foreground text-sm">by u/{user[0].name}</h1>
        </div>
        <h1 className="font-bold text-3xl mb-5">
          <Input
            value={newtitle}
            placeholder={post.title}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          {/* {post?.title} */}
        </h1>
        <div className="h-full">
          <Tiptap
            onChange={(value: any) => setNewContent(value)}
            initialContent={post.content}
            editable={true}
          />
        </div>

        <div className="w-full mt-5 flex justify-between pb-5">
          <Button
            disabled={pending}
            type="submit"
            className="w-[380px]"
            onClick={handlePublish}
          >
            Publish
          </Button>
          <Button
            disabled={pending}
            type="submit"
            variant={"outline"}
            className="w-[380px]"
            // onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubRedditEditPostPage;
