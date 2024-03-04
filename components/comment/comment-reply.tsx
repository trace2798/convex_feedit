"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { FC } from "react";
import CommentTextArea from "./comment-textarea";

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
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="ml-10">
            Reply
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <CommentTextArea
            currentUserId={currentUserId}
            postId={postId}
            groupId={groupId}
            commentId={commentId}
          />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentReply;
