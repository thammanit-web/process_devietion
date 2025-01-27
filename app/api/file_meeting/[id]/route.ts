import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }>}) {
  try {
    const { id } = await params; 

    const { data: storageListData, error: storageListError } = await supabase
    .storage
    .from('reference_file')
    .list('meeting_file', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    const file = await prisma.meetingFile.findUnique({
      where: { id: Number(id) },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    return NextResponse.json(file, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: number }>}) => {
  try {
    const { id } = await params;

    const file = await prisma.reportFile.findUnique({
      where: { id: Number(id) },
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }
    if (!file.file_url) {
      return NextResponse.json({ error: 'File URL not found.' }, { status: 400 });
    }
    const { data, error } = await supabase
      .storage
      .from('reference_file')
      .remove([`meeting_file/${file.file_url}`]);

    if (error) {
      console.error('Supabase file removal error:', error.message);
      return NextResponse.json({ error: 'Failed to remove file from storage.' }, { status: 500 });
    }
    await prisma.meetingFile.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error during file deletion:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
