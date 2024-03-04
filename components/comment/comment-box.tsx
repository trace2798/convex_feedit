"use client";
import { FC } from "react";
import CommentFeed from "./comment-feed";
import CommentTextArea from "./comment-textarea";

interface CommentBoxProps {
  currentUserId?: string;
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
      <div className="mt-10">
        <CommentFeed postId={postId} currentUserId={currentUserId} />
      </div>
    </>
  );
};

export default CommentBox;
