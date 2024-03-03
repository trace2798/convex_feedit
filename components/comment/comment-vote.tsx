"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { useLoginModal } from "@/store/use-login-modal";
import { useQuery } from "convex/react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface CommentVotesProps {
  postId: string;
  userId?: string;
  groupId: string;
  commentId: string;
}

const CommentVotes: FC<CommentVotesProps> = ({
  postId,
  userId,
  groupId,
  commentId,
}) => {
  const { onOpen } = useLoginModal();
  console.log(postId, userId, groupId);
  const [currentVote, setCurrentVote] = useState("");
  const [votesAmt, setVotesAmt] = useState(0);
  const votes = useQuery(api.comment_votes.getByCommentId, {
    commentId: commentId as Id<"comments">,
  });
  useEffect(() => {
    // Check if the user has already voted on this post
    const userVote = votes?.votes.find((vote) => vote.userId === userId);
    // If the user has voted, update the currentVote state
    if (userVote) {
      setCurrentVote(userVote.voteType); // Assuming 'type' is either 'UP' or 'DOWN'
    }
    const upvotes =
      votes?.votes.filter((vote) => vote.voteType === "UP").length || 0;
    const downvotes =
      votes?.votes.filter((vote) => vote.voteType === "DOWN").length || 0;
    setVotesAmt(upvotes - downvotes);
  }, [votes, userId]);
  console.log(votes);
  const { mutate, pending } = useApiMutation(api.comment_votes.upvote);
  const { mutate: downVoteMutation, pending: downVotePending } = useApiMutation(
    api.comment_votes.downVote
  );
  const handleUpVote = () => {
    if (!userId) {
      onOpen();
      return;
    }
    mutate({
      userId: userId as Id<"users">,
      groupId: groupId as Id<"group">,
      postId: postId as Id<"posts">,
      commentId: commentId as Id<"comments">,
    }).then(() => {
      // toast.success("Up Voted");
      if (currentVote === "UP") {
        setCurrentVote("");
        setVotesAmt(votesAmt - 1);
      } else {
        setCurrentVote("UP");
        setVotesAmt(votesAmt + 1);
      }
    });
    //   .catch(() => toast.error("Failed to upvote post"));
    //   .catch((e) => console.log(e));
  };

  const handleDownVote = () => {
    if (!userId) {
      onOpen();
      return;
    }
    downVoteMutation({
      userId: userId as Id<"users">,
      groupId: groupId as Id<"group">,
      postId: postId as Id<"posts">,
      commentId: commentId as Id<"comments">,
    }).then(() => {
      // toast.success("Down Voted");
      if (currentVote === "DOWN") {
        setCurrentVote("");
        setVotesAmt(votesAmt + 1);
      } else {
        setCurrentVote("DOWN");
        setVotesAmt(votesAmt - 1);
      }
    });
    //   .catch(() => toast.error("Failed to down vote post"));
    //   .catch((e) => console.log(e));
  };

  return (
    <>
      <div className="flex w-[150px] items-center justify-between">
        {" "}
        <div>
          <Button
            disabled={pending || downVotePending}
            variant="ghost"
            onClick={() => handleUpVote()}
          >
            <ArrowBigUp
              className={cn("h-5 w-5 text-zinc-700", {
                "text-emerald-500 fill-emerald-500": currentVote === "UP",
              })}
            />
          </Button>
          <Button
            disabled={pending || downVotePending}
            variant="ghost"
            className=""
            onClick={() => handleDownVote()}
          >
            <ArrowBigDown
              className={cn("h-5 w-5 text-zinc-700", {
                "text-red-500 fill-red-500": currentVote === "DOWN",
              })}
            />
          </Button>
        </div>
        <div>{votesAmt}</div>
      </div>
    </>
  );
};

export default CommentVotes;
