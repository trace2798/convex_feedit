import { v } from "convex/values";
import { query } from "./_generated/server";

export const getMemberByGroupId = query({
  args: { groupId: v.id("group") },
  handler: async (ctx, args) => {
    //   const group = await ctx.db
    //     .query("group")
    //     .filter((q) => q.eq(q.field("_id"), args.groupId))
    //     .collect();
    const members = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .order("desc")
      .collect();

    if (!members) {
      throw new Error("Not found");
    }

    return {
      members: members,
    };
  },
});
