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
    return Response.json(await prisma.incidentReport.findMany(
        {
            include: {
                investigationMeetings: {
                    include: {
                        problemResolutions: {
                            include: { troubleshootSolutions: true }
                        }, meetingFiles: true
                    }
                }, ReportFiles: true
            }
        }
    ))
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const priority = formData.get('priority') as string;
        const topic = formData.get('topic') as string;
        const machine_code = formData.get('machine_code') as string;
        const machine_name = formData.get('machine_name') as string;
        const incident_date = formData.get('incident_date') as string;
        const incident_description = formData.get('incident_description') as string;
        const category_report = formData.get('category_report') as string;
        const summary_incident = formData.get('summary_incident') as string;
        const reporter_name = formData.get('reporter_name') as string;
        const report_date = formData.get('report_date') as string;
        const status_report = formData.get('status_report') as string || "รออนุมัติการรายงานความผิดปกติ";
        const head_approve = formData.get('head_approve') as string || "รอยืนยันความผิดปกติ";
        const files = formData.getAll('files') as File[];

        if (!topic || !reporter_name || !incident_date) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const currentYear = new Date().getFullYear().toString().slice(-2);
        const lastIncident = await prisma.incidentReport.findFirst({
            where: { ref_no: { startsWith: `${currentYear}/` } },
            orderBy: { ref_no: 'desc' },
            select: { ref_no: true }
        });

        const lastRefNumber = lastIncident?.ref_no?.split('/')[1] ?? '000';
        const newRefNo = `${currentYear}/${String(Number(lastRefNumber) + 1).padStart(3, '0')}`;

        const newIncident = await prisma.incidentReport.create({
            data: {
                ref_no: newRefNo,
                priority,
                topic,
                machine_code,
                machine_name,
                incident_date: new Date(incident_date),
                incident_description,
                category_report,
                summary_incident,
                reporter_name,
                report_date: new Date(report_date),
                status_report,
                head_approve
            }
        });

        const incidentReportId = newIncident.id;

        let uploadedFiles = [];
        if (files.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'video/mp4'];
            const maxSize = 5 * 1024 * 1024;

            const uploadDir = path.join(process.cwd(), '/public/uploads/');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            for (const file of files) {
                if (!allowedTypes.includes(file.type)) {
                    return new Response(JSON.stringify({ error: "Invalid file type." }), { status: 400 });
                }

                if (file.size > maxSize) {
                    return new Response(JSON.stringify({ error: "File size exceeds the 5MB limit." }), { status: 400 });
                }

                const fileName = `incident_report/${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, fileName);

                const fileBuffer = Buffer.from(await file.arrayBuffer());
                fs.writeFileSync(filePath, fileBuffer);

                const newFile = await prisma.reportFile.create({
                    data: {
                        file_url: fileName,
                        incident_report_id: incidentReportId
                    },
                });

                uploadedFiles.push(newFile);
            }
        }

        return NextResponse.json({ success: true, incidentReport: newIncident, fileReports: uploadedFiles }, { status: 200 });

    } catch (error) {
        console.error('Error creating incident report:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}



