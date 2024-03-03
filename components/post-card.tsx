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
import { title } from "process";
import { BlockNoteView } from "@blocknote/react";
import PostVotes from "@/app/g/[groupId]/post/[postId]/_components/post-votes";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

const PostCard: FC<PostCardProps> = ({ post, currentUserId }) => {
  console.log(post);
  return (
    <>
      <Card className="">
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
