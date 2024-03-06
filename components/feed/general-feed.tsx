"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { FC } from "react";
import PostCard from "../post-card";

interface GeneralFeedProps {}

const GeneralFeed: FC<GeneralFeedProps> = ({}) => {
  const posts = useQuery(api.posts.getGeneralFeed);
  return (
    <>
      <div>
        {posts?.posts.map((post) => (
          <>
            {/* <h1>{post.title}</h1> */}
            <PostCard post={post} />
          </>
        ))}
      </div>
    </>
  );
};

export default GeneralFeed;
