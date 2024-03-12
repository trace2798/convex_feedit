"use client";
import { useSession } from "next-auth/react";
import { FC } from "react";
import DraftFeed from "../_components/draft-feed";
import { redirect } from "next/navigation";

interface DraftPageProps {}

const DraftPage: FC<DraftPageProps> = ({}) => {
  const { data } = useSession();
  if (!data) {
    redirect("/");
  }

  return (
    <>
      <DraftFeed currentUserId={data?.user.id as string} />
    </>
  );
};

export default DraftPage;
