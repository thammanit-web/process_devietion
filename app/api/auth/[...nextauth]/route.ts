import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaClient } from "@prisma/client";
import zlib from "zlib";
import crypto from "crypto";

const prisma = new PrismaClient();

function compressData(data: object) {
  return zlib.deflateSync(JSON.stringify(data)).toString("base64");
}

function decompressData(compressedData: string) {
  return JSON.parse(zlib.inflateSync(Buffer.from(compressedData, "base64")).toString());
}

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

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
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
        },
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
        const { access_token, id_token, refresh_token, expires_in } = account;
        token.accessToken = access_token;
        token.idToken = id_token;
        token.refreshToken = refresh_token;
        token.expiresAt = Date.now() + Number(expires_in) * 1000;
      }
  
      const sessionId = crypto.randomUUID(); 
      const compressedToken = compressData(token);
  
      await prisma.sessionToken.create({
        data: {
          id: sessionId,
          token: compressedToken,
          expiresAt: token.expiresAt ? new Date(token.expiresAt) : new Date(),
        },
      });
  
      return { ...token, sessionId }; 
    },
  
    async session({ session, token }) {
      if (!token.sessionId) {
        console.error('No sessionId found in token:', token);
        return session;
      }
      const sessionData = await prisma.sessionToken.findUnique({
        where: { id: token.sessionId as string },
      });
  
      if (sessionData) {
        const decompressedToken = decompressData(sessionData.token);
        session.accessToken = decompressedToken.accessToken;
        session.idToken = decompressedToken.idToken;
        session.expiresAt = decompressedToken.expiresAt;
      } else {
        console.error('Session data not found for sessionId:', token.sessionId);
      }
  
      return session;
    },
  },
  
};
  

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };