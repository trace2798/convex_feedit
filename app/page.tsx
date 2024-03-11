"use client";
import CustomFeed from "@/components/feed/custom-feed";
import GeneralFeed from "@/components/feed/general-feed";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useLoginModal } from "@/store/use-login-modal";
import { useTagModal } from "@/store/use-tag-modal";
import { usePaginatedQuery } from "convex/react";
import { Group, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  const { onOpen } = useLoginModal();
  const { data, status: StatusAuth } = useSession();
  const { onOpen: TagOpen } = useTagModal();

  const { results, status, loadMore } = usePaginatedQuery(
    api.group.get,
    {},
    { initialNumItems: 3 }
  );
  console.log(results);
  return (
    <>
      {data ? (
        <div className="flex justify-between items-center align-middle">
          <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
          <div className="space-x-3 flex max-md:flex-col">
            <Link
              href={`/u/${data?.user?.id}/draft`}
              className={buttonVariants({
                className: "max-w-xl mt-4 mb-6",
                variant: "outline",
              })}
            >
              Your Drafts
            </Link>
            <Link
              href={`/u/${data?.user?.id}`}
              className={buttonVariants({
                className: "max-w-xl mt-4 mb-6",
                variant: "outline",
              })}
            >
              Your Profile
            </Link>
          </div>
        </div>
      ) : (
        <h1 className="font-bold text-3xl md:text-4xl">Discover</h1>
      )}
      <div className="flex flex-col md:flex-row py-6">
        <div className="md:flex-grow md:w-4/5 md:pr-5 lg:pr-10">
          {data ? <CustomFeed /> : <GeneralFeed />}
        </div>
        <div className="h-fit md:w-1/5 flex flex-col space-y-5">
          <div className="border border-slate-300 dark:border-slate-800 rounded-lg">
            <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">Create your own group</p>
              </div>

              {data ? (
                <>
                  <Link
                    className={buttonVariants({
                      className: "w-full mt-4 mb-6",
                    })}
                    href={`/g/create`}
                  >
                    Create Group
                  </Link>
                </>
              ) : (
                <>
                  <Button className="w-full" variant={"ghost"} onClick={onOpen}>
                    Create Group
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="bg-emerald-100 rounded-lg dark:bg-zinc-800 dark:bg-inherit px-6 py-2">
              <p className="font-medium text-xs lg:text-base py-1 flex items-center gap-1.5">
                <Group className="h-6 w-6" />
                Discover Groups
              </p>
            </div>

            <Suspense fallback={<Skeleton className="h-4 w-full" />}>
              {results?.map((g, index) => (
                <>
                  <div key={index}>
                    <Link
                      href={`/${g.isPublic ? "g" : "g"}/${g._id}`}
                      key={index}
                      className=""
                    >
                      <Card className="border-transparent hover:border-indigo-400 hover:text-red-400 my-1">
                        <CardHeader className="py-1 px-2">
                          <CardTitle className="text-lg font-light flex justify-between align-middle items-center">
                            g/{g.name}{" "}
                            {g.isPublic ? "" : <Lock className="w-5 h-5" />}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  </div>
                </>
              ))}
              <div className="text-center text-sm hover:cursor-pointer text-muted-foreground">
                {status === "CanLoadMore" && (
                  <div onClick={() => loadMore(3)}>Load More</div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
