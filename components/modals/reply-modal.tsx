"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReplyModal } from "@/store/use-reply-modal";
import CommentTextArea from "../comment/comment-textarea";

export const ReplyModal = () => {
  const { isOpen, onClose, initialValues } = useReplyModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply Modal</DialogTitle>
        </DialogHeader>
        <CommentTextArea
          currentUserId={initialValues.currentUserId}
          postId={initialValues.postId}
          groupId={initialValues.groupId}
          commentId={initialValues.commentId}
        />
      </DialogContent>
    </Dialog>
  );
};
