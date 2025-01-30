import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const manager_approve = await prisma.managerApprove.findUnique({
      where: { id: Number(id) },
    });
    if (!manager_approve) {
      return NextResponse.json({ error: 'ManagerApprove not found' }, { status: 404 });
    }
    return NextResponse.json(manager_approve);
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
      solution_id,
      comment_solution,
      comment_troubleshoot,
     } = await req.json()
    return Response.json(await prisma.managerApprove.update({
      where: { id: Number(id) },
      data: {              
        meeting_id,
        solution_id,
        comment_solution,
        comment_troubleshoot,
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

    const deletedManagerApprove = await prisma.managerApprove.delete({
      where: { id: Number(id) },
    });
    return Response.json({message: "Manager approve successfully deleted",deletedManagerApprove}); 
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}