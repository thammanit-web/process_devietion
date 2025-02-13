import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all SelectedUsers
export async function GET() {
  try {
    const selectedUsers = await prisma.selectedUser.findMany({
      include: { investigationMeeting: true }, 
    });
    return NextResponse.json(selectedUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, display_name, email, meeting_id } = await req.json();
    const newUser = await prisma.selectedUser.create({
      data: { userId, display_name, email, meeting_id },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.selectedUser.delete({
      where: { id },
    });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
