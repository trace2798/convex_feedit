export type Post = {
  _id: string;
  title: string;
  content?: string;
  userId: Id<"users">; // assuming v.id("users") returns a string
  username: string | null;
  groupId: Id<"group">; // assuming v.id("group") returns a string
  isArchived: boolean;
  isPublic: boolean;
  publishedAt: number | null;
  updatedAt: number | null;
  fileId: Id<"_storage"> | null | undefined;
  onPublicGroup: boolean;
  tags?: string[]; // assuming v.id("tag") returns a string
};

export type Group = {
  _id: string;
  name: string;
  description: string | undefined;
  ownerId: Id<"users">;
  isPublic: boolean;
};
