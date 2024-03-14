import PostVotes from "@/app/g/[groupId]/post/[postId]/_components/post-votes";
import { Group, Post, User } from "@/types";
import Link from "next/link";
import { FC } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  group?: Group;
  user?: User;
  username?: string;
  createdAt?: number;
}

const PostCard: FC<PostCardProps> = ({
  post,
  username,
  user,
  group,
  currentUserId,
  createdAt,
}) => {
  console.log(post);

  return (
    <>
      <Card className="border-transparent border-b-inherit hover:border-indigo-400">
        <Link href={`/g/${post.groupId}/post/${post._id}`} key={post._id}>
          <CardHeader>
            {group && (
              <div>
                <Link
                  href={`/${group.isPublic ? "g" : "g"}/${group._id}`}
                  className="text-sm text-muted-foreground hover:text-red-400"
                >
                  g/{group.name}
                </Link>
                &nbsp;|&nbsp;
                {post.publishedAt !== null && (
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(post.publishedAt)}
                  </span>
                )}
              </div>
            )}
            {createdAt && (
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(createdAt)}
              </span>
            )}
            {/* {post.publishedAt && (
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(post.publishedAt)}
              </span>
            )} */}
            {user && (
              <Link
                href={`/u/${user._id}`}
                className="text-sm text-muted-foreground hover:text-red-400"
              >
                u/{user.username}
              </Link>
            )}
            {username && (
              <Link
                href={`/u/${post.userId}`}
                className="text-sm text-muted-foreground hover:text-red-400"
              >
                u/{username}
              </Link>
            )}
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {post.aiGeneratedBrief ? (
                <div>{post.aiGeneratedBrief}</div>
              ) : (
                <>
                  <div
                    className=""
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: post.content as string }}
                  />
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Link>
        <CardFooter>
          <PostVotes
            postId={post._id}
            userId={currentUserId}
            groupId={post.groupId}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default PostCard;
