"use client";
import PostCard from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { format, formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import UserCommentBox from "./_components/user-comment-box";
import { Post } from "@/types";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const info = useQuery(api.users.getAllInfoById, {
    id: params.userId as Id<"users">,
  });
  // console.log("INFO INFO", info);
  const { data } = useSession();
  const { mutate, pending } = useApiMutation(api.conversation.create);

  const handleConversation = () => {
    mutate({
      user1Id: data?.user.id,
      user2Id: params.userId,
    })
      .then((id) => {
        toast.success("Chat created");
        router.push(`/chat/${id}`);
      })
      .catch(() => toast.error("Failed to create group"));
  };
  return (
    <>
      <Suspense>
        <div>
          <div className="flex items-center justify-between">
            <h1>u/{info?.user.username}</h1>
            {data?.user.id === params.userId ? (
              <Link href={"/chat"}>
                {" "}
                <Button variant="outline">Messages</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={handleConversation}>
                Send DM
              </Button>
            )}
          </div>
          <Separator className="mt-5" />
          {info && info?.createdGroups.length > 0 && (
            <div className="space-x-3 py-3 flex items-center align-middle">
              <h1 className="text-sm text-muted-foreground">Creator</h1>
              {info?.createdGroups.map((group, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <Link
                      href={
                        group.isPublic ? `/g/${group._id}` : `/g/${group._id}`
                      }
                    >
                      <Badge
                        key={index}
                        variant="default"
                        className="hover:cursor-pointer"
                      >
                        {group?.name}
                      </Badge>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="py-2">
                      {" "}
                      Created on:&nbsp;
                      <span className="text-zinc-700 dark:text-neutral-400">
                        {" "}
                        {format(
                          new Date(group._creationTime),
                          "iiii, do MMMM, yyyy p",
                        )}
                      </span>{" "}
                    </p>{" "}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
          {info && info?.joinedGroups.length > 0 && (
            <div className="space-x-3 py-3 flex items-center align-middle">
              <h1 className="text-sm text-muted-foreground">Member </h1>
              {info?.joinedGroups.map((group, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <Link
                      href={
                        group?.group?.isPublic
                          ? `/g/${group?.group?._id}`
                          : `/g/${group?.group?._id}`
                      }
                    >
                      <Badge key={index} variant="secondary">
                        {group?.group?.name}
                      </Badge>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="py-2">
                      {" "}
                      Membership type:&nbsp;
                      <span className="text-zinc-700 dark:text-neutral-400">
                        {" "}
                        {group.memberRole}
                      </span>{" "}
                    </p>
                    <p className="py-2">
                      {" "}
                      Joined on:&nbsp;
                      <span className="text-zinc-700 dark:text-neutral-400">
                        {" "}
                        {format(
                          new Date(group._creationTime),
                          "iiii, do MMMM, yyyy p",
                        )}
                      </span>{" "}
                    </p>{" "}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
          <Separator className="mb-5" />
          <div className="mt-5 space-y-5">
            <h1 className="mb-3">Posts</h1>
            {info?.posts.map((post, index) => (
              <>
                <div>
                  <h1 className="mb-2 text-muted-foreground ml-1">
                    Posted on{" "}
                    <a
                      href={
                        post?.group?.isPublic
                          ? `/g/${post?.group?._id}`
                          : `/g/${post?.group?._id}`
                      }
                    >
                      <span className="hover:text-red-400 hover:cursor-pointer">
                        g/{post.group?.name}
                      </span>{" "}
                    </a>
                    {formatDistanceToNow(post._creationTime)}
                  </h1>
                  <PostCard key={index} post={post as Post} />
                </div>
              </>
            ))}
          </div>
          <div className="my-5 space-y-5">
            <h1>Comments and replies</h1>
            {info?.comments.map((comment, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <h1 className="my-0">
                  {comment.parentComment ? (
                    <h1 className="text-sm">
                      <a
                        href={
                          comment?.group?.isPublic
                            ? `/g/${comment?.group?._id}`
                            : `/g/${comment?.group?._id}`
                        }
                      >
                        <span className="text-muted-foreground hover:text-blue-400">
                          g/{comment.group?.name} &nbsp;|&nbsp;
                        </span>
                      </a>
                      <a
                        href={
                          comment?.group?.isPublic
                            ? `/g/${comment.group._id}/post/${comment.postId}`
                            : `/g/${comment?.group?._id}/post/${comment.postId}`
                        }
                      >
                        <span className="hover:text-blue-400">
                          {comment.post?.title}
                        </span>
                      </a>
                      &nbsp;|&nbsp;[Reply]
                    </h1>
                  ) : (
                    <h1 className="text-sm">
                      <a
                        href={
                          comment?.group?.isPublic
                            ? `/g/${comment.group._id}`
                            : `/g/${comment?.group?._id}`
                        }
                      >
                        <span className="text-muted-foreground hover:text-blue-400">
                          g/{comment.group?.name} &nbsp;|&nbsp;
                        </span>
                      </a>
                      <a
                        href={
                          comment?.group?.isPublic
                            ? `/g/${comment.group._id}/post/${comment.postId}`
                            : `/g/${comment?.group?._id}/post/${comment.postId}`
                        }
                      >
                        <span className="hover:text-blue-400">
                          {comment.post?.title}
                        </span>
                      </a>
                    </h1>
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
