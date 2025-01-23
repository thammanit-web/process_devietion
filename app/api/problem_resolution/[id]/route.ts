import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params
    const problem_resolution = await prisma.problemResolution.findUnique({
      where: { id: Number(id) },
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
        preventive_measures,
        responsible_person,
        target_finish,
        status, } = await req.json()
    return Response.json(await prisma.problemResolution.update({
      where: { id: Number(id) },
      data: {              
        preventive_measures,
        responsible_person,
        target_finish,
        status, },
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

    const deletedResolution = await prisma.problemResolution.delete({
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