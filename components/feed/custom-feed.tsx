"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Group, Post, User } from "@/types";
import { useQuery } from "convex/react";
import PostCard from "../post-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GeneralFeed from "./general-feed";

const CustomFeed = ({ currentUserId }: { currentUserId?: string }) => {
  const posts = useQuery(api.posts.getPersonalizedFeed, {
    userId: currentUserId as Id<"users">,
  });
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
          </TabsContent>
          <TabsContent value="general" className="w-fill">
            <GeneralFeed currentUserId={currentUserId} />
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
