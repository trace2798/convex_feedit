"use client";
import MiniCreatePost from "@/components/mini-create-post";
import PostFeed from "@/components/post-feed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { Bell, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

interface PrivateGroupIdPageProps {
  params: {
    groupId: string;
  };
}

const PrivateGroupIdPage = ({ params }: PrivateGroupIdPageProps) => {
  const { data, status } = useSession();
  const initialPosts = useQuery(api.posts.getByGroupId, {
    groupId: params.groupId as Id<"group">,
  });

  const members = useQuery(api.group_members.getMemberByGroupId, {
    groupId: params.groupId as Id<"group">,
  });
  const requestStatus = useQuery(api.group_join_request.getById, {
    userId: data?.user.id as Id<"users">,
    groupId: params.groupId as Id<"group">,
  });
  console.log("MEMBERS MEMBERS+>", members);
  console.log(initialPosts);
  const { mutate, pending } = useApiMutation(api.group_members.joinGroup);
  const { mutate: sentRequestMutate, pending: sentRequestPending } =
    useApiMutation(api.group_join_request.joinGroupRequest);
  const { mutate: cancelRequestMutate, pending: cancelRequestPending } =
    useApiMutation(api.group_join_request.cancelGroupRequest);
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
  const checkMembershipAndRole = () => {
    const member = members?.members?.find((m) => m.userId === data?.user?.id);
    if (member) {
      return member.memberRole; // return the role of the member
    }
    return "Join";
  };

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

  console.log("REQUEST STATUS", requestStatus);
  console.log("GROUO PRIVATE", group);

  return (
    <>
      <Suspense>
        <div className="flex justify-between items-center ">
          <h1 className="font-bold text-3xl md:text-4xl h-14">
            g/{group[0].name}
          </h1>
          <div className="flex gap-4">
            {["Admin", "Owner"].includes(checkMembershipAndRole()) && (
              <Link href={`/g-private/${params.groupId}/request`}>
                <Button variant="ghost">
                  <Bell className="text-muted-foreground hover:text-indigo-400" />
                </Button>{" "}
              </Link>
            )}
            {["Admin", "Owner"].includes(checkMembershipAndRole()) && (
              <Link href={`/g-private/${params.groupId}/settings`}>
                <Button variant="ghost">
                  <Settings className="text-muted-foreground hover:text-indigo-400" />
                </Button>{" "}
              </Link>
            )}
            {group[0].isPublic ? (
              <Button variant="outline" onClick={handleJoinGroup}>
                {checkMembershipAndRole() === "Join" ? "Join" : "Leave"}
              </Button>
            ) : (
              ""
            )}

            {group[0].isPublic ? (
              ""
            ) : requestStatus && requestStatus?.length > 0 ? (
              ""
            ) : (
              <Button
                variant="outline"
                onClick={handleRequestSent}
                className="bg-blue-700"
              >
                {checkMembershipAndRole() === "Join"
                  ? "Request to Join"
                  : "Leave"}
              </Button>
            )}

            {!group[0].isPublic &&
              requestStatus &&
              requestStatus?.length > 0 && (
                <>
                  {requestStatus[0].requestOutcome === "Pending" && (
                    <div>
                      <Button variant="outline" className="bg-yellow-500">
                        Request Pending
                      </Button>
                      <Button
                        variant="ghost"
                        className="ml-3"
                        onClick={handleCancelGroupRequest}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  )}
                  {requestStatus[0].requestOutcome === "Approved" && (
                    <Button variant="outline" className="bg-green-500">
                      Request Approved
                    </Button>
                  )}
                  {requestStatus[0].requestOutcome === "Rejected" && (
                    <Button variant="outline" className="bg-red-500">
                      Request Declined
                    </Button>
                  )}
                </>
              )}
          </div>
        </div>
        {group[0].isPublic ||
          (requestStatus && requestStatus[0].requestOutcome === "Approved") ||
          (checkMembershipAndRole() && <MiniCreatePost session={data} />)}
        {group[0].isPublic ||
        members?.members?.some((m) => m.userId === data?.user?.id) ? (
          <PostFeed initialPosts={posts} currentUserId={data?.user?.id} />
        ) : (
          <p className="text-center">
            This is a private group you need to join this group to see the post
            here
          </p>
        )}
      </Suspense>
    </>
  );
};

export default PrivateGroupIdPage;
