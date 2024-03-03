"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound, usePathname } from "next/navigation";
import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

const SubRedditPostPage = ({ params }: SubRedditPostPageProps) => {
  console.log(params.postId);
  const pathname = usePathname();
  console.log(pathname);
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  const postInfo = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });

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
  return (
    <div>
      <div className="h-full flex-col items-center sm:items-start justify-between">
        <div>
          <h1>g/{group[0].name}</h1>
          <h1 className="text-muted-foreground">by u/{user[0].name}</h1>
        </div>
        <h1 className="font-bold text-3xl mb-5">{post?.title}</h1>
        <div className="h-full">
          <Editor
            initialContent={post?.content}
            editable={false}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default SubRedditPostPage;
