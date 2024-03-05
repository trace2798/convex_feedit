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
  if (!data) return null;
  const conversations = useQuery(api.conversation.getConversationByUserId, {
    userId: data?.user.id as Id<"users">,
  });
  console.log(conversations, "CONVERSATIONS");
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <h1 className="text-xl font-bold mb-5">Conversations</h1>
        <div className="flex w-full">
          <div className="w-1/4">
            {conversations?.conversationWithUser1.map((conversation) => (
              <Link
                href={`/chat/${conversation._id}`}
                key={conversation._id}
                className="space-y-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">
                      u/{conversation.user?.username}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            {conversations?.conversationWithUser2.map((conversation) => (
              <Link
                href={`/chat/${conversation._id}`}
                key={conversation._id}
                className="space-y-3"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-light">
                      u/{conversation.user?.username}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <div className="w-3/4">messages</div>
        </div>
      </Suspense>
    </>
  );
};

export default ChatPage;
