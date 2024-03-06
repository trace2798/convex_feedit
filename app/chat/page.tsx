"use client";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, Suspense } from "react";

interface ChatPageProps {}

const ChatPage: FC<ChatPageProps> = ({}) => {
  const { data } = useSession();
  console.log(data, "DATA");

  const conversations = useQuery(api.conversation.getConversationByUserId, {
    userId: data?.user.id as Id<"users">,
  });
  console.log(conversations, "CONVERSATIONS");
  const sortedConversations = conversations?.sort(
    (a, b) => b.lastMessageSentAt - a.lastMessageSentAt
  );

  if (!data) {
    return (
      <div className="flex w-full">
        <div className="w-full lg:w-1/4">
          <h1 className="text-xl font-bold mb-5">Conversations</h1>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
        <div className="hidden lg:flex lg:w-3/4 lg:ml-5 justify-center items-center">
          {" "}
          <Skeleton className="h-44 w-[50%]" />
        </div>
      </div>
    );
  }
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <div className="flex w-full">
          <div className="w-full lg:w-1/4">
            <h1 className="text-xl font-bold mb-5">Conversations</h1>

            {sortedConversations?.map((conversation) => (
              <Link
                href={`/chat/${conversation._id}`}
                key={conversation._id}
                className="space-y-3"
              >
                <Card className="border-transparent hover:border-indigo-400 hover:text-red-400 ">
                  <CardHeader>
                    <CardTitle className="text-lg font-light">
                      u/{conversation.user?.username}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:w-3/4 lg:ml-5 justify-center items-center">
            {" "}
            <div className="max-w-lg">
              <img
                src="/message.png"
                alt="chat"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default ChatPage;
