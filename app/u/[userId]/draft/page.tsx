"use client";
import PostFeed from "@/components/post-feed";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Post } from "@/types";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface DraftPageProps {}

const DraftPage: FC<DraftPageProps> = ({}) => {
  const { data } = useSession();
  const draftPosts = useQuery(api.posts.getDraftByUserId, {
    userId: data?.user.id as Id<"users">,
  });
  console.log("DRAFT POST +++>", draftPosts);
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your Drafts</h1>

      {draftPosts && draftPosts?.length < 1 ? (
        <>
          <h1>No drafts found</h1>
        </>
      ) : (
        <>
          {draftPosts && (
            <PostFeed
              initialPosts={draftPosts as Post[]}
              currentUserId={data?.user.id}
            />
          )}
        </>
      )}
    </>
  );
};

export default DraftPage;
