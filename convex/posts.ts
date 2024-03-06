import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

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
    const group = await ctx.db
      .query("group")
      .filter((q) => q.eq(q.field("_id"), args.groupId))
      .collect();
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("groupId"), args.groupId))
      .order("desc")
      .collect();

    if (!posts) {
      throw new Error("Not found");
    }

    return {
      posts: posts,
      group: group,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    content: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    const existingPost = await ctx.db.get(args.id);

    if (!existingPost) {
      throw new Error("Not found");
    }

    if (existingPost.userId !== args.userId) {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.patch(args.id, {
      ...rest,
    });

    return post;
  },
});

// export const getGeneralFeed = query({
//   args: { isPublic: v.boolean(), paginationOpts: paginationOptsValidator },
//   handler: async (ctx, args) => {
//     const posts = await ctx.db
//       .query("posts")
//       .withIndex("by_public", (q) => q.eq("isPublic", args.isPublic))
//       .filter((q) => q.eq(q.field("isArchived"), false))
//       .order("desc")
//       .paginate(args.paginationOpts);
//     console.log("posts GENERAL FEED SERVER ==>", posts);
//     const postsWithGroupAndUserDetails = await Promise.all(
//       posts.page.map(async (post) => {
//         const group = await ctx.db.get(post.groupId);
//         const user = await ctx.db.get(post.userId); // fetch user details
//         return { ...post, group, user }; // include user details in the post
//       })
//     );
//     console.log("posts with group GENERAL FEED SERVER ==>", postsWithGroupAndUserDetails);
//     return { posts: postsWithGroupAndUserDetails };
//   },
// });

export const getGeneralFeed = query({
  args: { isPublic: v.boolean(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_public", (q) => q.eq("isPublic", args.isPublic))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .paginate(args.paginationOpts);
    console.log("posts GENERAL FEED SERVER ==>", posts);
    const postsWithGroupAndUserDetails = await Promise.all(
      posts.page.map(async (post) => {
        const group = await ctx.db.get(post.groupId);
        const user = await ctx.db.get(post.userId); // fetch user details
        return { ...post, group, user }; // include user details in the post
      })
    );
    console.log("posts with group GENERAL FEED SERVER ==>", postsWithGroupAndUserDetails);
    return { 
      page: postsWithGroupAndUserDetails, 
      isDone: posts.isDone, 
      continueCursor: posts.continueCursor 
    };
  },
});

