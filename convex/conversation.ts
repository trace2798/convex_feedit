import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    user1Id: v.string(),
    user2Id: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    const existingConversation = await ctx.db
      .query("conversation")
      .withIndex("by_both_user", (q) =>
        q
          .eq("user1Id", args.user1Id as Id<"users">)
          .eq("user2Id", args.user2Id as Id<"users">)
      )
      .collect();

      const existingConversation2 = await ctx.db
      .query("conversation")
      .withIndex("by_both_user", (q) =>
        q
          .eq("user1Id", args.user2Id as Id<"users">)
          .eq("user2Id", args.user1Id as Id<"users">)
      )
      .collect();

    if (existingConversation.length > 0) {
      return existingConversation[0]._id;
    }
    if (existingConversation2.length > 0) {
      return existingConversation2[0]._id;
    }
    const conversation = await ctx.db.insert("conversation", {
      user1Id: args.user1Id as Id<"users">,
      user2Id: args.user2Id as Id<"users">,
    });

    console.log("conversation conversation", conversation);
    return conversation;
  },
});

export const getConversationByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversationAsUser1 = await ctx.db
      .query("conversation")
      .withIndex("by_user1Id", (q) =>
        q.eq("user1Id", args.userId as Id<"users">)
      )
      .collect();

    const conversationAsUser2 = await ctx.db
      .query("conversation")
      .withIndex("by_user2Id", (q) =>
        q.eq("user2Id", args.userId as Id<"users">)
      )
      .collect();

    const conversationWithUser1 = await Promise.all(
      conversationAsUser1.map(async (conversation) => {
        const user = await ctx.db.get(conversation.user2Id as Id<"users">);
        return {
          ...conversation,
          user: user,
        };
      })
    );

    const conversationWithUser2 = await Promise.all(
      conversationAsUser2.map(async (conversation) => {
        const user = await ctx.db.get(conversation.user1Id as Id<"users">);
        return {
          ...conversation,
          user: user,
        };
      })
    );

    return {
      conversationWithUser1,
      conversationWithUser2,
    };
  },
});

