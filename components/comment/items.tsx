"use client";

import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import CommentCard from "./comment-card";

interface ItemProps {
  //   id?: Id<"comments">;
  comment?: any;
  //   documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;

  //   icon: LucideIcon;
  currentUserId: string;
}

export const Item = ({
  //   id,

  //   icon: Icon,
  active,
  //   documentIcon,
  level = 0,
  onExpand,
  expanded,
  comment,
  currentUserId,
}: ItemProps) => {
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      //   onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 30 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm w-full pb-1 hover:bg-primary/5 flex flex-col text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      <CommentCard comment={comment} currentUserId={currentUserId} />
      {!!comment && (
        <div
          role="button"
          className="h-full rounded-sm hidden group-hover:block hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
