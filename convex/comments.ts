import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    groupId: v.id("group"),
    content: v.string(),
    // parentComment: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
  
    const comment = await ctx.db.insert("comments", {
      userId: args.userId,
      groupId: args.groupId,
      content: args.content,
      postId: args.postId,
      // parentComment: args.parentComment,
    });

    return comment;
  },
});

export const createReply = mutation({
  args: {
    userId: v.id("users"),
    postId: v.id("posts"),
    groupId: v.id("group"),
    content: v.string(),
    parentComment: v.id("comments"),
  },
  handler: async (ctx, args) => {
   
    const comment = await ctx.db.insert("comments", {
      userId: args.userId,
      groupId: args.groupId,
      content: args.content,
      postId: args.postId,
      parentComment: args.parentComment,
    });

    return comment;
  },
});

export const getCommentsByPost = query({
  args: {
    postId: v.id("posts"),
    parentComment: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId as Id<"posts">);

    if (!post) {
      throw new Error("Not found");
    }
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post_comment", (q) =>
        q.eq("postId", args.postId).eq("parentComment", args.parentComment)
      )
      // .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId as Id<"users">);
        return {
          ...comment,
          user: user,
        };
      })
    );

    return commentsWithUser;
  },
});
