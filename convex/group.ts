import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getById = query({
  args: { groupId: v.id("group") },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);

    if (!group) {
      throw new Error("Not found");
    }
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
  args: {
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const name = args.search as string;

    if (name) {
      const searchGroups = await ctx.db
        .query("group")
        .withSearchIndex("search_name", (q) => q.search("name", name))
        .paginate(args.paginationOpts);

      return searchGroups;
    }

    const groups = await ctx.db.query("group").paginate(args.paginationOpts);
    return groups;
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as Id<"users">);
    if (!user) {
      throw new Error("Unauthorized. User not found");
    }
    // console.log("user", user);
    const existingGroup = await ctx.db
      .query("group")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
    if (existingGroup) {
      throw new Error("Group with that name already exist");
    }
    const group = await ctx.db.insert("group", {
      name: args.name,
      ownerId: args.userId as Id<"users">,
      isPublic: args.isPublic,
      numberOfPost: 0,
    });
    await ctx.db.insert("group_members", {
      userId: args.userId as Id<"users">,
      groupId: group as Id<"group">,
      memberRole: "Owner",
    });
    // console.log("group group", group);
    return group;
  },
});
