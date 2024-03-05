"use client";
import { FC } from "react";
import { Trash } from "lucide-react";
import { format } from "date-fns";

import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";

export type HomeMessage = {
  _id: Id<"messages">;
  _creationTime: number;
  content: string;
  userId: Id<"users">;
  conversationId: Id<"conversation">;
  isArchived: boolean;
};

interface ChatHomeMessagesProps {
  message: HomeMessage;
  isOwnMessage: boolean;
  conversationId: string;
  currentUserId: Id<"users">;
}

const ChatHomeMessages: FC<ChatHomeMessagesProps> = ({
  message,
  isOwnMessage,
  conversationId,
  currentUserId,
}) => {
  const { mutate, pending } = useApiMutation(api.messages.deleteMessage);

  const handleDelete = () => {
    mutate({
      messageId: message._id as Id<"messages">,
      conversationId: conversationId as Id<"conversation">,
      userId: currentUserId as Id<"users">,
    })
      .then((id) => {
        toast.success("Message Deleted");
      })
      .catch(() => toast.error("Failed to delete message"));
  };
  return (
    <>
      <div
        className={`mb-3 mt-5  items-baseline relative ${
          isOwnMessage ? "flex flex-col justify-end" : "flex-row"
        }`}
      >
        <div
          className={`${
            isOwnMessage ? "ml-auto bg-indigo-400" : " bg-slate-800"
          } py-1 px-2 rounded-lg w-[350px]`}
        >
          <p
            className={`${
              isOwnMessage ? "text-muted" : "text-slate-400"
            } font-bold`}
          >
            {isOwnMessage ? "(you)" : ""}
          </p>
          <p className="text-white">
            {message.isArchived
              ? "This message has been deleted."
              : message.content}
          </p>
          <p
            className={`${
              isOwnMessage ? "text-blue-100" : "text-slate-400"
            } font-switzerLight mt-3`}
          >
            {message.isArchived
              ? "Message has been deleted"
              : format(
                  new Date(message._creationTime),
                  "iiii, do MMMM, yyyy p"
                )}
          </p>
        </div>

        {isOwnMessage && (
          <div className="flex flex-col justify-between">
            <Button
              className="cursor-pointer -bottom-7 p-0 text-right right-2 transition"
              onClick={handleDelete}
              aria-label="Trash button to delete Message. Mod of the chat can delete all the messages."
              variant="ghost"
            >
              <Trash className="w-4 h-4 mx-4 hover:text-red-700 text-slate-950 dark:text-neutral-200" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHomeMessages;
