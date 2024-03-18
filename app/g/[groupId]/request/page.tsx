"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

interface RequestPageProps {
  params: {
    groupId: string;
  };
}

const RequestPage: FC<RequestPageProps> = ({ params }) => {
  const { data, status } = useSession();
  // console.log("DATA", data);
  const request = useQuery(api.group_join_request.getByGroupId, {
    groupId: params.groupId as Id<"group">,
    // userId: data?.user.id as Id<"users">,
  });

  const { mutate, pending } = useApiMutation(
    api.group_join_request.approveJoinRequest,
  );

  const { mutate: rejectMutation, pending: rejectPending } = useApiMutation(
    api.group_join_request.rejectJoinRequest,
  );

  const handleApproveRequest = (id: string) => {
    mutate({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
      id: id,
    })
      .then(() => {
        toast.success("Successful");
      })
      .catch(() => toast.error("Oops! Something went wrong."));
    // .catch((e) => console.log(e));
  };

  const handleRejectRequest = (id: string) => {
    rejectMutation({
      userId: data?.user.id,
      groupId: params.groupId as Id<"group">,
      id: id,
    })
      .then(() => {
        toast.success("Successfully rejected request");
      })
      .catch(() => toast.error("Oops! Something went wrong."));
    // .catch((e) => console.log(e));
  };

  // const handleRejectRequest = () => {};
  const members = useQuery(api.group_members.getMemberByGroupId, {
    groupId: params.groupId as Id<"group">,
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!data) {
    redirect("/");
  }
  const currentUser = members?.membersWithUserInfo.find(
    (member) => member.userId === data.user.id,
  );
  // console.log("CURRENT USER, currentUser", currentUser);
  if (!currentUser) {
    return (
      <div className="flex justify-center h-[40vh] items-center">
        <Card className="border-none">
          <CardTitle className="text-center">
            You do not have access to this page
          </CardTitle>
        </Card>
      </div>
    );
  }
  // console.log("CURRENT USER ROle", currentUser.memberRole);
  if (
    currentUser.memberRole !== "Owner" &&
    currentUser.memberRole !== "Admin"
  ) {
    return (
      <div className="flex justify-center h-[40vh] items-center">
        <Card className="border-none">
          <CardTitle className="text-center">
            You don&apos;t have the privileges to this page
          </CardTitle>
        </Card>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col">
        <h1 className="my-10">Pending Request</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {request
            ?.filter((req) => req.isArchived === false)
            .map((request, index) => (
              <Card key={index} className="max-w-sm p-4 mb-2">
                <p>
                  <span className="text-muted-foreground">Username:</span> u/
                  <Link target="_blank" href={`/u/${request.user?._id}`}>
                    {request.user?.username}
                  </Link>
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Request sent on:
                  </span>{" "}
                  {format(
                    new Date(request._creationTime),
                    "iiii, do MMMM, yyyy p",
                  )}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Current Outcome:
                  </span>{" "}
                  {request.requestOutcome}
                </p>
                {request.requestOutcome === "Pending" && (
                  <CardFooter className="mt-5 flex justify-evenly">
                    <Button onClick={() => handleApproveRequest(request._id)}>
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(request._id)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
        </div>
        <h1 className="my-10">Archived</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* <br /> */}
          {request
            ?.filter((req) => req.isArchived)
            .map((request, index) => (
              <Card key={index} className="max-w-sm p-4 mb-2">
                <p>
                  <span className="text-muted-foreground">Username:</span> u/
                  <Link target="_blank" href={`/u/${request.user?._id}`}>
                    {request.user?.username}
                  </Link>
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Request sent on:
                  </span>{" "}
                  {format(
                    new Date(request._creationTime),
                    "iiii, do MMMM, yyyy p",
                  )}
                </p>
                <p>
                  <span className="text-muted-foreground">
                    Current Outcome:
                  </span>{" "}
                  {request.requestOutcome}
                </p>
                {request.requestOutcome === "Pending" && (
                  <CardFooter className="mt-5 flex justify-evenly">
                    <Button onClick={() => handleApproveRequest(request._id)}>
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(request._id)}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default RequestPage;
