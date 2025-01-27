import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const investigation_meeting = await prisma.investigationMeeting.findUnique({
      where: { id: Number(id) },
      include: {incidentReport:true,problemResolutions:true,meetingFiles:true}
    });
    const { data: storageListData, error: storageListError } = await supabase
    .storage
    .from('reference_file')
    .list('meeting_file', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (!investigation_meeting) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(investigation_meeting);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params
    const {
      incident_report_id,
      topic_meeting,
      scheduled_date,
      meeting_date,
      summary_meeting,
      investigation_signature,
      manager_approve,
      factor_manager_signature 
    } = await req.json()
    return Response.json(await prisma.investigationMeeting.update({
      where: { id: Number(id) },
      data: {
        incident_report_id,
        topic_meeting,
        scheduled_date,
        meeting_date: new Date(meeting_date),
        summary_meeting,
        investigation_signature,
        manager_approve,
      },
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params;

    const deletedMeeting = await prisma.investigationMeeting.delete({
      where: { id: Number(id) },
    });
    return Response.json({ message: "Meeting successfully deleted", deletedMeeting });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}