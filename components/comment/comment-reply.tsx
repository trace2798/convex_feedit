"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLoginModal } from "@/store/use-login-modal";
import { FC } from "react";
import CommentTextArea from "./comment-textarea";
import { useReplyModal } from "@/store/use-reply-modal";

interface CommentReplyProps {
  commentId: string;
  postId: string;
  groupId: string;
  currentUserId: string;
}

const CommentReply: FC<CommentReplyProps> = ({
  commentId,
  postId,
  groupId,
  currentUserId,
}) => {
  const { onOpen } = useLoginModal();
  const { onOpen: replyModal, initialValues } = useReplyModal();
  return (
    <>
      <>
        {!currentUserId ? (
          <Button
            onClick={() => onOpen()}
            className="ml-5 cursor-pointer"
            variant="ghost"
          >
            Login to reply
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="ml-10"
            onClick={() =>
              replyModal(currentUserId, postId, groupId, commentId)
            }
          >
            Reply
          </Button>
        )}
      </>
    </>
  );
};

export default CommentReply;
