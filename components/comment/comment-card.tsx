"use client";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface CommentCardProps {
  comment: any;
}

const CommentCard: FC<CommentCardProps> = ({ comment }) => {
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
      </Card>
    </>
  );
};

export default CommentCard;
