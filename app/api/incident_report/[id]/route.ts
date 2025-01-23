import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const incident_report = await prisma.incidentReport.findUnique({
      include: { investigationMeetings: true, referenceImages: true },
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

    const deletedReport = await prisma.incidentReport.delete({
      where: { id: Number(id) },
    });

    return Response.json({ massage: "delete success", deletedReport });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}