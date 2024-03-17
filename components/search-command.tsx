"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "usehooks-ts";
import { Lock } from "lucide-react";

export const SearchCommand = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 1000);
  const router = useRouter();

  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getSearch,
    { search: debouncedValue },
    { initialNumItems: 10 }
  );

  // console.log("posts", results);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (groupId: string, id: string) => {
    router.push(`/g/${groupId}/post/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search PostIT...`}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Posts [made using convex search index]">
          {results?.map((post) => (
            <div key={post._id}>
              <CommandItem
                value={`${post._id}-${post.title}`}
                title={post.title}
                onSelect={() => onSelect(post.groupId, post._id)}
                className="hover:cursor-pointer flex flex-col"
              >
                <div className="flex  justify-between w-full">
                  {post.title}{" "}
                  {post.onPublicGroup ? "" : <Lock className="h-4 w-4" />}
                </div>
              </CommandItem>
              <div className="text-center text-sm hover:cursor-pointer text-muted-foreground">
                {status === "CanLoadMore" && (
                  <div onClick={() => loadMore(10)}>Load More</div>
                )}
              </div>
            </div>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
