"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Code2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/store/use-login-modal";
import UserButton from "./user-button";
import { SearchCommand } from "./search-command";
import { useSearch } from "@/hooks/use-search";

export const Navbar = () => {
  const { data, status } = useSession();
  const { onOpen } = useLoginModal();
  const search = useSearch();
  return (
    <>
      <div className="fixed top-0 w-full h-14 px-4 border-b border-muted backdrop-blur-md shadow-sm flex items-center">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
          <Link href="/">
            <Code2Icon />
          </Link>
          <div className="flex items-center align-center space-x-5">
            {/* <SearchCommand/> */}
            <Button onClick={search.onOpen}>Search</Button>
            <ModeToggle />
            {data?.user && <UserButton />}
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
