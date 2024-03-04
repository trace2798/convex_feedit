"use client";
import { FC } from "react";
import MemberSelectForm from "./_components/member-select-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";

interface GroupIdSettingsPageProps {}

const GroupIdSettingsPage: FC<GroupIdSettingsPageProps> = ({}) => {
  const allUser = useQuery(api.users.getAllUsers);
  console.log(allUser);
  const path = usePathname();
  console.log(path);
  // Split the path into an array of substrings
  const pathParts = path.split("/");

  // Find the index of 'g' and add 1 to get the value after 'g/'
  const groupId = pathParts[pathParts.indexOf("g") + 1];

  console.log(groupId); // This will log the value between 'g/' and '/settings'

  return (
    <>
      <div>page</div>
      <div>Add Member</div>
      <MemberSelectForm groupId={groupId} users={allUser} />
    </>
  );
};

export default GroupIdSettingsPage;
