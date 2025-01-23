import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const investigation_meeting = await prisma.investigationMeeting.findUnique({
      where: { id: Number(id) },
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
        investigation_results,
        meeting_date,
        investigation_date,
        investigation_signature ,
        factor_manager_signature } = await req.json()
    return Response.json(await prisma.investigationMeeting.update({
      where: { id: Number(id) },
      data: {              
        investigation_results,
        meeting_date,
        investigation_date,
        investigation_signature ,
        factor_manager_signature },
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
    return Response.json({message: "Meeting successfully deleted",deletedMeeting}); 
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}