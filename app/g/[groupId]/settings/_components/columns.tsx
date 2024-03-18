"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { Id } from "@/convex/_generated/dataModel";

export type MemberColumn = {
  userInfo: {
    _id: Id<"users">;
    _creationTime: number;
    name?: string | undefined;
    emailVerified?: string | undefined;
    image?: string | undefined;
    email: string;
    username: string;
  } | null;
  _id: Id<"group_members">;
  _creationTime: number;
  userId: Id<"users">;
  groupId: Id<"group">;
  memberRole: "Member" | "Mod" | "Admin" | "Owner";
};

export const columns: ColumnDef<MemberColumn>[] = [
  {
    accessorKey: "userInfo.username",
    header: "Username",
    cell: ({ row }) => {
      const userInfo = row.getValue("userInfo") as { username: string };
      return <div className="">{userInfo ? userInfo.username : "N/A"}</div>;
    },
  },
  {
    accessorKey: "userInfo",
    header: "Email",
    cell: ({ row }) => {
      const userInfo = row.getValue("userInfo") as { email: string };
      return <div>{userInfo ? userInfo.email : "N/A"}</div>;
    },
  },
  {
    accessorKey: "_creationTime",
    header: "Member Since",
    cell: ({ row }) => {
      const creationTime = row.getValue("_creationTime") as number;
      // Convert the timestamp to a Date object
      const date = new Date(creationTime);
      // Format the date
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      return <div>{formattedDate}</div>;
    },
  },

  {
    accessorKey: "memberRole",
    header: "Role",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("memberRole")}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
