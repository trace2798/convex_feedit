import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const authUserRoles = v.union(
  v.literal("User"),
  v.literal("Mod"),
  v.literal("Admin"),
  v.literal("Developer")
);

/**
 * Convex schema
 *
 * The [user, account, session, verificationToken] tables are modeled from https://authjs.dev/getting-started/adapters#models
 */
export default defineSchema({
  /**
   * * User table
   * @see https://authjs.dev/getting-started/adapters#user
   */
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_user_email", ["email"]),
  /**
   * * Session table
   *
   * @see https://authjs.dev/getting-started/adapters#session
   */
  sessions: defineTable({
    userId: v.id("users"),
    expires: v.optional(v.string()),
    sessionToken: v.string(),
  }).index("by_session_token", ["sessionToken"]),
  /**
   * * Account table
   *
   * @see https://authjs.dev/getting-started/adapters#account
   */
  accounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refreshToken: v.optional(v.string()),
    accessToken: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
  }).index("by_provider_account_id", ["providerAccountId"]),
  group: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["name"],
    }),
  posts: defineTable({
    title: v.string(),
    content: v.optional(v.string()),
    userId: v.id("users"),
    groupId: v.id("group"),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    isPublic: v.boolean(),
    publishedAt: v.union(v.null(), v.number()),
    updatedAt: v.union(v.null(), v.number()),
    tags: v.optional(v.array(v.id("tag"))),
  })
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_tag", ["tags"]),
  tags: defineTable({
    userId: v.id("users"),
    name: v.string(),
  }),
});
