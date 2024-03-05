"use client";
import { FC } from "react";
import MemberSelectForm from "./_components/member-select-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect, usePathname } from "next/navigation";
import { MemberTable } from "./_components/client";
import { Id } from "@/convex/_generated/dataModel";
import { useSession } from "next-auth/react";

interface GroupIdSettingsPageProps {}

const GroupIdSettingsPage: FC<GroupIdSettingsPageProps> = ({}) => {
  const { data, status } = useSession();
  const path = usePathname();
  const pathParts = path.split("/");
  const groupId = pathParts[pathParts.indexOf("g") + 1];
  const allUser = useQuery(api.users.getAllUsers);
  const members = useQuery(api.group_members.getMemberByGroupId, {
    groupId: groupId as Id<"group">,
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!data) {
    redirect("/");
    return null;
  }

  console.log("ALL USERS", allUser);
  console.log(groupId); // This will log the value between 'g/' and '/settings'
  console.log("MEMBER USER INFO", members?.membersWithUserInfo);
  return (
    <>
      <MemberSelectForm groupId={groupId} users={allUser} />
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
