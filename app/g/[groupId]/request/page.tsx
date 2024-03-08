"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
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
  console.log("DATA", data);
  const request = useQuery(api.group_join_request.getByGroupId, {
    groupId: params.groupId as Id<"group">,
    userId: data?.user.id as Id<"users">,
  });

  const { mutate, pending } = useApiMutation(
    api.group_join_request.approveJoinRequest
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
      // .catch(() => toast.error("Oops! Something went wrong."));
      .catch((e) => console.log(e));
  };

  const handleRejectRequest = () => {};

  // if(!data){
  //   redirect(`/g/${params.groupId}`)
  // }
  return (
    <>
      {request?.map((request, index) => (
        <Card key={index}>
          <p>{request.userId}</p>
          <p>{request.groupId}</p>
          <p>{request.requestOutcome}</p>
          <CardFooter className="mt-5 flex justify-between">
            <Button onClick={() => handleApproveRequest(request._id)}>
              Approve
            </Button>
            <Button onClick={handleRejectRequest}>Reject</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default RequestPage;
