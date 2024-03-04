"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { columns, BillboardColumn } from "./columns";
import { useMemberModal } from "@/hooks/use-member-modal";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  //   console.log(params)
  const id = params.organizationId;
  console.log(id);
  const router = useRouter();
  const memberModal = useMemberModal();
  console.log("DATA CLIENT", data);
  // const flattenedData = data.reduce((acc, curr) => [...acc, ...curr], []);
  const flattenedData = [...data];
  console.log("FLAT DATA ==>", flattenedData);
  return (
    <>
      <Heading
        title={`Members (${data.length})`}
        description="Manage member for your organization"
      />
      <Separator className="my-5" />
      <DataTable searchKey="email" columns={columns} data={flattenedData} />
      <Separator />
    </>
  );
};
