import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getById = query({
  args: { groupId: v.id("group") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
    const group = await ctx.db.get(args.groupId);

    if (!group) {
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

    return group;
  },
});

export const getSearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const userId = identity.subject;
    const name = args.search as string;
    const groups = await ctx.db
      .query("group")
      .withSearchIndex("search_name", (q) => q.search("name", name))
      .collect();

    return groups;
  },
});

export const get = query({
  
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity();

    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    // const userId = identity.subject;
   
    const groups = await ctx.db
      .query("group")
     
      .collect();

    return groups;
  },
});


export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    const group = await ctx.db.insert("group", {
      name: args.name,
      userId: args.userId as Id<"users">,
    });

    return group;
  },
});
