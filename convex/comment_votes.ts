import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getByCommentId = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("comment_vote")
      .withIndex("by_comment", (q) => q.eq("commentId", args.commentId))
      // .filter((q) => q.eq(q.field("commentId"), args.commentId))
      .collect();
    //   const posts = await ctx.db
    //     .query("posts")
    //     .filter((q) => q.eq(q.field("groupId"), args.groupId))
    //     .order("desc")
    //     .collect();

    //   if (!posts) {
    //     throw new Error("Not found");
    //   }

    return {
      votes,
    };
  },
});

export const upvote = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
    postId: v.string(),
    commentId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("comment_vote")
      .withIndex("by_comment", (q) =>
        q.eq("commentId", args.commentId as Id<"comments">),
      )
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("userId"), args.userId))

      .collect();

    if (existingVote.length > 0 && existingVote[0].voteType === "UP") {
      await ctx.db.delete(existingVote[0]._id);
      return;
    }
    if (existingVote.length > 0 && existingVote[0].voteType === "DOWN") {
      await ctx.db.patch(existingVote[0]._id, { voteType: "UP" });
      return;
    }
    const vote = await ctx.db.insert("comment_vote", {
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      postId: args.postId as Id<"posts">,
      commentId: args.commentId as Id<"comments">,
      voteType: "UP",
    });

    return vote;
  },
});

export const downVote = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
    postId: v.string(),
    commentId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("comment_vote")
      .withIndex("by_comment", (q) =>
        q.eq("commentId", args.commentId as Id<"comments">),
      )
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("userId"), args.userId))

      .collect();

    if (existingVote.length > 0 && existingVote[0].voteType === "DOWN") {
      await ctx.db.delete(existingVote[0]._id);
      return;
    }
    if (existingVote.length > 0 && existingVote[0].voteType === "UP") {
      await ctx.db.patch(existingVote[0]._id, { voteType: "DOWN" });
      return;
    }
    const vote = await ctx.db.insert("comment_vote", {
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      postId: args.postId as Id<"posts">,
      commentId: args.commentId as Id<"comments">,
      voteType: "DOWN",
    });

    return vote;
  },
});
