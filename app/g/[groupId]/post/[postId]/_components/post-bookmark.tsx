"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/store/use-login-modal";
import { useQuery } from "convex/react";
import { Bookmark } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface PostBookmarkProps {
  postId: string;
  userId?: string;
  groupId: string;
}

const PostBookmark: FC<PostBookmarkProps> = ({ postId, userId, groupId }) => {
  const { onOpen } = useLoginModal();
  const [bookmarked, setBookmarked] = useState(false);
  const bookmarks = useQuery(api.bookmark_post.getByPostId, {
    postId: postId as Id<"posts">,
  });

  useEffect(() => {
    const userBookmark = bookmarks?.bookmarks.find(
      (bookmark) => bookmark.userId === userId,
    );
    if (userBookmark) {
      setBookmarked(true);
    }
  }, [bookmarks, userId]);

  const { mutate, pending } = useApiMutation(api.bookmark_post.bookmark);

  const handleBookmark = () => {
    if (!userId) {
      onOpen();
      return;
    }
    mutate({
      userId: userId as Id<"users">,
      groupId: groupId as Id<"group">,
      postId: postId as Id<"posts">,
    })
      .then(() => {
        if (bookmarked) {
          toast.success("Post Unbookmarked");
          setBookmarked(false);
        } else {
          toast.success("Post Bookmarked");
          setBookmarked(true);
        }
      })
      .catch(() => toast.error("Failed to Bookmark Post"));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          disabled={pending}
          variant="ghost"
          className="p-0"
          onClick={() => handleBookmark()}
        >
          <Bookmark
            className={cn("h-5 w-5 text-zinc-700", {
              "text-emerald-500 fill-emerald-500": bookmarked,
            })}
          />
        </Button>
      </div>
    </>
  );
};

export default PostBookmark;
