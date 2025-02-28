import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { refreshAccessToken } from "@/app/utils/auth";

export async function GET(request: NextRequest) {
    let token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token.exp && Date.now() > (token.exp as number) - 5000) {
        console.log("Access token expired, attempting refresh...");
        token = await refreshAccessToken(token);
        if (token.error) {
            return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 });
        }
    }

    try {
        const res = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${token.accessToken}` },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch users" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}