"use client";
import PostCard from "@/components/post-card";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Group, Post } from "@/types";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC } from "react";

interface BookMarkPageProps {}

const BookMarkPage: FC<BookMarkPageProps> = ({}) => {
  const { data } = useSession();
  if (!data) {
    redirect("/");
  }

  const bookmarkedPostByUserId = useQuery(api.bookmark_post.getByUserId, {
    userId: data?.user.id as Id<"users">,
  });

  if (
    !bookmarkedPostByUserId ||
    bookmarkedPostByUserId.bookmarks.length === 0
  ) {
    return (
      <div className="flex justify-center h-[40vh] items-center">
        <Card className="border-none">
          <CardTitle className="text-center">
            You have not bookmarked any post
          </CardTitle>
        </Card>
      </div>
    );
  }
  return (
    <>
      <Card className="border-none mb-5">
        <CardTitle className="text-center">Saved Posts</CardTitle>
      </Card>

      {bookmarkedPostByUserId.bookmarks.map((bookmark, index) => (
        <PostCard
          post={bookmark.post as Post}
          group={bookmark.group as Group}
          key={index}
          currentUserId={data.user.id}
        />
      ))}
    </>
  );
};

export default BookMarkPage;
