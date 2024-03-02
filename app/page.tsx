"use client";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useLoginModal } from "@/store/use-login-modal";
import { useTagModal } from "@/store/use-tag-modal";
import { useQuery } from "convex/react";
import { HomeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { onOpen } = useLoginModal();
  const { data, status } = useSession();
  const { onOpen: TagOpen } = useTagModal();
  const groups = useQuery(api.group.get);
  console.log(groups);
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <div className="z-50">
    //     {status === "loading" && (
    //       <div className="w-full flex items-center justify-center">
    //         <Spinner size="lg" />
    //       </div>
    //     )}
    //     {status === "authenticated" && (
    //       <>
    //         <Button asChild className="w-[180px] z-50">
    //           <Link href="/dashboard">
    //             Dashboard
    //             <ArrowRight className="h-4 w-4 ml-2" />
    //           </Link>
    //         </Button>
    //         <UserButton />
    //         <Button onClick={() => TagOpen()}>Create Tag</Button>
    //       </>
    //     )}
    //     {status === "unauthenticated" && (
    //       <Button onClick={() => onOpen()} className="p-3 cursor-pointer">
    //         Login
    //       </Button>
    //     )}
    //   </div>
    // </main>
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {data ? <h1>Custom Feed</h1> : <h1>General Feed</h1>}

        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 dark:bg-inherit px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal PostIT front page. Come here to check in with your
                favorite groups.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/g/create`}
            >
              Create Group
            </Link>
          </dl>
        </div>

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 dark:bg-inherit px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Groups
            </p>
          </div>
          {groups?.map((g, index) => (
            <Link href={`/g/${g._id}`} key={index}>
              <h1 key={index}>{g.name}</h1>
            </Link>
          ))}
          {/* <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal PostIT front page. Come here to check in with your
                favorite groups.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/g/create`}
            >
              Create Group
            </Link>
          </dl> */}
        </div>
      </div>
    </>
  );
}
