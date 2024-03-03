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

interface CommentCardProps {
  comment: any;
  currentUserId?: string;
}

const CommentCard: FC<CommentCardProps> = ({ comment, currentUserId }) => {
  return (
    <>
      <Card>
        <CardHeader>
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
        <CardContent>
          <p>{comment?.content}</p>
        </CardContent>
        <CardFooter>
          <CommentVotes
            commentId={comment._id}
            groupId={comment.groupId}
            postId={comment.postId}
            userId={currentUserId}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default CommentCard;
