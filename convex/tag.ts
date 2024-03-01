import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    //     if (!identity) {
    //       throw new Error("Unauthorized");
    //     }
    // // console.log("IDENTITY",identity)
    const user = await ctx.db.get(args.userId as Id<"users">);
    // console.log(user);

    if (!user) {
      throw new Error("Unauthorized. User Id is required.");
    }

    const tag = await ctx.db.insert("tags", {
      name: args.name,
      userId: args.userId as Id<"users">,
    });

    return tag;
  },
});
