"use client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ElementRef, FC, Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatMessages from "./_components/messages";
import { Spinner } from "@/components/spinner";

interface ConversationIdPageProps {
  params: {
    conversationId: string;
  };
}

const ConversationIdPage: FC<ConversationIdPageProps> = ({ params }) => {
  const { data } = useSession();
  if (!data) {
    redirect("/");
  }
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { mutate, pending } = useApiMutation(api.messages.sendMessage);
  const { mutate: convoLastSeen, pending: convoPending } = useApiMutation(
    api.conversation.updateLastSeen
  );
  const sendMessage = () => {
    mutate({
      userId: data?.user.id,
      content: message,
      conversationId: params.conversationId as Id<"conversation">,
    })
      .then((id) => {
        toast.success("Message Sent");
        setMessage("");
        // router.push(`/g/${id}`);
        convoLastSeen({
          conversationId: params.conversationId as Id<"conversation">,
        })
          .then(() => {
            toast.success("Conversation Last Seen Updated");
          })
          .catch(() => toast.error("Failed to update conversation Last seen"));
      })
      .catch(() => toast.error("Failed to sent message"));
  };
  const messages = useQuery(api.messages.getByConversationId, {
    conversationId: params.conversationId as Id<"conversation">,
  });
  console.log("MESSAGES", messages);
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        (scrollRef.current as ElementRef<"div">).scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // Adjust delay as needed
    }
  }, [messages]);
  return (
    <>
      <Suspense fallback={<Spinner size={"lg"} />}>
        <div className="flex flex-col w-full">
          <ScrollArea
            className={cn(
              "border-none max-h-[70vh] overflow-y-auto px-5 bg-text-muted w-full transition flex text-sm flex-col rounded-2xl"
            )}
          >
            {messages === undefined || messages === null ? (
              <div className="w-full h-24 flex text-center justify-center items-center">
                <h1>Oops. Looks like you have not started chatting.</h1>
              </div>
            ) : (
              messages.messages.map((message, index) => (
                <ChatMessages
                  conversationId={params.conversationId}
                  currentUserId={data?.user.id as Id<"users">}
                  message={message}
                  isOwnMessage={message.userId === data.user.id}
                  key={index}
                />
              ))
            )}

            <div ref={scrollRef} />
          </ScrollArea>
          <Input
            type="text"
            disabled={loading}
            className="mt-5"
            placeholder="Send a Message to get started"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
        </div>
      </Suspense>
    </>
  );
};

export default ConversationIdPage;
