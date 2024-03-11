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
    postId: v.id("posts"),
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

export const getByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("files")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    // Create a new array to hold the images with their URLs
    const imagesWithUrls = [];

    // Iterate over each image and add the URL to its info
    for (let image of images) {
      const url = await ctx.storage.getUrl(image.fileId);
      imagesWithUrls.push({ ...image, url });
    }

    return imagesWithUrls;
  },
});

export const deleteById = mutation({
  args: {
    postId: v.id("posts"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db
      .query("files")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .collect();
    await ctx.db.delete(image[0]._id);
    await ctx.storage.delete(args.fileId);
  },
});
