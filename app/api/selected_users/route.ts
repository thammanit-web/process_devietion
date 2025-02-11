import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { userId, meeting_id } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "OID is required" }, { status: 400 });
        }

        const newUser = await prisma.selectedUser.create({
            data: {
                userId,
                meeting_id
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error saving user:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
