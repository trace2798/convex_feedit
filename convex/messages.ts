import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const sendMessage = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    conversationId: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.insert("messages", {
      userId: args.userId,
      content: args.content,
      conversationId: args.conversationId,
      isArchived: false,
      lastMessageSentAt: Date.now(),
    });
    await ctx.db.patch(args.conversationId, { lastMessageSentAt: Date.now() })
    return chat;
  },
});

export const getByConversationId = query({
  args: {
    conversationId: v.id("conversation"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId as Id<"conversation">)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return messages;
  },
});

export const deleteMessage = mutation({
  args: {
    userId: v.id("users"),
    messageId: v.id("messages"),
    conversationId: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    const existingMessage = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId as Id<"conversation">)
      )
      .filter((q) => q.eq(q.field("_id"), args.messageId))
      .collect();
    if (
      existingMessage.length > 0 &&
      existingMessage[0]._id !== args.messageId
    ) {
      throw new Error("Message not found");
    }
    if (existingMessage[0].userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.messageId);
  },
});
