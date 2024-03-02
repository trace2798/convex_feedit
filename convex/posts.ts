import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    groupId: v.string(),
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
    const post = await ctx.db.insert("posts", {
      title: args.title,
      isArchived: false,
      isPublic: false,
      isPublished: false,
      publishedAt: null,
      tags: [],
      updatedAt: new Date().getTime(),
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
    });

    return post;
  },
});
