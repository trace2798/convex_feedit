import Link from "next/link";
import { FC } from "react";
import PostCard from "./post-card";
import { Post } from "@/types";

interface PostFeedProps {
  initialPosts: Post[];
  currentUserId?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, currentUserId }) => {
  console.log(initialPosts);
  return (
    <>
      <div className="space-y-5">
        {initialPosts?.map((post) => (
          <PostCard post={post} currentUserId={currentUserId} />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
