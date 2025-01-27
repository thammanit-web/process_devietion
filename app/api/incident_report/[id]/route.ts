import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
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
    const incident_report = await prisma.incidentReport.findUnique({
      include: { investigationMeetings: true, ReportFiles: true },
      where: { id: Number(id) },
    });
    const { data: storageListData, error: storageListError } = await supabase
      .storage
      .from('reference_file')
      .list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (!incident_report) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json(incident_report);
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
    const { ref_no, priority, topic, machine_code,
      machine_name, incident_date, incident_description, summary_incident,
      reporter_name, report_date, status_report, head_approve } = await req.json()
    return Response.json(await prisma.incidentReport.update({
      where: { id: Number(id) },
      data: {
        ref_no, priority, topic, machine_code,
        machine_name, incident_date, incident_description, summary_incident,
        reporter_name, report_date, status_report, head_approve
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

    const reportWithFiles = await prisma.incidentReport.findUnique({
      where: { id: Number(id) },
      include: {
        investigationMeetings: true,
        ReportFiles: true,
      },
    });

    if (!reportWithFiles) {
      return new Response(
        JSON.stringify({ error: "Incident report not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
      const fileUrl = reportWithFiles.ReportFiles.map(file => file.file_url).filter(url => url !== null);
      const { error: deleteError } = await supabase
        .storage
        .from('reference_file')
        .remove(fileUrl);

    const deletedReport = await prisma.incidentReport.delete({
      where: { id: Number(id) },
      include: {
        investigationMeetings: true,
        ReportFiles: true,
      },
    });

    return new Response(
      JSON.stringify({ message: "Delete success", deletedReport }),
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
    );
  }
}