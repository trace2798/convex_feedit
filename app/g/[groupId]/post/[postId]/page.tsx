"use client";
import Editor from "@/components/editor";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface SubRedditPostPageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubRedditPostPage = ({ params }: SubRedditPostPageProps) => {
  console.log(params.postId);
  const post = useQuery(api.posts.getById, {
    postId: params.postId as Id<"posts">,
  });
  console.log(post);
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense>
          <h1>{post?.title}</h1>
          <Editor
            onChange={() => {}}
            initialContent={post?.content}
            editable={false}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default SubRedditPostPage;
