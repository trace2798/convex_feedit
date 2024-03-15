"use client";
import CustomFeed from "@/components/feed/custom-feed";
import GeneralFeed from "@/components/feed/general-feed";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useLoginModal } from "@/store/use-login-modal";
import { useTagModal } from "@/store/use-tag-modal";
import { usePaginatedQuery } from "convex/react";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useDebounce } from "usehooks-ts";
export default function Home() {
  const router = useRouter();
  const { onOpen } = useLoginModal();
  const { data, status: StatusAuth } = useSession();
  const { onOpen: TagOpen } = useTagModal();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 1000);

  const { results, status, loadMore } = usePaginatedQuery(
    api.group.get,
    { search: debouncedValue },
    { initialNumItems: 5 }
  );
  console.log(results);

  const onSelect = (id: string) => {
    router.push(`/g/${id}`);
  };

  return (
    <>
      <div className="max-md:flex justify-evenly hidden">
        <div>
          {data ? (
            <>
              <Link
                className={buttonVariants({
                  className: "w-full mb-6",
                  variant: "outline",
                })}
                href={`/g/create`}
              >
                Create Group
              </Link>
            </>
          ) : (
            <>
              <Button
                className="w-full mb-5"
                variant={"outline"}
                onClick={onOpen}
              >
                Create Group
              </Button>
            </>
          )}
        </div>
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Search Group</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Search Group</SheetTitle>
                <SheetDescription>
                  Search functionality is make using Convex withSearchIndex
                </SheetDescription>
              </SheetHeader>
              <Suspense fallback={<Skeleton className="h-4 w-full" />}>
                <Command className="rounded-lg border-none shadow-md">
                  <CommandInput
                    placeholder="Search Group"
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions" className="">
                      {results?.map((g, index) => (
                        <CommandItem
                          key={index}
                          value={`${g._id}-${g.name}`}
                          title={g.name}
                          onSelect={() => onSelect(g._id)}
                        >
                          <div className="flex hover:cursor-pointer justify-between w-full items-center align-middle">
                            {g.name}
                            {g.isPublic ? "" : <Lock className="w-4 h-4" />}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </CommandList>
                </Command>
                <div className="text-center text-sm hover:cursor-pointer text-muted-foreground">
                  {status === "CanLoadMore" && (
                    <div onClick={() => loadMore(3)}>Load More</div>
                  )}
                </div>
              </Suspense>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {data ? (
        <div className="flex justify-between items-center align-middle max-md:flex-col">
          <h1 className="font-bold text-3xl md:text-4xl">Your Feed</h1>
          <div className="space-x-3 flex ">
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
          {data ? (
            <CustomFeed currentUserId={data.user.id as string} />
          ) : (
            <GeneralFeed />
          )}
        </div>
        <div className="h-fit md:w-1/5  flex-col space-y-5 hidden md:flex">
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
            <Suspense fallback={<Skeleton className="h-4 w-full" />}>
              <Command className="rounded-lg border-none shadow-md">
                <CommandInput
                  placeholder="Search Group"
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions" className="">
                    {results?.map((g, index) => (
                      <CommandItem
                        key={index}
                        value={`${g._id}-${g.name}`}
                        title={g.name}
                        onSelect={() => onSelect(g._id)}
                      >
                        <div className="flex hover:cursor-pointer justify-between w-full items-center align-middle">
                          {g.name}
                          {g.isPublic ? "" : <Lock className="w-4 h-4" />}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </CommandList>
              </Command>
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
