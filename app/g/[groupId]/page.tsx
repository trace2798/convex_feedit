"use client";
import MiniCreatePost from "@/components/mini-create-post";
import PostFeed from "@/components/post-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

interface PageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params }: PageProps) => {
  // const group = useQuery(api.group.getById, {
  //   groupId: params.groupId as Id<"group">,
  // });
  const initialPosts = useQuery(api.posts.getByGroupId, {
    groupId: params.groupId as Id<"group">,
  });
  console.log(initialPosts);
  const { data, status } = useSession();
  if (initialPosts === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  const { group, posts } = initialPosts;
  return (
    <>
      <Suspense>
        <h1 className="font-bold text-3xl md:text-4xl h-14">
          g/{group[0].name}
        </h1>
        <MiniCreatePost session={data} />
        <PostFeed initialPosts={posts} />

        {/* {posts?.map((post) => (
          <Link href={`/g/${params.groupId}/post/${post._id}`} key={post._id}>
            <h1>{post.title}</h1>
          </Link>
        ))} */}
      </Suspense>
    </>
  );
};

export default page;
