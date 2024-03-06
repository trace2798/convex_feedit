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
}

const PostCard: FC<PostCardProps> = ({ post, currentUserId }) => {
  console.log(post);
  return (
    <>
      <Card className="border-transparent border-b-inherit hover:border-indigo-400">
        <Link href={`/g/${post.groupId}/post/${post._id}`} key={post._id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {post.content}
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
