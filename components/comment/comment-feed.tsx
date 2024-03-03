import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { FC } from "react";
import { Card, CardTitle } from "../ui/card";
import CommentCard from "./comment-card";

interface CommentFeedProps {
  postId: string;
}

const CommentFeed: FC<CommentFeedProps> = ({ postId }) => {
  const comments = useQuery(api.comments.getByPostId, {
    postId: postId as Id<"posts">,
  });

  console.log(comments);
  //   if (comments?.comments.length === 0) {
  //     <h1>Be the First one to Comment</h1>;
  //   }
  return (
    <>
      <div className="space-y-4 mb-10">
        {comments?.comments.length === 0 ? (
          <Card className="text-center border-none">
            <CardTitle>Be the one to start a conversation</CardTitle>
          </Card>
        ) : (
          comments?.comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))
        )}
      </div>
    </>
  );
};

export default CommentFeed;
