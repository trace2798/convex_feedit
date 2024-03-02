"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page = ({ params }: pageProps) => {
  const group = useQuery(api.group.getById, {
    groupId: params.groupId as Id<"group">,
  });

  //   if (!group) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-muted-foreground">
            in r/{group?.name}
          </p>
        </div>
      </div>

      {/* form */}
      {/* <Editor subredditId={subreddit.id} /> */}
      <h1>Editor</h1>
      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
