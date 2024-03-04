"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC } from "react";
import CommentTextArea from "./comment-textarea";
import { useLoginModal } from "@/store/use-login-modal";

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
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
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
              <Button variant="ghost" className="ml-10">
                Reply
              </Button>
            )}
          </>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <CommentTextArea
            currentUserId={currentUserId}
            postId={postId}
            groupId={groupId}
            commentId={commentId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentReply;
