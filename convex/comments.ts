import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.string(),
    postId: v.string(),
    groupId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }
    // // console.log(identity, "IDENTITY");
    // const userId = identity.subject;
    // // console.log(userId, "USER ID");
    // const userName = identity.name || "Anonymous";
    const post = await ctx.db.insert("comments", {
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      content: args.content,
      postId: args.postId as Id<"posts">,
    });

    return post;
  },
});
