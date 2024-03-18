"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { FC } from "react";
import { MemberTable } from "./_components/client";
import MemberSelectForm from "./_components/member-select-form";

interface GroupIdSettingsPageProps {}

const GroupIdSettingsPage: FC<GroupIdSettingsPageProps> = ({}) => {
  const { data, status } = useSession();
  const path = usePathname();
  const pathParts = path.split("/");
  const groupId = pathParts[pathParts.indexOf("g") + 1];
  const members = useQuery(api.group_members.getMemberByGroupId, {
    groupId: groupId as Id<"group">,
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!data) {
    redirect("/");
  }
  const currentUser = members?.membersWithUserInfo.find(
    (member) => member.userId === data.user.id
  );
 
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
      <MemberSelectForm groupId={groupId} />
      {members && data && members.membersWithUserInfo && (
        <MemberTable
          currentUserId={data.user.id as string}
          data={members.membersWithUserInfo}
        />
      )}
    </>
  );
};

export default GroupIdSettingsPage;
