"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useLoginModal } from "@/store/use-login-modal";

interface CommentTextAreaProps {
  currentUserId?: string;
  postId: string;
  groupId: string;
  commentId: string;
}

const CommentTextArea: FC<CommentTextAreaProps> = ({
  currentUserId,
  postId,
  groupId,
  commentId,
}) => {
  const { onOpen } = useLoginModal();
  const [content, setContent] = useState("");
  const { mutate, pending } = useApiMutation(api.comments.create);
  const handleCommentCreate = () => {
    if (!currentUserId) {
      onOpen();
      return;
    }
    // console.log("COMMENT ID", commentId);
    mutate({
      userId: currentUserId,
      groupId: groupId as Id<"group">,
      content: content,
      postId: postId,
      // parentComment: commentId as Id<"comments"> || "",
    })
      .then((id) => {
        toast.success("Comment Added");
        setContent("");
        // router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to comment"));
    // .catch((error) => console.log(error));
  };

  const { mutate: replyMutation, pending: replyPending } = useApiMutation(
    api.comments.createReply
  );
  const handleReply = () => {
    if (!currentUserId) {
      onOpen();
      return;
    }
    // console.log("COMMENT ID", commentId);
    replyMutation({
      userId: currentUserId,
      groupId: groupId as Id<"group">,
      content: content,
      postId: postId,
      parentComment: (commentId as Id<"comments">) || "",
    })
      .then((id) => {
        toast.success("Comment Added");
        setContent("");
        // router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to comment"));
    // .catch((error) => console.log(error));
  };

  const handleCancel = () => {
    setContent(""); // Clear the content when the "Cancel" button is clicked
  };

  return (
    <>
      <div>
        <Label>{commentId ? "Reply" : " Add your comment"}</Label>
        <Textarea
          disabled={!currentUserId}
          placeholder={
            !currentUserId
              ? "Sign in to comment"
              : "What do you think of the post"
          }
          className="resize-none mt-2"
          value={content} // Make sure the textarea's value is always in sync with the state
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="space-x-5 mt-3">
          {/* {currentUserId} {postId} {groupId} {commentId} */}
          <Button
            disabled={pending || !content || replyPending}
            onClick={
              commentId ? () => handleReply() : () => handleCommentCreate()
            }
          >
            Post
          </Button>
          <Button
            disabled={!content}
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default CommentTextArea;
