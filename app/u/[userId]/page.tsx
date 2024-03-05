"use client";
import CommentCard from "@/components/comment/comment-card";
import MiniCreatePost from "@/components/mini-create-post";
import PostCard from "@/components/post-card";
import PostFeed from "@/components/post-feed";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";
import UserCommentBox from "./_components/user-comment-box";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const info = useQuery(api.users.getAllInfoById, {
    id: params.userId as Id<"users">,
  });
  console.log("INFO INFO", info);
  const { data } = useSession();
  return (
    <>
      <Suspense>
        <div>
          <div className="flex items-center justify-between">
            <h1>u/{info?.user.username}</h1>
            <Button variant="outline">Send DM</Button>
          </div>
          <Separator className="mt-5" />
          <div className="mt-5">
            <h1 className="mb-3">Posts</h1>
            {info?.posts.map((post, index) => (
              <>
                <PostCard key={index} post={post} />
              </>
            ))}
          </div>
          <div className="my-5 space-y-5">
            <h1>Comments and replies</h1>
            {info?.comments.map((comment, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <h1 className="my-0">
                  {comment.parentComment ? (
                    <h1>
                      Replied to a comment on Post:{" "}
                      <a href={`/g/${comment.groupId}/post/${comment.postId}`}>
                        <span className="hover:text-blue-400">
                          {comment.post?.title}
                        </span>
                      </a>
                    </h1>
                  ) : (
                    ""
                  )}{" "}
                </h1>
                <UserCommentBox comment={comment} />
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default Page;
