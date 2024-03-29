import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
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

    const group = await ctx.db.get(args.groupId as Id<"group">);

    const updatedNumberOfPost = (group?.numberOfPost || 0) + 1;

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
        q.eq("isPublic", true).eq("isArchived", false),
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

    return post;
  },
});

export const getGeneralFeed = query({
  args: { isPublic: v.boolean(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_public_onPublicGroup", (q) =>
        q.eq("onPublicGroup", true).eq("isPublic", true),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .paginate(args.paginationOpts);

    const postsWithGroupAndUserDetails = await Promise.all(
      posts.page.map(async (post) => {
        const group = await ctx.db.get(post.groupId);
        const user = await ctx.db.get(post.userId); // fetch user details
        return { ...post, group, user }; // include user details in the post
      }),
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
    let allPosts = [];

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
          const user = await ctx.db.get(post.userId);
          return { ...post, group, user };
        }),
      );

      allPosts.push(...postsWithGroupAndUserDetails);
    }

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
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
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
    const bookmarks = await ctx.db
      .query("bookmarked_posts")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    if (bookmarks.length > 0) {
      bookmarks.forEach(async (bookmark) => {
        await ctx.db.delete(bookmark._id);
      });
    }
    const images = await ctx.db
      .query("files")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    if (images.length > 0) {
      images.forEach(async (image) => {
        await ctx.db.delete(image._id);
        await ctx.storage.delete(image.fileId);
      });
    }
    // Finally, delete the post
    const group = await ctx.db.get(args.groupId);
    await ctx.db.patch(args.groupId, {
      numberOfPost: (group?.numberOfPost || 0) - 1,
    });
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

    const postsWithGroupAndUserDetails = await Promise.all(
      posts.page.map(async (post) => {
        const group = await ctx.db.get(post.groupId);
        const user = await ctx.db.get(post.userId);
        return { ...post, group, user };
      }),
    );
    return {
      page: postsWithGroupAndUserDetails,
      isDone: posts.isDone,
      continueCursor: posts.continueCursor,
    };
  },
});

export const updateAIcontent = internalMutation({
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

export const getSearch = query({
  args: {
    search: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const title = args.search as string;

    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) =>
        q.search("title", title).eq("isPublic", true).eq("isArchived", false),
      )
      .paginate(args.paginationOpts);

    return posts;
  },
});

export const publishPost = mutation({
  args: {
    userId: v.string(),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db.get(args.userId as Id<"users">);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const existingPost = await ctx.db.get(args.postId as Id<"posts">);

    if (!existingPost) {
      throw new Error("Post not found");
    }
    if (existingPost.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    if (existingPost.isPublic) {
      const change = await ctx.db.patch(args.postId as Id<"posts">, {
        isPublic: false,
      });
      return change;
    }
    const publishPost = await ctx.db.patch(args.postId as Id<"posts">, {
      isPublic: true,
      publishedAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    return publishPost;
  },
});
