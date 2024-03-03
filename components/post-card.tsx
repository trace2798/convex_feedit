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

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
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
        <CardFooter>Votes</CardFooter>
      </Card>
    </>
  );
};

export default PostCard;
