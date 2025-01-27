import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
    return Response.json(await prisma.incidentReport.findMany(
        { include: { investigationMeetings: true, ReportFiles: true } }
    ))
}

export async function POST(req: Request) {
    try {
        const {
            priority, topic, machine_code, machine_name, 
            incident_date, incident_description, category_report, 
            summary_incident, reporter_name, report_date,
            status_report = "รออนุมัติการรายงานความผิดปกติ", 
            head_approve = "รอยืนยันความผิดปกติ"
        } = await req.json();

        const lastIncidentRefNo = await prisma.incidentReport.findFirst({
            where: { ref_no: { startsWith: '25/' } },
            orderBy: { ref_no: 'desc' },
            select: { ref_no: true }  //
        });

        const lastRefNumber = lastIncidentRefNo?.ref_no?.split('/')[1] ?? '000';
        const newRefNo = `25/${String(Number(lastRefNumber) + 1).padStart(3, '0')}`;

        const newIncident = await prisma.incidentReport.create({
            data: {
                priority,
                ref_no: newRefNo, 
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
        return Response.json({ success: true, incidentReport: newIncident }, { status: 200 });
    } catch (error) {
        console.error('Error creating incident report:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
