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
      include: { investigationMeetings: {
        include: { problemResolutions: {
          include: { troubleshootSolutions: true }
        },meetingFiles:true ,SelectedUser:true}
      }, ReportFiles: true },
      where: { id: Number(id) },
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
    const reportRelations = await prisma.incidentReport.findUnique({
      where: { id: Number(id) },
      include: {
        investigationMeetings: true,
        ReportFiles: true,
      },
    });

    if (!reportRelations) {
      return new Response(
        JSON.stringify({ error: "Incident report not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (reportRelations.ReportFiles) {
      for (const file of reportRelations.ReportFiles) {
        const fileUrl = file.file_url;
        if (fileUrl) {
           await supabase
            .storage
            .from('reference_file')
            .remove([fileUrl]);
        }
      }
    }
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
    console.error("Error deleting incident report:", error);
    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
