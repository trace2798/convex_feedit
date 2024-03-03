import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    title: v.string(),
    groupId: v.string(),
    content: v.optional(v.string()),
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
      isPublic: true,
      isPublished: false,
      publishedAt: null,
      tags: [],
      updatedAt: new Date().getTime(),
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      content: args.content,
      username: args.username,
    });

    return post;
  },
});

export const getById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
    const post = await ctx.db.get(args.postId as Id<"posts">);

    if (!post) {
      throw new Error("Not found");
    }

    const group = await ctx.db
      .query("group")
      .filter((q) => q.eq(q.field("_id"), post.groupId))
      .collect();

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), post.userId))

      .collect();
    return {
      post: post,
      group: group,
      user: user,
    };
  },
});

export const getByGroupId = query({
  args: { groupId: v.id("group") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .order("desc")
      .collect();

    if (!posts) {
      throw new Error("Not found");
    }

    //   if (snippet.isPublished && !snippet.isArchived) {
    //     return snippet;
    //   }

    //   if (snippet.isPublic) {
    //     return snippet;
    //   }

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    //   if (snippet.isPublic) {
    //     return snippet;
    //   }

    //   const userId = identity.subject;

    //   if (snippet.userId !== userId) {
    //     throw new Error("Unauthorized");
    //   }

    // const presence = await ctx.db
    //   .query("presence")
    //   .withIndex("by_user", (q) => q.eq("userId", userId))
    //   .unique();
    // // console.log(presence);
    // if (presence) {
    //   await ctx.db.patch(presence._id, {
    //     lastActive: Date.now(),
    //     location: snippet._id,
    //   });
    // }
    // await ctx.runMutation(internal.snippet.incrementCount, {
    //   id: args.snippetId as Id<"snippets">,
    // });

    return posts;
  },
});
