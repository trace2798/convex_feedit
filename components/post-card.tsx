import PostVotes from "@/app/g/[groupId]/post/[postId]/_components/post-votes";
import { Post } from "@/types";
import Link from "next/link";
import { FC } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  group?: any;
}

const PostCard: FC<PostCardProps> = ({ post, group, currentUserId }) => {
  console.log(post);

  return (
    <>
      <Card className="border-transparent border-b-inherit hover:border-indigo-400">
        <Link href={`/g/${post.groupId}/post/${post._id}`} key={post._id}>
          <CardHeader>
            {group && (
              <Link
                href={`/${group.isPublic ? "g" : "g"}/${group._id}`}
                className="text-sm text-muted-foreground hover:text-red-400"
              >
                g/{group.name}
              </Link>
            )}
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              <div
                className=""
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: post.content as string }}
              />
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
