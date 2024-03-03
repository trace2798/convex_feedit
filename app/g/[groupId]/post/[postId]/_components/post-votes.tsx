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

interface PostVotesProps {
  postId: string;
  userId?: string;
  groupId: string;
}

const PostVotes: FC<PostVotesProps> = ({ postId, userId, groupId }) => {
  const { onOpen } = useLoginModal();
  console.log(postId, userId, groupId);
  const [currentVote, setCurrentVote] = useState("");
  const [votesAmt, setVotesAmt] = useState(0);
  const votes = useQuery(api.votes.getByPostId, {
    postId: postId as Id<"posts">,
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
  const { mutate, pending } = useApiMutation(api.votes.upvote);
  const { mutate: downVoteMutation, pending: downVotePending } = useApiMutation(
    api.votes.downVote
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
      <div className="flex w-[200px] items-center justify-evenly">
        {" "}
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
        {/* {votes?.votes.length} */}
        {votesAmt}
      </div>
    </>
  );
};

export default PostVotes;
