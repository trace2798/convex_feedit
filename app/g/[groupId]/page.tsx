"use client";
import MiniCreatePost from "@/components/mini-create-post";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params }: PageProps) => {
  const group = useQuery(api.group.getById, {
    groupId: params.groupId as Id<"group">,
  });

  const { data, status } = useSession();

  //   const subreddit = await db.subreddit.findFirst({
  //     where: { name: slug },
  //     include: {
  //       posts: {
  //         include: {
  //           author: true,
  //           votes: true,
  //           comments: true,
  //           subreddit: true,
  //         },
  //         orderBy: {
  //           createdAt: "desc",
  //         },
  //         take: INFINITE_SCROLL_PAGINATION_RESULTS,
  //       },
  //     },
  //   });

//   if (!group) return notFound();

  return (
    <>
      <Suspense>
        <h1 className="font-bold text-3xl md:text-4xl h-14">g/{group?.name}</h1>
        <MiniCreatePost session={data} />
        {/*    <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} /> */}
      </Suspense>
    </>
  );
};

export default page;
