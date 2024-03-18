"use client";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { usePaginatedQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ElementRef, FC, Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatMessages from "./_components/messages";
interface ConversationIdPageProps {
  params: {
    conversationId: string;
  };
}

const ConversationIdPage: FC<ConversationIdPageProps> = ({ params }) => {
  const { data: userData } = useSession();
  if (!userData) {
    redirect("/");
  }
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate, pending } = useApiMutation(api.messages.sendMessage);

  const sendMessage = () => {
    setLoading(true);
    mutate({
      userId: userData?.user.id,
      content: message,
      conversationId: params.conversationId as Id<"conversation">,
    })
      .then((id) => {
        toast.success("Message Sent");
        setMessage("");
        // router.push(`/g/${id}`);
        // convoLastSeen({
        //   conversationId: params.conversationId as Id<"conversation">,
        // })
        //   .then(() => {
        //     toast.success("Conversation Last Seen Updated");
        //   })
        //   .catch(() => toast.error("Failed to update conversation Last seen"));
      })
      .catch(() => toast.error("Failed to sent message"));
    setLoading(false);
  };

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getByConversationId,
    { conversationId: params.conversationId as Id<"conversation"> },
    { initialNumItems: 15 },
  );

  useEffect(() => {
    if (scrollRef.current && results.length < 10) {
      // if (scrollRef.current && results.length < 10) {
      setTimeout(() => {
        (scrollRef.current as ElementRef<"div">).scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // Adjust delay as needed
    }
    const handleScroll = () => {
      const page = document.documentElement;
      const closeToTop = page.scrollTop < 100;
      if (closeToTop && status === "CanLoadMore" && page.scrollTop > 200) {
        loadMore(20);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [status, loadMore]);

  return (
    <>
      <Suspense fallback={<Spinner size={"lg"} />}>
        <div className="flex flex-col w-full">
          <ScrollArea
            className={cn(
              "border-none h-[70vh] overflow-y-auto px-5 bg-text-muted w-full transition flex text-sm flex-col rounded-2xl ",
            )}
          >
            <div className="text-center text-sm hover:cursor-pointer text-muted-foreground">
              {status === "CanLoadMore" && (
                <div onClick={() => loadMore(20)}>Load More</div>
              )}
            </div>
            {results === undefined || results === null ? (
              <div className="w-full h-24 flex text-center justify-center items-center">
                <h1>Oops. Looks like you have not started chatting.</h1>
              </div>
            ) : (
              results
                .slice(0)
                .reverse()
                .map((message, index) => (
                  <ChatMessages
                    conversationId={params.conversationId}
                    currentUserId={userData?.user.id as Id<"users">}
                    message={message}
                    isOwnMessage={message.userId === userData.user.id}
                    key={index}
                  />
                ))
            )}

            <div ref={scrollRef} />
          </ScrollArea>

          <Input
            type="text"
            disabled={loading || pending}
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
