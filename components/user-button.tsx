"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

interface UserButtonProps {
  data: any;
  status: "loading" | "authenticated" | "unauthenticated";
}

const UserButton: FC<UserButtonProps> = ({ data, status }) => {
  if (status === "loading")
    return (
      <>
        <Avatar>
          <AvatarFallback>DP</AvatarFallback>
        </Avatar>
      </>
    );
  console.log("USER", data);
  if (!data) {
    redirect("/");
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="overflow-visible">
          <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
            <Avatar className="relative w-8 h-8">
              {data?.user?.image ? (
                <div className="relative aspect-square h-full w-full">
                  <AvatarImage src={data.user.image} />
                </div>
              ) : (
                <AvatarFallback>
                  <span className="sr-only">{data?.user?.name}</span>
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              {data?.user?.username && (
                <p className="font-medium text-sm ">{data?.user?.username}</p>
              )}
              {data?.user?.email && (
                <p className="w-[200px] truncate text-xs ">
                  {data?.user?.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link href={`/u/${data?.user?.id}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link href={`/u/${data?.user?.id}/draft`}>Drafts</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link href={`/chat`}>Conversation</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;
