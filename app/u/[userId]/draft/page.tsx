"use client";
import GeneralFeed from "@/components/feed/general-feed";
import PostCard from "@/components/post-card";
import PostFeed from "@/components/post-feed";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Group, Post, User } from "@/types";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { FC, useEffect } from "react";

interface DraftPageProps {}

const DraftPage: FC<DraftPageProps> = ({}) => {
  const { data } = useSession();
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getDraftByUserId,
    { userId: data?.user.id as Id<"users"> },
    { initialNumItems: 10 }
  );
  console.log("DRAFT POST +++>", results);

  useEffect(() => {
    if (!results) return;

    const handleScroll = () => {
      const page = document.documentElement;
      const closeToBottom =
        page.scrollHeight - page.scrollTop - page.clientHeight < 100;
      if (closeToBottom && status === "CanLoadMore") {
        loadMore(1);
      }
    };

    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [status, loadMore, results]);

  if (results === undefined) {
    return (
      <div className="flex flex-col space-y-5">
        <GeneralFeed.Skeleton />
        <GeneralFeed.Skeleton />
      </div>
    );
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your Drafts</h1>
      {results.length === 0 && <h1>You do not have any draft</h1>}
      {results.map((post, index) => (
        <PostCard
          key={index}
          post={post as Post}
          group={post.group as Group}
          user={post.user as User}
          currentUserId={data?.user.id as Id<"users">}
        />
      ))}
    </>
  );
};

export default DraftPage;
