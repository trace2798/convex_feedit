import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isOAuth: boolean;
  username: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
