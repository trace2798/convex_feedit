export type Post = {
  _id: string;
  title: string;
  content?: string;
  userId: string; // assuming v.id("users") returns a string
  username: string | null;
  groupId: string; // assuming v.id("group") returns a string
  isArchived: boolean;
  isPublished: boolean;
  isPublic: boolean;
  publishedAt: number | null;
  updatedAt: number | null;
  tags?: string[]; // assuming v.id("tag") returns a string
};
