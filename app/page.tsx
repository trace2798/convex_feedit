'use client'
import { Social } from "@/components/auth/social";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-50">
        {status === "loading" && (
          <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {status === "authenticated" && (
          <Button asChild className="w-[180px] z-50">
            <Link href="/dashboard">
              Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
        {status === "unauthenticated" && <Social />}
      </div>
    </main>
  );
}
