"use client";
import { Id } from "@/convex/_generated/dataModel";
import { FC } from "react";
import { CommentList } from "./comment-list";
import CommentTextArea from "./comment-textarea";

interface CommentBoxProps {
  currentUserId: string;
  postId: string;
  groupId: string;
  commentId: string;
}

const CommentBox: FC<CommentBoxProps> = ({
  currentUserId,
  postId,
  groupId,
  commentId,
}) => {
  return (
    <>
      <CommentTextArea
        currentUserId={currentUserId}
        postId={postId}
        groupId={groupId}
        commentId={commentId}
      />
      <div className="mt-10 space-y-5 mb-10">
        <h1 className="my-5">Comments</h1>
        <CommentList
          postId={postId as Id<"posts">}
          currentUserId={currentUserId}
        />
      </div>
    </>
  );
};

export default CommentBox;
