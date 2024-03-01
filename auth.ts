import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
import Github from "next-auth/providers/github";
import authConfig from "@/auth.config";
import { ConvexAdapter } from "./lib/adapter";
import { useMutation } from "convex/react";
import { api } from "./convex/_generated/api";
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  // providers: [
  //   Github({
  //     clientId: process.env.GITHUB_CLIENT_ID,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //   }),
  // ],
  // session: { strategy: "jwt" },
  session: { strategy: "database" },

  callbacks: {
    async signIn({ account }) {
      // Allow OAuth without email verification
      // console.log("ACCOUNT", account);
      if (account?.provider !== "credentials") return true;
      return true;
    },
    async session({ token, session }) {
      // console.log(token);
      // console.log(session);

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      // const existingUser = useQuery(api.users.get, {
      //   id: token.sub as Id<"users">,
      // })
      // // console.log(existingUser);
      // console.log(token);

      return token;
    },
  },
  adapter: ConvexAdapter(),
});
