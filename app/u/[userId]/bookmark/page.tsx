"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

  if (!bookmarkedPostByUserId || bookmarkedPostByUserId.bookmarks.length === 0) {
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
      <div>page</div>
      {bookmarkedPostByUserId?.bookmarks.map((bookmark) => (
        <h1>{bookmark.postId}</h1>
      ))}
    </>
  );
};

export default BookMarkPage;
