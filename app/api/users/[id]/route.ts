import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface Params {
  id?: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const url = `https://graph.microsoft.com/v1.0/users/${id}`;

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token?.accessToken}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch user(s)" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
