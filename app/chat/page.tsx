"use client";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, Suspense } from "react";

interface ChatPageProps {}

const ChatPage: FC<ChatPageProps> = ({}) => {
  const { data } = useSession();

  const conversations = useQuery(api.conversation.getConversationByUserId, {
    userId: data?.user.id as Id<"users">,
  });
  console.log(conversations, "CONVERSATIONS");
  const sortedConversations = conversations?.sort(
    (a, b) => b.lastMessageSentAt - a.lastMessageSentAt
  );
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <h1 className="text-xl font-bold mb-5">Conversations</h1>
        <div className="flex w-full">
          <div className="w-full lg:w-1/4">
            {sortedConversations?.map((conversation) => (
              <Link
                href={`/chat/${conversation._id}`}
                key={conversation._id}
                className="space-y-3"
              >
                <Card className="mb-3">
                  <CardHeader>
                    <CardTitle className="text-lg font-light">
                      u/{conversation.user?.username}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="hidden lg:block lg:w-3/4">messages</div>
        </div>
      </Suspense>
    </>
  );
};

export default ChatPage;
