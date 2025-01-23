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
    const images = await prisma.referenceImage.findMany({
      include: { incidentReport: true },
    });
    return NextResponse.json(images, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const incidentReportId = formData.get('incidentReportId');

    if (!file || !incidentReportId) {
      throw new Error("Missing file or incidentReportId in the request.");
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG,EXCEL, and PDF are allowed.");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds the 5MB limit.");
    }
    const fileName = `uploads/${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('reference_file')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('reference_file')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    const newImage = await prisma.referenceImage.create({
      data: {
        file_url: imageUrl,
        incident_report_id: parseInt(incidentReportId as string),
      },
    });

    return NextResponse.json({ success: true, image: newImage }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
