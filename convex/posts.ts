import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    groupId: v.string(),
    content: v.optional(v.string()),
    onPublicGroup: v.optional(v.boolean()),
    fileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.get(args.userId as Id<"users">);

    console.log("USERINFO", existingUser);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const post = await ctx.db.insert("posts", {
      title: args.title,
      isArchived: false,
      isPublic: true,
      publishedAt: new Date().getTime(),
      tags: [],
      updatedAt: new Date().getTime(),
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      content: args.content,
      username: existingUser?.username as string,
      onPublicGroup: args.onPublicGroup,
      fileId: args.fileId,
    });
    // Fetch the current group
    const group = await ctx.db.get(args.groupId as Id<"group">);
    console.log("group", group);
    // Increment the numberOfPost count
    const updatedNumberOfPost = (group?.numberOfPost || 0) + 1;
    console.log("updatedNumberOfPost", updatedNumberOfPost);
    // Update the group with the new count
    await ctx.db.patch(args.groupId as Id<"group">, {
      numberOfPost: updatedNumberOfPost,
    });
    return post;
  },
});

export const createAsDraft = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    groupId: v.string(),
    content: v.optional(v.string()),
    onPublicGroup: v.optional(v.boolean()),
    fileId: v.optional(v.id("_storage")),
    publishedAt: v.optional(v.union(v.null(), v.number())),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.get(args.userId as Id<"users">);

    console.log("USERINFO", existingUser);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const post = await ctx.db.insert("posts", {
      title: "untitled",
      isArchived: false,
      isPublic: false,
      publishedAt: args.publishedAt as number,
      tags: [],
      updatedAt: new Date().getTime(),
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      content: args.content,
      username: existingUser?.username as string,
      onPublicGroup: args.onPublicGroup,
      fileId: args.fileId,
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
    console.log("POST inside getByID", post);
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
  args: { groupId: v.id("group"), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const group = await ctx.db
      .query("group")
      .filter((q) => q.eq(q.field("_id"), args.groupId))
      .collect();
    if (!group[0].isPublic && !args.userId) {
      return {
        posts: [],
        group: group,
      };
    }
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_public_feed", (q) =>
        q.eq("isPublic", true).eq("isArchived", false)
      )
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
    isPublic: v.optional(v.boolean()),
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
      updatedAt: new Date().getTime(),
    });

    if (args.isPublic === true) {
      const group = await ctx.db.get(existingPost.groupId as Id<"group">);
      // Increment the numberOfPost count
      const updatedNumberOfPost = (group?.numberOfPost || 0) + 1;
      console.log("updatedNumberOfPost", updatedNumberOfPost);
      // Update the group with the new count
      await ctx.db.patch(existingPost.groupId as Id<"group">, {
        numberOfPost: updatedNumberOfPost,
      });
    }

    return post;
  },
});

export const publish = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    content: v.optional(v.string()),
    userId: v.id("users"),
    isPublic: v.optional(v.boolean()),
    publishedAt: v.number(),
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
      updatedAt: new Date().getTime(),
    });

    if (args.isPublic === true) {
      const group = await ctx.db.get(existingPost.groupId as Id<"group">);
      // Increment the numberOfPost count
      const updatedNumberOfPost = (group?.numberOfPost || 0) + 1;
      console.log("updatedNumberOfPost", updatedNumberOfPost);
      // Update the group with the new count
      await ctx.db.patch(existingPost.groupId as Id<"group">, {
        numberOfPost: updatedNumberOfPost,
      });
    }

    return post;
  },
});

export const getGeneralFeed = query({
  args: { isPublic: v.boolean(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_public_onPublicGroup", (q) =>
        q.eq("onPublicGroup", true).eq("isPublic", true)
      )
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
    console.log(
      "posts with group GENERAL FEED SERVER ==>",
      postsWithGroupAndUserDetails
    );
    return {
      page: postsWithGroupAndUserDetails,
      isDone: posts.isDone,
      continueCursor: posts.continueCursor,
    };
  },
});

export const getPersonalizedFeed = query({
  args: {
    // paginationOpts: paginationOptsValidator,
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userGroups = await ctx.db
      .query("group_members")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    console.log("GROUPS USER", userGroups);
    let allPosts = [];

    // Loop over the user's groups and fetch the posts
    for (let group of userGroups) {
      const groupPosts = await ctx.db
        .query("posts")
        .withIndex("by_group", (q) => q.eq("groupId", group.groupId))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .order("desc")
        .collect();
      const postsWithGroupAndUserDetails = await Promise.all(
        groupPosts.map(async (post) => {
          const group = await ctx.db.get(post.groupId);
          const user = await ctx.db.get(post.userId); // fetch user details
          return { ...post, group, user }; // include user details in the post
        })
      );

      allPosts.push(...postsWithGroupAndUserDetails);
    }

    // Return the posts
    return allPosts;
  },
});

export const deletePost = mutation({
  args: {
    userId: v.string(),
    postId: v.id("posts"),
    groupId: v.id("group"),
  },
  handler: async (ctx, args) => {
    // Delete comments associated with the post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    if (comments.length > 0) {
      comments.forEach(async (comment) => {
        await ctx.db.delete(comment._id);
      });
    }

    // Delete votes associated with the post
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    if (votes.length > 0) {
      votes.forEach(async (vote) => {
        await ctx.db.delete(vote._id);
      });
    }

    const comment_votes = await ctx.db
      .query("comment_vote")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    if (comment_votes.length > 0) {
      comment_votes.forEach(async (comment_vote) => {
        await ctx.db.delete(comment_vote._id);
      });
    }
    // Finally, delete the post
    await ctx.db.delete(args.postId);
  },
});

export const getDraftByUserId = query({
  args: { userId: v.id("users"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isPublic"), false))
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
    console.log(
      "posts with group GENERAL FEED SERVER ==>",
      postsWithGroupAndUserDetails
    );
    return {
      page: postsWithGroupAndUserDetails,
      isDone: posts.isDone,
      continueCursor: posts.continueCursor,
    };
  },
});

export const updateAIcontent = mutation({
  args: {
    id: v.id("posts"),
    aiGeneratedBrief: v.string(),
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
      updatedAt: new Date().getTime(),
      aiGeneratedBrief: args.aiGeneratedBrief,
    });

    return post;
  },
});
