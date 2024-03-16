import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const bookmark = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
    postId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingBookmark = await ctx.db
      .query("bookmarked_posts")
      .withIndex("by_user_post", (q) =>
        q
          .eq("userId", args.userId as Id<"users">)
          .eq("postId", args.postId as Id<"posts">)
      )
      .unique();
    console.log("existingVote", existingBookmark);
    if (existingBookmark) {
      await ctx.db.delete(existingBookmark._id);
      return;
    }
    const bookmark = await ctx.db.insert("bookmarked_posts", {
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      postId: args.postId as Id<"posts">,
    });

    return bookmark;
  },
});

export const getByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const bookmarks = await ctx.db
      .query("bookmarked_posts")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
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
      bookmarks,
    };
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bookmarks = await ctx.db
      .query("bookmarked_posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const bookmarksWithGroupDetails = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);
        const group = await ctx.db.get(bookmark.groupId);
        return { ...bookmarks, post, group };
      })
    );
    //   const posts = await ctx.db
    //     .query("posts")
    //     .filter((q) => q.eq(q.field("groupId"), args.groupId))
    //     .order("desc")
    //     .collect();

    //   if (!posts) {
    //     throw new Error("Not found");
    //   }

    return {
      bookmarks: bookmarksWithGroupDetails,
    };
  },
});
