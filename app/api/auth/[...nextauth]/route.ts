import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      oid?: string;
    };
    accessToken?: string;
    idToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID as string,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
        scope: "openid profile User.Read email Mail.Send",
      }),
    });

    const data = await response.json();
    console.log("Token refresh response:", data);

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    return {
      ...token,
      accessToken: data.access_token,
      idToken: data.id_token ?? token.idToken, 
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshTokenError" };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        params: {
          scope: "openid profile User.Read email offline_access Mail.Send User.Read.All",
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/azure-ad",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
        token.idToken = account.id_token as string;
        token.refreshToken = account.refresh_token as string;
        token.expiresAt = Date.now() + Number(account.expires_in) * 1000;
      }
      if (token.expiresAt && Date.now() > token.expiresAt) {
        console.log("Token is about to expire, refreshing...");
        return await refreshAccessToken(token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      session.expiresAt = token.expiresAt;
      const cookie = await cookies();

      cookie.set('accessToken', session.accessToken);
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
