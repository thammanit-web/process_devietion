import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return Response.json(await prisma.investigationMeeting.findMany(
    { include: { problemResolutions: true, incidentReport: true,managerApproves:true } }
  ))
}
export async function POST(req: Request) {
  try {
    const {
      incident_report_id,
      topic_meeting,
      scheduled_date,
      summary_meeting,
      investigation_signature,
      manager_approve,

    } = await req.json()
    const newMeeting = await prisma.investigationMeeting.create({
      include: { problemResolutions: true, incidentReport: true },
      data: {
        incident_report_id,
        topic_meeting,
        scheduled_date: new Date(scheduled_date),
        summary_meeting,
        investigation_signature,
        manager_approve,

      },
    })
    return Response.json(newMeeting)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}