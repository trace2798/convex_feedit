"use client";

import { Heading } from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useMemberModal } from "@/hooks/use-member-modal";
import { useParams } from "next/navigation";
import { MemberColumn, columns } from "./columns";

interface MemberTableProps {
  data: MemberColumn[];
  currentUserId: string;
}

export const MemberTable: React.FC<MemberTableProps> = ({ data }) => {
  const params = useParams();
  const id = params.organizationId;
  console.log(id);
  const memberModal = useMemberModal();
  console.log("DATA CLIENT", data);
  // const flattenedData = [...data];

  return (
    <>
      <Heading
        title={`Members (${data.length})`}
        description="Manage member for your organization"
      />
      <Separator className="my-5" />
      <DataTable searchKey="userInfo" columns={columns} data={data} />
      <Separator />
    </>
  );
};
