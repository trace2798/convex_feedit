"use client";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import CommentVotes from "./comment-vote";
import CommentReply from "./comment-reply";

interface CommentCardProps {
  comment: any;
  currentUserId: string;
}

const CommentCard: FC<CommentCardProps> = ({ comment, currentUserId }) => {
  
  return (
    <>
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={comment.user?.image} />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {comment?.user?.name}
              </p>
              <p className="text-sm text-muted-foreground">
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
