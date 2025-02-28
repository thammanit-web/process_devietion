import NextAuth, { NextAuthOptions, Session } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { refreshAccessToken } from "@/app/utils/auth";


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
        const { access_token, id_token, refresh_token, expires_in } = account;
        token.accessToken = access_token;
        token.idToken = id_token;
        token.refreshToken = refresh_token;
        token.exp = Date.now() + Number(account.expires_in) * 1000;
      }
      
      if (token.exp && Date.now() > Number(token.exp) - 5000) {
        console.log("Token is about to expire, refreshing...");
        return await refreshAccessToken(token);
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
