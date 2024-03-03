import Link from "next/link";
import { FC } from "react";
import PostCard from "./post-card";
import { Post } from "@/types";

interface PostFeedProps {
  initialPosts: Post[];
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts }) => {
  console.log(initialPosts);
  return (
    <>
      <div className="space-y-5">
        {initialPosts?.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
