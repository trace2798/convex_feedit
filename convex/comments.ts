import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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

export const getByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
    const post = await ctx.db.get(args.postId as Id<"posts">);

    if (!post) {
      throw new Error("Not found");
    }
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
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

    return {
      comments: commentsWithUser,
    };
  },
});
