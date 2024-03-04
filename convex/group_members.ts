import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
    const membersWithUserInfo = await Promise.all(
      members.map(async (member) => {
        const userInfo = await ctx.db.get(member.userId);
        return {
          ...member,
          userInfo,
        };
      })
    );

    return {
      members: members,
      membersWithUserInfo: membersWithUserInfo,
    };
  },
});

export const addMember = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
    memberRoles: v.string(),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();

    const group_member = await ctx.db.insert("group_members", {
      userId: args.userId as Id<"users">,
      groupId: args.groupId as Id<"group">,
      memberRole: args.memberRoles as "Member" | "Mod" | "Admin" | "Owner",
    });

    console.log("group member", group_member);
    return group_member;
  },
});

export const removeMember = mutation({
  args: {
    memberId: v.id("group_members"),
  },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    const member = await ctx.db.get(args.memberId);
    console.log(member);
    if (!member) {
      throw new Error("Not found");
    }
    if (member.memberRole == "Owner") {
      throw new Error("Cannot delete owner");
    }
    await ctx.db.delete(args.memberId);
    // const group = await ctx.db
    //   .query("group")
    //   .filter((q) => q.eq(q.field("_id"), args.groupId))
    //   .collect();
    // const group_member = await ctx.db.insert("group_members", {
    //   userId: args.userId as Id<"users">,
    //   groupId: args.groupId as Id<"group">,
    //   memberRole: args.memberRoles as "Member" | "Mod" | "Admin" | "Owner",
    // });

    // console.log("group member", group_member);
  },
});
