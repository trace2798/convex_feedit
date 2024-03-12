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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralFeed from "./general-feed";
import { Id } from "@/convex/_generated/dataModel";
import { Group, Post, User } from "@/types";
import PostFeed from "../post-feed";

const CustomFeed = ({ currentUserId }: { currentUserId?: string }) => {
  // const { results, status, loadMore } = usePaginatedQuery(
  //   api.posts.getPersonalizedFeed,
  //   { isPublic: true },
  //   { initialNumItems: 3 }, {userId: currentUserId} }
  // );
  // const posts = usePaginatedQuery(api.posts.getPersonalizedFeed, {
  //   userId: currentUserId as Id<"users">,

  // });
  const posts = useQuery(api.posts.getPersonalizedFeed, {
    userId: currentUserId as Id<"users">,
  });
  // const { results, status, loadMore } = usePaginatedQuery(
  //   api.posts.getPersonalizedFeed,
  //   { userId: currentUserId as Id<"users"> },
  //   { initialNumItems: 5 },
  // );
  // console.log("CUSTOM FEED ===>", results);
  return (
    <>
      <div>
        <Tabs defaultValue="custom">
          <TabsList>
            <TabsTrigger value="custom">Personalize</TabsTrigger>
            <TabsTrigger value="general">Discover</TabsTrigger>
          </TabsList>
          <TabsContent value="custom">
            {posts?.map((post, index) => (
              <PostCard
                key={index}
                post={post as Post}
                group={post.group as Group}
                user={post.user as User}
                currentUserId={currentUserId}
              />
            ))}
            {/* <PostFeed initialPosts={posts} group={} currentUserId={currentUserId} /> */}
          </TabsContent>
          <TabsContent value="general" className="w-fill">
            <GeneralFeed />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CustomFeed;

CustomFeed.Skeleton = function CustomFeedSkeleton() {
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
