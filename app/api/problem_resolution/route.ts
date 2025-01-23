import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  return Response.json(await prisma.problemResolution.findMany(
    { include: {  investigationMeeting:true } }
  ))
}
export async function POST(req: Request) {
    try {
        const {
            meeting_id,
            preventive_measures,
            responsible_person,
            target_finish,
            status,
        } = await req.json()
        const newResolution = await prisma.problemResolution.create({
          include: {  investigationMeeting:true } ,
            data: {
                meeting_id,
                preventive_measures,
                responsible_person,
                target_finish,
                status,
            },
        })
        return Response.json(newResolution)
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}