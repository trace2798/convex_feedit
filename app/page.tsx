"use client";
import GeneralFeed from "@/components/feed/general-feed";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useLoginModal } from "@/store/use-login-modal";
import { useTagModal } from "@/store/use-tag-modal";
import { useQuery } from "convex/react";
import { Group, HomeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const { onOpen } = useLoginModal();
  const { data, status } = useSession();
  const { onOpen: TagOpen } = useTagModal();
  const groups = useQuery(api.group.get);
  console.log(groups);
  return (
    <>
      {data ? (
        <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
      ) : (
        <h1 className="font-bold text-3xl md:text-4xl">Discover</h1>
      )}
      <div className="flex flex-col md:flex-row py-6">
        <div className="md:flex-grow md:w-4/5 md:pr-5 lg:pr-10">
          {data ? <h1>Custom Feed</h1> : <GeneralFeed />}
        </div>
        <div className="h-fit md:w-1/5 flex flex-col space-y-5">
          <div className="border border-slate-300 dark:border-slate-800 rounded-lg">
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">Create your own community</p>
              </div>

              <Link
                className={buttonVariants({
                  className: "w-full mt-4 mb-6",
                })}
                href={`/g/create`}
              >
                Create Group
              </Link>
            </div>
          </div>
          <div>
            <div className="bg-emerald-100 rounded-lg dark:bg-zinc-800 dark:bg-inherit px-6 py-2">
              <p className="font-semibold py-1 flex items-center gap-1.5">
                <Group className="h-4 w-4" />
                Discover Groups
              </p>
            </div>

            <Suspense fallback={<Skeleton className="h-4 w-full" />}>
              {groups?.map((g, index) => (
                <Link href={`/g/${g._id}`} key={index}>
                  <h1 key={index}>{g.name}</h1>
                </Link>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
