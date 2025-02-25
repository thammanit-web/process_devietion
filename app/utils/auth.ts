import { JWT } from "next-auth/jwt";

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AZURE_AD_CLIENT_ID as string,
          client_secret: process.env.AZURE_AD_CLIENT_SECRET as string,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken as string,
          scope: "openid profile User.Read email Mail.Send",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to refresh token: ${errorData.error_description || "Unknown error"}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error("Access token missing in response");
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
