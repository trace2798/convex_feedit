"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { Item } from "./items";
import { Card, CardTitle } from "../ui/card";

interface CommentListProps {
  parentCommentId?: Id<"comments">;
  level?: number;
  data?: Doc<"comments">[];
  postId: Id<"posts">;
  currentUserId: string;
}

export const CommentList = ({
  parentCommentId,
  level = 0,
  postId,
  currentUserId,
}: CommentListProps) => {
  const params = useParams();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (commentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [commentId]: !prevExpanded[commentId],
    }));
  };

  const comments = useQuery(api.comments.getCommentsByPost, {
    postId: params.postId as Id<"posts">,
    parentComment: parentCommentId,
  });
  console.log("COMMENTS ALL, comments", comments);

  if (comments === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No more comments to show.
      </p>
      {comments.map((comment) => (
        <div key={comment._id} >
          <Item
            level={level}
            onExpand={() => onExpand(comment._id)}
            expanded={expanded[comment._id]}
            comment={comment}
            currentUserId={currentUserId}
          />
          {expanded[comment._id] && (
            <CommentList
              postId={postId}
              parentCommentId={comment._id}
              level={level + 1}
              currentUserId={currentUserId}
            />
          )}
        </div>
      ))}
    </>
  );
};
