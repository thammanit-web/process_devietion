import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      if (params.id) {
        // Fetch the specific file by its ID
        const { id } = params;
        const referenceFile = await prisma.referenceImage.findUnique({
          where: { id: Number(id) },
          include: { incidentReport: true },
        });
  
        if (!referenceFile) {
          return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, file: referenceFile });
      } else {
        // Fetch all files
        const referenceFiles = await prisma.referenceImage.findMany({
          include: { incidentReport: true },
        });
  
        if (!referenceFiles || referenceFiles.length === 0) {
          return NextResponse.json({ error: 'No files found' }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, files: referenceFiles });
      }
    } catch (error: any) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };

export async function PUT(req: NextRequest) {
  try {
    const { id, file_url, incident_report_id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedImage = await prisma.referenceImage.update({
      where: { id: parseInt(id) },
      data: {
        file_url: file_url || undefined,
        incident_report_id: incident_report_id ? parseInt(incident_report_id) : undefined,
      },
    });

    return NextResponse.json({ success: true, image: updatedImage }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const id = parseInt(params.id);

    const image = await prisma.referenceImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const fileName = image.file_url?.split('/').pop();

    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from('reference_file')
        .remove([`uploads/${fileName}`]);

      if (deleteError) {
        throw new Error(`Failed to delete file from storage: ${deleteError.message}`);
      }
    }

    await prisma.referenceImage.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
