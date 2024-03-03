"use client";
import { FC, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface CommentBoxProps {
  currentUserId?: string;
  postId: string;
  groupId: string;
}

const CommentBox: FC<CommentBoxProps> = ({
  currentUserId,
  postId,
  groupId,
}) => {
  const [content, setContent] = useState("");
  const { mutate, pending } = useApiMutation(api.comments.create);
  const handleCommentCreate = () => {
    mutate({
      userId: currentUserId,
      groupId: groupId as Id<"group">,
      content: content,
      postId: postId,
    })
      .then((id) => {
        toast.success("Comment Added");
        // router.push(`/g/${params.groupId}/post/${id}`);
      })
      .catch(() => toast.error("Failed to comment"));
  };

  const handleCancel = () => {
    setContent(""); // Clear the content when the "Cancel" button is clicked
  };

  return (
    <>
      <div>
        <Label>Add your comment</Label>
        <Textarea
          placeholder="Tell us what you think about post"
          className="resize-none mt-2"
          value={content} // Make sure the textarea's value is always in sync with the state
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="space-x-5 mt-3">
          <Button
            disabled={pending || !content}
            onClick={() => handleCommentCreate()}
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

export default CommentBox;
