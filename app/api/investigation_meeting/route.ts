import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return Response.json(await prisma.investigationMeeting.findMany(
    { include: {  problemResolutions: true, employeeTrainings: true,incidentReport:true } }
  ))
}
export async function POST(req: Request) {
    try {
        const {
          investigation_results,
          meeting_date,
          investigation_date,
          investigation_signature ,
          factor_manager_signature,
          incident_report_id 
        } = await req.json()
        const newMeeting = await prisma.investigationMeeting.create({
          include: {  problemResolutions: true, employeeTrainings: true,incidentReport:true } ,
            data: {
              investigation_results,
              meeting_date,
              investigation_date,
              investigation_signature,
              factor_manager_signature,
              incident_report_id
            },
        })
        return Response.json(newMeeting)
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}