import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    return Response.json(await prisma.incidentReport.findMany(
        { include: { investigationMeetings: true, referenceImages: true } }
    ))
}

export async function POST(req: Request) {
    try {
        const {
            priority,
            topic, machine_code,
            machine_name, incident_date, incident_description, category_report, summary_incident,
            reporter_name, report_date, status_report = "รออนุมัติการรายงานความผิดปกติ", head_approve = "รอยืนยันความผิดปกติ"
        } = await req.json()

        const lastIncident = await prisma.incidentReport.findFirst({
            where: { ref_no: { startsWith: '25/' } },
            orderBy: { ref_no: 'desc' }
        });

        let newRefNo = "25/001";

        if (lastIncident && lastIncident.ref_no) {
            const lastRefNo = lastIncident.ref_no;
            const numericPart = parseInt(lastRefNo.split('/')[1]);
            const nextNumber = numericPart + 1;
            newRefNo = `25/${String(nextNumber).padStart(3, '0')}`;
        }

        const newIncident = await prisma.incidentReport.create({
            data: {
                priority,
                ref_no: newRefNo, topic, machine_code,
                machine_name, incident_date: new Date(incident_date), incident_description, category_report, summary_incident,
                reporter_name, report_date: new Date(report_date), status_report, head_approve
            },
        })
        return Response.json(newIncident)
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}