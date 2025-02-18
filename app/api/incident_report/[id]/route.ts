import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const incident_report = await prisma.incidentReport.findUnique({
      include: {
        investigationMeetings: {
          include: {
            problemResolutions: {
              include: { troubleshootSolutions: true }
            }, meetingFiles: true, SelectedUser: true
          }
        }, ReportFiles: true
      },
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
        if (file.file_url) { 
          const fullPath = path.join(process.cwd(), 'public', 'uploads', file.file_url); 

          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          } 
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
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
