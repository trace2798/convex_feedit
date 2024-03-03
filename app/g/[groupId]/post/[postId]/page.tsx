"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

// export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubRedditPostPage = ({ params }: SubRedditPostPageProps) => {
  console.log(params.postId);
  const post = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );
  console.log(post);
  return (
    <div>
      <div className="h-full flex-col items-center sm:items-start justify-between">
        {/* <Suspense fallback={<Skeleton />}> */}
        <h1>{post?._id}</h1>
        <h1>{post?.title}</h1>
        <div className="h-full">
          <Editor
            initialContent={post?.content}
            editable={false}
            onChange={() => {}}
          />
        </div>
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default SubRedditPostPage;
