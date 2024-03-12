"use client";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { useLoginModal } from "@/store/use-login-modal";
import { Code2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import UserButton from "./user-button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { User } from "@/types";
import { redirect } from "next/navigation";

export const Navbar = () => {
  const { data, status } = useSession();
  const { onOpen } = useLoginModal();
  const search = useSearch();
  if (status === "loading") {
    <h1>Loading</h1>;
  }
  // const user = useQuery(api.users.getByEmail, {
  //   email: data?.user?.email as string,
  // });
  return (
    <>
      <div className="fixed top-0 w-full h-14 px-4 border-b border-muted backdrop-blur-md shadow-sm flex items-center z-50">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
          <Link href="/">
            <Code2Icon />
          </Link>
      
          <div className="flex items-center align-center space-x-5">
            {/* <SearchCommand/> */}
            <Link href={"/chat"}>
              <Button variant="ghost">Chat</Button>
            </Link>
            <ModeToggle />
            {data?.user && <UserButton data={data} status={status} />}
            {status === "unauthenticated" && (
              <Button
                onClick={() => onOpen()}
                className="p-3 cursor-pointer"
                variant="secondary"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
