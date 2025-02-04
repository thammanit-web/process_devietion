import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    return Response.json(await prisma.managerApprove.findMany(
        { include: { investigationMeeting: true,problemSolution:true } }
    ))
}
export async function POST(req: Request) {
    try {
        const {
            meeting_id,
            solution_id,
            comment_solution,
            comment_troubleshoot,
        } = await req.json()
        const newComment = await prisma.managerApprove.create({
            data: {
                meeting_id,
                solution_id,
                comment_solution,
                comment_troubleshoot,
            },
        })
        return Response.json(newComment)
    } catch (error) {
        return new Response(error as BodyInit, {
            status: 500,
        })
    }
}