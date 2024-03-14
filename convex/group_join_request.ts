import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const joinGroupRequest = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingRequest = await ctx.db
      .query("group_join_request")
      .withIndex("by_group_user", (q) =>
        q
          .eq("groupId", args.groupId as Id<"group">)
          .eq("userId", args.userId as Id<"users">)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    // If the member already exists
    if (existingRequest.length > 1) {
      // If the member is an Admin or Owner, throw an error
      return existingRequest;
    }
    // If the member does not exist, add them to the group
    else {
      const newRequest = await ctx.db.insert("group_join_request", {
        userId: args.userId as Id<"users">,
        groupId: args.groupId as Id<"group">,
        requestOutcome: "Pending",
        isArchived: false,
      });
      return newRequest;
    }
  },
});

export const cancelGroupRequest = mutation({
  args: {
    userId: v.string(),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingRequest = await ctx.db
      .query("group_join_request")
      .withIndex("by_group_user", (q) =>
        q
          .eq("groupId", args.groupId as Id<"group">)
          .eq("userId", args.userId as Id<"users">)
      )
      .unique();

    if (!existingRequest) {
      throw new Error("Request not found");
    }

    if (existingRequest.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    // If the member already exists

    const cancelRequest = await ctx.db.delete(existingRequest._id);

    return cancelRequest;
  },
});

export const getById = query({
  args: { groupId: v.id("group"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const existingRequestStatus = await ctx.db
      .query("group_join_request")
      .withIndex("by_group_user", (q) =>
        q
          .eq("groupId", args.groupId as Id<"group">)
          .eq("userId", args.userId as Id<"users">)
      )
      .collect();

    if (existingRequestStatus.length === 0) {
      return;
    }

    return existingRequestStatus;
  },
});

export const getByGroupId = query({
  args: { groupId: v.id("group") },

  handler: async (ctx, args) => {
    const existingRequest = await ctx.db
      .query("group_join_request")
      .withIndex("by_group", (q) =>
        q.eq("groupId", args.groupId as Id<"group">)
      )
      .collect();
    const requestsWithUserDetails = await Promise.all(
      existingRequest.map(async (request) => {
        // const group = await ctx.db.get(post.groupId);
        const user = await ctx.db.get(request.userId); // fetch user details
        return { ...request, user }; // include user details in the post
      })
    );

    return requestsWithUserDetails;
  },
});

export const approveJoinRequest = mutation({
  args: {
    userId: v.id("users"),
    groupId: v.string(),
    id: v.id("group_join_request"),
  },
  handler: async (ctx, args) => {
    const existingRequest = await ctx.db.get(args.id);

    if (!existingRequest) {
      return "Something went wrong";
    } else {
      const approvedReq = await ctx.db.patch(args.id, {
        requestOutcome: "Approved",
        acceptedBy: args.userId,
        acceptedAt: Date.now(),
        isArchived: true,
      });

      await ctx.db.insert("group_members", {
        userId: existingRequest.userId,
        groupId: args.groupId as Id<"group">,
        memberRole: "Member",
      });

      return approvedReq;
    }
  },
});

export const rejectJoinRequest = mutation({
  args: {
    userId: v.id("users"),
    groupId: v.string(),
    id: v.id("group_join_request"),
  },
  handler: async (ctx, args) => {
    const existingRequest = await ctx.db.get(args.id);

    if (!existingRequest) {
      return "Something went wrong";
    } else {
      const rejectReq = await ctx.db.patch(args.id, {
        requestOutcome: "Rejected",
        acceptedBy: args.userId,
        acceptedAt: Date.now(),
        isArchived: true,
      });

      return rejectReq;
    }
  },
});
