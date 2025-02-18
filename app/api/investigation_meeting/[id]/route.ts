import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
        }, meetingFiles: true, managerApproves: true, SelectedUser: true
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

      const uploadDir = path.join(process.cwd(), '/public/uploads/');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }


      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          return new Response(JSON.stringify({ error: "Invalid file type." }), { status: 400 });
        }

        if (file.size > maxSize) {
          return new Response(JSON.stringify({ error: "File size exceeds the 5MB limit." }), { status: 400 });
        }

        const fileName = `investigation/${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);

        const newFile = await prisma.meetingFile.create({
          data: {
            file_url: fileName,
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
    const reportRelations = await prisma.investigationMeeting.findUnique({
      where: { id: Number(id) },
      include: {
        meetingFiles: true, SelectedUser: true
      }
    });

    if (!reportRelations) {
      return new Response(
        JSON.stringify({ error: "investigationMeeting report not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (reportRelations.meetingFiles) {
      for (const file of reportRelations.meetingFiles) {
        if (file.file_url) {
          const fullPath = path.join(process.cwd(), 'public', 'uploads', file.file_url);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      }
    }
    const deletedMeeting = await prisma.investigationMeeting.delete({
      where: { id: Number(id) },
      include: {
        meetingFiles: true, SelectedUser: true
      }
    });
    return Response.json({ message: "Meeting successfully deleted", deletedMeeting });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('An error occurred during DELETE operation:', error.message);
      return new Response(
        JSON.stringify({ error: 'An unknown error occurred', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('An unknown error occurred:', error);
      return new Response(
        JSON.stringify({ error: 'An unknown error occurred', details: 'Unknown error type' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
}