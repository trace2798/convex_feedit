import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
