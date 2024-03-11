"use client";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { FC, useEffect } from "react";
import PostCard from "../post-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Post } from "@/types";

const GeneralFeed = ({ currentUserId }: { currentUserId?: string }) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getGeneralFeed,
    { isPublic: true },
    { initialNumItems: 3 }
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
      <div>
        {results.map((post) => (
          <>
            <PostCard post={post as Post} group={post.group} />
          </>
        ))}
      </div>
    </>
  );
};

export default GeneralFeed;

GeneralFeed.Skeleton = function GeneralFeedSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden">
      <Card className="bg-inherit backdrop-blur-sm">
        <CardHeader className="space-y-5">
          <CardTitle>
            <Skeleton className="h-10 w-[20%] dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-900 dark:via-zinc-700" />
          </CardTitle>
          <CardDescription>
            {" "}
            <Skeleton className="h-14 w-[40%] dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-900 dark:via-zinc-700" />
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {" "}
          <Skeleton className="h-24 w-[80%] dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-900 dark:via-zinc-700" />
        </CardContent>
      </Card>
    </div>
  );
};
