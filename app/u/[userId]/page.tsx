"use client";
import MiniCreatePost from "@/components/mini-create-post";
import PostCard from "@/components/post-card";
import PostFeed from "@/components/post-feed";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

interface PageProps {
  params: {
    userId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const info = useQuery(api.users.getAllInfoById, {
    id: params.userId as Id<"users">,
  });
  console.log("INFO INFO", info);
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1>u/{info?.user.username}</h1>
          <Button variant="outline">Send DM</Button>
        </div>
        <Separator className="mt-5" />
        <div className="mt-5">
          {info?.posts.map((post, index) => (
            <>
              <PostCard key={index} post={post} />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
