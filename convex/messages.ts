import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const sendMessage = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    conversationId: v.id("conversation"),
  },
  handler: async (ctx, args) => {
    //   const identity = await ctx.auth.getUserIdentity();

    //   if (!identity) {
    //     throw new Error("Not authenticated");
    //   }

    //   const userId = identity.subject;

    const chat = await ctx.db.insert("messages", {
      userId: args.userId,
      content: args.content,
      conversationId: args.conversationId,
    });

    // const updateStatus = await ctx.db.patch("presence",{

    // })

    return chat;
  },
});

export const getByConversationId = query({
  args: { conversationId: v.id("conversation") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId as Id<"conversation">)
      )
      .collect();

    return {
      messages,
    };
  },
});
