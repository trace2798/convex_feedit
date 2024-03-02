"use client";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params }: PageProps) => {
  const { groupId } = params;

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

  //   if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">g/{}</h1>
      {/* <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} /> */}
    </>
  );
};

export default page;
