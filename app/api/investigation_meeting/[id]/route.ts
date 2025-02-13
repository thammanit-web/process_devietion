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
      include: {
        incidentReport: true, problemResolutions: {
          include: { troubleshootSolutions: true }
        }, meetingFiles: true, managerApproves: true,SelectedUser:true
      }
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
    const { id } = await params;
    const formData = await req.formData();
    const meeting_date = formData.get('meeting_date') as string;
    const summary_meeting = formData.get('summary_meeting') as string;
    const manager_approve = formData.get('manager_approve') as string;
    const files = formData.getAll('files') as File[];
    
    const updateMeeting = await prisma.investigationMeeting.update({
      where: { id: Number(id) },
      data: {   
        meeting_date: new Date(meeting_date),
        summary_meeting,
        manager_approve
      },
    });

    const MeetingId = updateMeeting.id;
    if (files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'video/mp4'];
      const maxSize = 5 * 1024 * 1024;
      const uploadedFiles = [];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return new Response(JSON.stringify({ error: "Invalid file type." }), { status: 400 });
        }

        if (file.size > maxSize) {
          return new Response(JSON.stringify({ error: "File size exceeds the 5MB limit." }), { status: 400 });
        }

        const fileName = `meeting_file/${Date.now()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('reference_file')
          .upload(fileName, file);

        if (uploadError) {
          return new Response(JSON.stringify({ error: `Upload failed: ${uploadError.message}` }), { status: 500 });
        }

        const newFile = await prisma.meetingFile.create({
          data: {
            file_url: uploadData.path,
            meeting_id: MeetingId,
          },
        });

        uploadedFiles.push(newFile);
      }

      return new Response(JSON.stringify({ success: true, updateMeeting, fileReports: uploadedFiles }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: true, updateMeeting }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
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