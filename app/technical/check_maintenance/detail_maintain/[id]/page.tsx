'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'
import investigationMeeting from '@/app/technical/investigation/[id]/page'

interface InvestigationMeeting {
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: Boolean
    incidentReport:
    {
        id: number
        priority: string
        ref_no: string
        topic: string
    }[]
    problemResolutions: ProblemResolution[]
}
interface ProblemResolution {
    id: string
    meeting_id: string
    topic_solution: string
    solution_id: string
    assign_to: string
    target_finish: string
    status_solution: string
    manager_approve: string
    troubleshootSolutions: Troubleshoot[]
}
interface Troubleshoot {
    id: string
    solution_id: string
    result_troubleshoot: string
    file_summary: string
    finish_date: string
}

export default function setSolution() {
    const { id } = useParams()
    const router = useRouter()
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)
    const [problemSolution, setProblemSolution] = useState<ProblemResolution | null>(null)
 
    const fetchMeeting = async (meeting_id: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${meeting_id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingDetail({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingDetail: data.meetingDetail || [],
                managerApproves: data?.managerApproves || [],
                problemResolutions: data?.problemResolutions || [],
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }


    const fetchSolution = async (id: number) => {
        try {
            const respone = await fetch(`/api/problem_resolution/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setProblemSolution({
                ...data,
                troubleShoots: data?.troubleshootSolutions || []
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
    useEffect(() => {
        if (problemSolution?.meeting_id) {
            fetchMeeting(Number(problemSolution?.meeting_id));
        }
    }, [problemSolution?.meeting_id]);

    useEffect(() => {
        if (id) {
            fetchSolution(Number(id));
        }
    }, [id]);
    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className="gap-4 grid mb-4">
                {meetingDetail && meetingDetail.incidentReport.length > 0 && meetingDetail?.incidentReport.map((incident) => (
                    <div key={incident.id} className='flex'>
                        <div className='w-full flex gap-2 text-blue-500'>
                            <div className="flex">
                                <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Topic</p>
                                <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{incident.topic}</p>
                            </div>
                            <div className="flex">
                                <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Priority</p>
                                <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{incident.priority}</p>
                            </div>
                            <div className="flex">
                                <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Ref. No</p>
                                <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{incident.ref_no}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className='w-full  lg:flex md:flex gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการแก้ไข</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{problemSolution?.topic_solution}</p>
                    </div>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>กำหนดเสร็จ</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{problemSolution?.target_finish ? new Date(problemSolution?.target_finish.toString()).toLocaleDateString() : ''}</p>
                    </div>
                </div>



                <div className="solution">
                    <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                            <tr className="bg-gray-300 text-center">
                            <th className="border border-black px-4 py-2">ผู้รับผิดชอบ</th>
                                <th className="border border-black px-4 py-2">รายละเอียดการแก้ไข</th>
                                <th className="border border-black px-4 py-2">ไฟล์อัพโหลด</th>
                                <th className="border border-black px-4 py-2">วันที่แก้ไข</th> 
                                
                            </tr>
                        </thead>
                        <tbody>
                            {problemSolution && problemSolution.troubleshootSolutions && problemSolution?.troubleshootSolutions.map((solution) => (
                                <tr key={solution.id} className="hover:bg-gray-50 text-center items-center border border-black">
                                    <td className="border border-black px-4 py-2">{problemSolution?.assign_to}</td>
                                    <td className="border border-black px-4 py-2">{solution.result_troubleshoot}</td>
                                    <td className="border border-black px-4 py-2">
                                        <a href={`${process.env.NEXT_PUBLIC_STORAGE}${solution.file_summary}`} target='_blank' className='underline text-blue-500'>
                                            {solution.file_summary?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                        </a>
                                    </td>
                                    <td className="border border-black px-4 py-2">{solution.finish_date ? new Date(solution.finish_date.toString()).toLocaleDateString() : ''}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='gap-2 flex justify-end'>
                <a
                    onClick={router.back}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
         
            </div>

        </div>
    )
}