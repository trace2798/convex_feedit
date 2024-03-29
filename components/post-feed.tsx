import Link from "next/link";
import { FC } from "react";
import PostCard from "./post-card";
import { Post } from "@/types";

interface PostFeedProps {
  initialPosts: Post[];
  currentUserId?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, currentUserId }) => {
  // console.log(initialPosts);
  return (
    <>
      <div className="space-y-5">
        {initialPosts?.map((post, index) => (
          <PostCard
            key={index}
            post={post}
            currentUserId={currentUserId}
            username={post.username as string}
            createdAt={post._creationTime as number}
          />
        ))}
      </div>
    </>
  );
};

export default PostFeed;
