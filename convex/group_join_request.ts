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
      .collect();

    // If the member already exists
    if (existingRequest.length > 0) {
      // If the member is an Admin or Owner, throw an error
      return existingRequest;
    }
    // If the member does not exist, add them to the group
    else {
      const newRequest = await ctx.db.insert("group_join_request", {
        userId: args.userId as Id<"users">,
        groupId: args.groupId as Id<"group">,
        requestOutcome: "Pending",
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
      .collect();

    if (existingRequest.length === 0) {
      throw new Error("Request not found");
    }
    // If the member already exists

    const cancelRequest = await ctx.db.delete(existingRequest[0]._id);

    return cancelRequest;
  },
});

export const getById = query({
  args: { groupId: v.id("group"), userId: v.id("users") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
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

    return existingRequestStatus;
  },
});

export const getByGroupId = query({
  args: { groupId: v.id("group")},

  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // // console.log("IDENTITY ===>", identity);
    // if (!args.userId) {
    //   throw new Error("Not Authorized");
    // }
    // const userInfo = await ctx.db
    //   .query("group_members")
    //   .withIndex("by_user", (q) => q.eq("userId", args.userId as Id<"users">))
    //   .collect();
    // if (userInfo.length === 0) {
    //   throw new Error("Not Authorized");
    // }
    // if (userInfo[0].userId !== args.userId) {
    //   throw new Error("Not Authorized");
    // }
    // if (userInfo[0].memberRole !== "Admin" || "Owner") {
    //   throw new Error("Not Authorized");
    // }
    const existingRequest = await ctx.db
      .query("group_join_request")
      .withIndex("by_group", (q) =>
        q.eq("groupId", args.groupId as Id<"group">)
      )
      .collect();

    return existingRequest;
  },
});
