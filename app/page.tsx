"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import { useLoginModal } from "@/store/use-login-modal";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { onOpen } = useLoginModal();
  const { status } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-50">
        {status === "loading" && (
          <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {status === "authenticated" && (
          <>
            <Button asChild className="w-[180px] z-50">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <UserButton />
          </>
        )}
        {status === "unauthenticated" && (
          <Button onClick={() => onOpen()} className="p-3 cursor-pointer">
            Login
          </Button>
        )}
      </div>
    </main>
  );
}
