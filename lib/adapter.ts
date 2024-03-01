import { Adapter, AdapterUser } from "@auth/core/adapters";
import { convexClient } from "./convex";
import { api } from "@/convex/_generated/api";

export function ConvexAdapter(): Adapter {
  return {
    async createUser(user) {
      const _id = await convexClient.mutation(api.users.create, {
        email: user.email,
        emailVerified: user.emailVerified
          ? user.emailVerified.toISOString()
          : undefined,
        image: user.image ?? undefined,
        name: user.name ?? undefined,
      });

      if (!_id) throw new Error("Failed to create user");

      return {
        ...user,
        id: _id,
      };
    },
    async getUser(userId) {
      try {
        const user = await convexClient.query(api.users.get, {
          //@ts-ignore Ignore the type error from Convex Id<> type
          id: userId,
        });

        if (!user) return null;

        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified
            ? new Date(user?.emailVerified)
            : undefined,
          image: user?.image,
        } as AdapterUser;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async getUserByEmail(email) {
      try {
        const user = await convexClient.query(api.users.getByEmail, {
          email,
        });

        if (!user) return null;

        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified
            ? new Date(user?.emailVerified)
            : undefined,
          image: user?.image,
        } as AdapterUser;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const user = await convexClient.query(api.accounts.getUserByAccount, {
          providerAccountId,
        });

        if (!user) return null;

        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified
            ? new Date(user?.emailVerified)
            : undefined,
          image: user?.image,
        } as AdapterUser;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async updateUser(user) {
      try {
        const newUser = await convexClient.mutation(api.users.update, {
          id: user.id as any,
          email: user.email as string,
          emailVerified: user?.emailVerified
            ? new Date(user?.emailVerified).toISOString()
            : undefined,
          image: user.image ?? undefined,
        });

        if (!newUser) throw new Error("Failed to update user");

        return {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: newUser.emailVerified
            ? new Date(newUser.emailVerified)
            : undefined,
          image: newUser.image,
        } as any;
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(userId) {
      await convexClient.mutation(api.users.deleteUser, {
        id: userId as any,
      });
    },
    async linkAccount(account) {
      try {
        await convexClient.mutation(api.accounts.create, {
          userId: account.userId as any,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refreshToken as string,
          accessToken: account.accessToken as string,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state as string,
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await convexClient.mutation(api.accounts.deleteAccount, {
        providerAccountId,
      });
    },
    async createSession({ sessionToken, userId, expires }) {
      await convexClient.mutation(api.sessions.create, {
        sessionToken,
        userId: userId as any,
        expires: expires.toISOString(),
      });

      return {
        sessionToken,
        userId,
        expires,
      };
    },
    async getSessionAndUser(sessionToken) {
      try {
        const data = await convexClient.query(api.sessions.getSessionAndUser, {
          sessionToken,
        });

        if (!data) return null;

        return {
          session: data.session
            ? {
                sessionToken: data.session.sessionToken,
                userId: data.session.userId,
                expires: new Date(data.session.expires!),
              }
            : null,
          user: data.user
            ? {
                id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                emailVerified: data.user.emailVerified
                  ? new Date(data.user.emailVerified)
                  : undefined,
                image: data.user.image,
              }
            : null,
        } as any;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async updateSession({ sessionToken }) {
      try {
        await convexClient.mutation(api.sessions.updateSession, {
          sessionToken,
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async deleteSession(sessionToken) {
      try {
        await convexClient.mutation(api.sessions.deleteSession, {
          sessionToken,
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async createVerificationToken({ identifier, expires, token }) {
      return null;
    },
    async useVerificationToken({ identifier, token }) {
      return null;
    },
  };
}
