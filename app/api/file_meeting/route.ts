import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const images = await prisma.meetingFile.findMany({
      include: { investigationMeeting: true },
    });
    const { data: storageListData, error: storageListError } = await supabase
      .storage
      .from('reference_file')
      .list('meeting_file', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (storageListError) {
      throw new Error(`Failed to fetch storage list: ${storageListError.message}`);
    }

    return NextResponse.json(images, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const meetingId = formData.get('meetingId');

    if (!file || !meetingId) {
      throw new Error("Missing file or meetingId in the request.");
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG,EXCEL, and PDF are allowed.");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds the 5MB limit.");
    }
    const fileName = `meeting_file/${Date.now()}-${file.name}`;
    
    const {data:uploadData ,error: uploadError } = await supabase.storage
      .from('reference_file')
      .upload(fileName,file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const newImage = await prisma.meetingFile.create({
      data: {
        file_url: uploadData.fullPath,
        meeting_id: parseInt(meetingId as string),
      },
    });

    return NextResponse.json({ success: true, fileUrl: newImage }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
