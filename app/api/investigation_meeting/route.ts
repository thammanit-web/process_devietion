import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  return Response.json(await prisma.investigationMeeting.findMany(
    { include: { problemResolutions: true, incidentReport: true, managerApproves: true,SelectedUser:true } }
  ))
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
      userId,
      display_name,
      email
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const newMeeting = await prisma.investigationMeeting.create({
      include: { problemResolutions: true, incidentReport: true },
      data: {
        incident_report_id,
        topic_meeting,
        scheduled_date: new Date(scheduled_date),
        summary_meeting,
        investigation_signature,
        manager_approve,
      },
    });
    const newUser = await prisma.selectedUser.create({
      data: {
        userId,
        display_name,
        email,
        meeting_id: newMeeting.id
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}

