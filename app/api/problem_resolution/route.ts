import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    return Response.json(await prisma.problemSolution.findMany(
        { include: { investigationMeeting: true } }
    ))
}
export async function POST(req: Request) {
    try {
        const {
            meeting_id,
            topic_solution,
            assign_to,
            target_finish,
            status_solution,
            manager_approve,
            email_assign
        } = await req.json()
        const newResolution = await prisma.problemSolution.create({
            include: { investigationMeeting: true },
            data: {
                meeting_id,
                topic_solution,
                assign_to,
                target_finish: new Date(target_finish),
                status_solution,
                manager_approve,
                email_assign
            },
        })
        return Response.json(newResolution)
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}