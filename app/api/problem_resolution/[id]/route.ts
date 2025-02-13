import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const problem_resolution = await prisma.problemSolution.findUnique({
      where: { id: Number(id) },
      include: { investigationMeeting: true, troubleshootSolutions: true },
    });
    if (!problem_resolution) {
      return NextResponse.json({ error: 'Resolution not found' }, { status: 404 });
    }
    return NextResponse.json(problem_resolution);
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
      meeting_id,
      topic_solution,
      assign_to,
      status_solution,
      manager_approve,
      email_assign,
     } = await req.json()
    return Response.json(await prisma.problemSolution.update({
      where: { id: Number(id) },
      data: {              
        meeting_id,
        topic_solution,
        assign_to,
        status_solution,
        manager_approve,
        email_assign
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

    const deletedResolution = await prisma.problemSolution.delete({
      where: { id: Number(id) },
    });
    return Response.json({message: "Resolution successfully deleted",deletedResolution}); 
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}