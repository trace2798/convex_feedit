"use client";

import { Heading } from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { MemberColumn, columns } from "./columns";

interface MemberTableProps {
  data: MemberColumn[];
  currentUserId: string;
}

export const MemberTable: React.FC<MemberTableProps> = ({
  data,
  currentUserId,
}) => {
  const params = useParams();

  return (
    <>
      <Heading
        title={`Members (${data.length})`}
        description="Manage member for your organization"
      />
      <Separator className="my-5" />
      <DataTable
        columns={columns}
        data={data}
        currentUserId={currentUserId as Id<"users">}
      />
      <Separator />
    </>
  );
};
