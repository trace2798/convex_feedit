"use client";
import GeneralFeed from "@/components/feed/general-feed";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Group, Post, User } from "@/types";
import { usePaginatedQuery } from "convex/react";
import Link from "next/link";
import { FC, useEffect } from "react";

interface DraftFeedProps {
  currentUserId: string;
}

const DraftFeed: FC<DraftFeedProps> = ({ currentUserId }) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getDraftByUserId,
    { userId: currentUserId as Id<"users"> },
    { initialNumItems: 10 },
  );

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
      {results.length === 0 && (
        <div className="flex justify-center h-[40vh] items-center">
          <Card className="border-none flex flex-col justify-center items-center">
            <CardTitle className="text-center">Your Draft is empty</CardTitle>
            <CardFooter className="group">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="mt-10 group-hover:text-indigo-500"
                >
                  Back to Home
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}
      {results.map((post, index) => (
        <PostCard
          key={index}
          post={post as Post}
          group={post.group as Group}
          user={post.user as User}
          currentUserId={currentUserId as Id<"users">}
        />
      ))}
    </>
  );
};

export default DraftFeed;
