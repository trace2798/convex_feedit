"use client";
import { formatDistanceToNow } from "date-fns";
import { FC, Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import CommentReply from "./comment-reply";
import CommentVotes from "./comment-vote";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface CommentCardProps {
  comment: any;
  currentUserId: string;
}

const CommentCard: FC<CommentCardProps> = ({ comment, currentUserId }) => {
  // console.log("COMMENT CARD", comment);
  return (
    <>
      <Card className="w-full break-words">
        <CardHeader className="pb-1">
          <div className="flex items-center space-x-4">
            <Suspense fallback={<Loader2 className="h-6 w-6" />}>
              <Avatar>
                <AvatarImage src={comment?.user?.image} />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
            </Suspense>
            <div>
              <Link href={`/u/${comment?.userId}`}>
                <p className="text-sm font-medium leading-none hover:text-red-400">
                  u/{comment?.user?.username}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment._creationTime)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-[72px] pb-3">
          <p>{comment?.content}</p>
        </CardContent>
        <CardFooter className="pb-1">
          <CommentVotes
            commentId={comment._id}
            groupId={comment.groupId}
            postId={comment.postId}
            userId={currentUserId}
          />
          <CommentReply
            commentId={comment._id}
            groupId={comment.groupId}
            postId={comment.postId}
            currentUserId={currentUserId}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default CommentCard;
