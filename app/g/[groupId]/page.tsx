"use client";
import MiniCreatePost from "@/components/mini-create-post";
import PostFeed from "@/components/post-feed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const initialPosts = useQuery(api.posts.getByGroupId, {
    groupId: params.groupId as Id<"group">,
  });

  const members = useQuery(api.group_members.getMemberByGroupId, {
    groupId: params.groupId as Id<"group">,
  });
  console.log("MEMBERS", members);
  console.log(initialPosts);
  const { data, status } = useSession();
  const checkMembershipAndRole = () => {
    const member = members?.members?.find((m) => m.userId === data?.user?.id);
    if (member) {
      return member.memberRole; // return the role of the member
    }
    return "Join";
  };
  if (initialPosts === undefined) {
    return (
      <div>
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  const { group, posts } = initialPosts;
  return (
    <>
      <Suspense>
        <div className="flex justify-between items-center ">
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            g/{group[0].name}
          </h1>
          <div className="flex gap-4">
            {["Admin", "Owner"].includes(checkMembershipAndRole()) && (
              <Link href={`/g/${params.groupId}/settings`}>
                <Button variant="ghost">
                  <Settings className="text-muted-foreground hover:text-indigo-400" />
                </Button>{" "}
              </Link>
            )}
            <Button>
              {checkMembershipAndRole() === "Join" ? "Join" : "Joined"}
            </Button>
          </div>
        </div>
        <MiniCreatePost session={data} />
        <PostFeed initialPosts={posts} currentUserId={data?.user?.id} />
      </Suspense>
    </>
  );
};

export default Page;
