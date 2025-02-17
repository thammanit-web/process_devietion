import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  return Response.json(await prisma.investigationMeeting.findMany(
    { include: { problemResolutions: true, incidentReport: true, managerApproves: true,SelectedUser:true } }
  ))
}

interface User {
  userId: string;
  display_name: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const {
      incident_report_id,
      topic_meeting,
      scheduled_date,
      summary_meeting,
      investigation_signature,
      manager_approve,
      selectedUsers,
    } = await req.json();

    if (!selectedUsers || selectedUsers.length === 0) {
      return NextResponse.json({ error: "At least one user is required" }, { status: 400 });
    }
    
    const newMeeting = await prisma.investigationMeeting.create({
      include: { 
        problemResolutions: true, 
        incidentReport: true 
      },
      data: {
        incident_report_id,
        topic_meeting,
        scheduled_date: new Date(scheduled_date),
        summary_meeting,
        investigation_signature,
        manager_approve,
      },
    });

    const selectedUsersPromises = selectedUsers.map(async (user: User) => {
      await prisma.selectedUser.create({
        data: {
          userId: user.userId,
          display_name: user.display_name,
          email: user.email,
          meeting_id: newMeeting.id,
        },
      });
    });

    await Promise.all(selectedUsersPromises);

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
