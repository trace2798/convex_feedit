"use client";
import MiniCreatePost from "@/components/mini-create-post";
import PostFeed from "@/components/post-feed";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Post } from "@/types";
import { useQuery } from "convex/react";
import { Bell, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

interface PageProps {
  params: {
    groupId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { data, status } = useSession();
  const path = usePathname();
  // console.log(path, "PATH PATH");
  const router = useRouter();
  const initialPosts = useQuery(api.posts.getByGroupId, {
    groupId: params.groupId as Id<"group">,
    userId: data?.user?.id as Id<"users">,
  });

  const members = useQuery(api.group_members.getMemberByGroupIdandUserId, {
    groupId: params.groupId as Id<"group">,
    userId: data?.user?.id as Id<"users">,
  });
  const { mutate: cancelRequestMutate, pending: cancelRequestPending } =
    useApiMutation(api.group_join_request.cancelGroupRequest);
  // console.log("MEMBERS MEMBERS ===+>", members);
  // console.log(initialPosts);
  const { mutate, pending } = useApiMutation(api.group_members.joinGroup);
  const { mutate: sentRequestMutate, pending: sentRequestPending } =
    useApiMutation(api.group_join_request.joinGroupRequest);
  const handleRequestSent = () => {
    sentRequestMutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
    })
      .then(() => {
        toast.success("Successful");
      })
      .catch(() => toast.error("Oops! Something went wrong."));
  };

  const handleJoinGroup = () => {
    mutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
    })
      .then(() => {
        toast.success("Successful");
      })
      .catch(() => toast.error("Oops! Something went wrong."));
  };
  const checkMembershipAndRole = (currentUserId: string) => {
    const member = members?.members?.find((m) => m.userId === currentUserId);
    if (member) {
      return member.memberRole; // return the role of the member
    }
    return "Join";
  };

  const handleCancelGroupRequest = () => {
    cancelRequestMutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
    })
      .then(() => {
        toast.success("Successful");
      })
      .catch(() => toast.error("Oops! Something went wrong."));
  };
  const isMember = () => {
    const member = members?.members?.find((m) => m.userId === data?.user?.id);
    return !!member; // return true if the member exists, false otherwise
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

  if (!group[0].isPublic) {
    router.push(`/g/${params.groupId}`);
  }
  if (group[0].isPublic) {
    return (
      <>
        <Suspense>
          <div className="flex justify-between items-center align-middle text-center ">
            <h1 className="font-bold text-3xl md:text-4xl h-14">
              g/{group[0].name}
            </h1>
            {data && isMember() && (
              <div className="max-w-xl flex ">
                {["Admin", "Owner"].includes(
                  checkMembershipAndRole(data.user.id as string)
                ) && (
                  <Link href={`/g/${params.groupId}/settings`}>
                    <Button variant="ghost">
                      <Settings className="text-muted-foreground hover:text-indigo-400" />
                    </Button>{" "}
                  </Link>
                )}

                {["Admin", "Owner"].includes(
                  checkMembershipAndRole(data.user.id as string)
                ) ? (
                  <Button disabled variant="outline">
                    Leave
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleJoinGroup}>
                    Leave
                  </Button>
                )}
              </div>
            )}
            {!isMember() && (
              <Button variant="outline" onClick={handleJoinGroup}>
                Join
              </Button>
            )}
          </div>

          {data && (
            <MiniCreatePost
              session={data}
              groupId={params.groupId as Id<"group">}
              onPublicGroup={true}
            />
          )}
          <PostFeed
            initialPosts={posts as Post[]}
            currentUserId={data?.user?.id}
          />
        </Suspense>
      </>
    );
  }
  if (!group[0].isPublic) {
    return (
      <>
        <div className="flex justify-between items-center align-middle text-center ">
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            g/{group[0].name}
          </h1>
          {data && (
            <div className="max-w-xl flex ">
              {["Admin", "Owner"].includes(
                checkMembershipAndRole(data.user.id as string)
              ) && (
                <Link href={`/g/${params.groupId}/request`}>
                  <Button variant="ghost">
                    <Bell className="text-muted-foreground hover:text-indigo-400" />
                  </Button>{" "}
                </Link>
              )}
              {["Admin", "Owner"].includes(
                checkMembershipAndRole(data.user.id as string)
              ) && (
                <Link href={`/g/${params.groupId}/settings`}>
                  <Button variant="ghost">
                    <Settings className="text-muted-foreground hover:text-indigo-400" />
                  </Button>{" "}
                </Link>
              )}

              {["Admin", "Owner"].includes(
                checkMembershipAndRole(data.user.id as string)
              ) ? (
                <Button disabled variant="outline">
                  Leave
                </Button>
              ) : (
                ""
              )}
              {["Member", "Mod"].includes(
                checkMembershipAndRole(data.user.id as string)
              ) ? (
                <Button
                  className=""
                  variant="outline"
                  onClick={handleJoinGroup}
                >
                  Leave
                </Button>
              ) : (
                ""
              )}
              {members?.requestInfo?.userId === data?.user?.id &&
              members?.requestInfo?.requestOutcome === "Pending" ? (
                <div>
                  <Button variant="outline" className="bg-yellow-500">
                    Request Pending
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-3"
                    onClick={handleCancelGroupRequest} // Uncomment this line
                  >
                    Cancel Request
                  </Button>
                </div>
              ) : members?.members.find((m) => m.userId === data?.user?.id) ? (
                ""
              ) : (
                <Button variant="outline" onClick={handleRequestSent}>
                  Request to Join
                </Button>
              )}
            </div>
          )}
        </div>
        {data && members?.members.find((m) => m.userId === data?.user?.id) && (
          <>
            <MiniCreatePost
              session={data}
              groupId={params.groupId as Id<"group">}
              onPublicGroup={false}
            />
            <PostFeed
              initialPosts={posts as Post[]}
              currentUserId={data?.user?.id}
            />
          </>
        )}
        {data && !members?.members.find((m) => m.userId === data?.user?.id) && (
          <>
            <div className="flex justify-center h-[40vh] items-center">
              <Card className="border-none">
                <CardTitle className="text-center">
                  Private group. You need to be a member to see the posts
                  published here.
                </CardTitle>
              </Card>
            </div>
          </>
        )}
        {!data && (
          <>
            <div className="flex justify-center h-[40vh] items-center">
              <Card className="border-none">
                <CardTitle className="text-center">
                  Private group. You need to be logged in
                </CardTitle>
              </Card>
            </div>
          </>
        )}
        {}
      </>
    );
  }
};

export default Page;
