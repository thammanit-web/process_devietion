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
    const troubleshoot = await prisma.troubleshootSolution.findUnique({
      where: { id: Number(id) },
      include: { problemSolution: true}
    });
    if (!troubleshoot) {
      return NextResponse.json({ error: 'ManagerApprove not found' }, { status: 404 });
    }
    return NextResponse.json(troubleshoot);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const { id } = await params;

    const deletedManagerApprove = await prisma.troubleshootSolution.delete({
      where: { id: Number(id) },
    });
    const fileUrl = deletedManagerApprove.file_summary;
    if (fileUrl) {
      const { data, error } = await supabase
      .storage
      .from('reference_file')
      .remove([fileUrl]);
    }

    return Response.json({message: "Manager approve successfully deleted",deletedManagerApprove}); 
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}