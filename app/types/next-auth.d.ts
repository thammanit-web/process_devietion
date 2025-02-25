import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    expiresAt?:string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    id_token?: string;
  }
}