/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.10.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accounts from "../accounts.js";
import type * as comments from "../comments.js";
import type * as comment_votes from "../comment_votes.js";
import type * as conversation from "../conversation.js";
import type * as group from "../group.js";
import type * as group_join_request from "../group_join_request.js";
import type * as group_members from "../group_members.js";
import type * as messages from "../messages.js";
import type * as posts from "../posts.js";
import type * as sessions from "../sessions.js";
import type * as tag from "../tag.js";
import type * as users from "../users.js";
import type * as votes from "../votes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accounts: typeof accounts;
  comments: typeof comments;
  comment_votes: typeof comment_votes;
  conversation: typeof conversation;
  group: typeof group;
  group_join_request: typeof group_join_request;
  group_members: typeof group_members;
  messages: typeof messages;
  posts: typeof posts;
  sessions: typeof sessions;
  tag: typeof tag;
  users: typeof users;
  votes: typeof votes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
