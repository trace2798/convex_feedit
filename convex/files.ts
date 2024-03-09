import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .collect();
    if (user.length === 0) {
      throw new Error("User not found");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const createFile = mutation({
  args: {
    caption: v.optional(v.string()),
    fileId: v.id("_storage"),
    groupId: v.id("group"),
    userId: v.id("users"),
    type: v.literal("image"),
    postId: v.optional(v.id("posts")),
  },
  async handler(ctx, args) {
    // const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    // if (!hasAccess) {
    //   throw new ConvexError("you do not have access to this org");
    // }

    await ctx.db.insert("files", {
      caption: args.caption,
      groupId: args.groupId,
      fileId: args.fileId,
      postId: args.postId,
      type: args.type,
      userId: args.userId,
    });
  },
});
