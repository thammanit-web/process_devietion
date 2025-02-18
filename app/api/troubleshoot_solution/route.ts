import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function GET() {
    const solutions = await prisma.troubleshootSolution.findMany({
        include: { problemSolution: true },
    });
    return NextResponse.json(solutions);
}

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const solution_id = parseInt(formData.get('solution_id') as string, 10);
    const result_troubleshoot = formData.get('result_troubleshoot') as string;
    const finish_date = formData.get('finish_date') as string;

    if (!file || !solution_id) {
        return NextResponse.json({ error: 'Missing file or solution_id' }, { status: 400 });
    }
    const allowedTypes = ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'mov', 'xlsx', 'csv'];
    const fileTypes = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedTypes.includes(fileTypes)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), '/public/uploads/');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `troubleshoot/${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);

    await prisma.troubleshootSolution.create({
        data: {
            solution_id,
            result_troubleshoot,
            finish_date: new Date(finish_date),
            file_summary: fileName,
        },
    });

    return NextResponse.json({ message: 'File uploaded successfully', url: fileName }, { status: 200 });
}