import CommentVotes from "@/components/comment/comment-vote";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FC } from "react";

interface UserCommentBoxProps {
  comment: any;
}

const UserCommentBox: FC<UserCommentBoxProps> = ({ comment }) => {
  return (
    <>
      <Link href={`/g/${comment.groupId}/post/${comment.postId}`}>
        <Card className="hover:border-indigo-500">
          <CardHeader className="">
            <CardDescription className="p-0 break-words">
              {" "}
              {formatDistanceToNow(comment._creationTime)} |
              <span className="text-primary"> {comment.content}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
};

export default UserCommentBox;
