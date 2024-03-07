"use client";
import { Spinner } from "@/components/spinner";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { FC } from "react";

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
    // userId: data?.user.id as Id<"users">,
  });

  return (
    <>
      {request?.map((request) => (
        <Card key={request.userId}>
          <p>{request.userId}</p>
          <p>{request.groupId}</p>
          <p>{request.requestOutcome}</p>
        </Card>
      ))}
    </>
  );
};

export default RequestPage;
