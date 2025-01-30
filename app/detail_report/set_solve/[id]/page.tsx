'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'

interface InvestigationMeeting {
    id: any
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
    managerApproves: ManagerApprove[]
}
interface ProblemResolution {
    id: string
    meeting_id: string
    topic_solution: string
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
    problemSolution: string
}
interface ManagerApprove {
    id: string
    meeting_id: string
    solution_id: string
    comment_solution: string
    comment_troubleshoot: string
}

export default function setSolution() {
    const { id } = useParams()
    const router = useRouter()
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)
    const [problemResolution, setProblemResolution] = useState<ProblemResolution>({
        id: '',
        meeting_id: '',
        topic_solution: '',
        assign_to: '',
        target_finish: '',
        status_solution: '',
        manager_approve: '',
        troubleshootSolutions: [],
    })
    const [open, setOpen] = useState<boolean>(false);

    const fetchMeeting = async (id: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingDetail({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingDetail: data.meetingDetail || [],
                managerApproves: data.managerApproves || []
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedAssign = e.target.value;
        setProblemResolution((prevState) => ({
            ...prevState,
            assign_to: selectedAssign,
            [name]: value
        }));
    };

    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
        setProblemResolution((prevState) => ({
            ...prevState,
        }));
    }, [id]);

    const CreateSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`/api/problem_resolution`, {
                ...problemResolution,
                meeting_id: Number(id),
                manager_approve: "รอแก้ไข",
                status_solution: "รอแก้ไข"
            });
            fetchMeeting(Number(id));
            setOpen(false);
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...meetingDetail,
                manager_approve: "รออนุมัติกำหนดการแก้ไข",
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รออนุมัติกำหนดการแก้ไข"
            })
            router.push('/technical')
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };



    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className="gap-4 grid mb-4">
                {meetingDetail?.incidentReport.map((incident) => (
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
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.topic_meeting}</p>
                    </div>
                </div>

                <div className='flex gap-2'>
                    <div className='flex'>
                        <h1 className='border border-black py-2 px-4 font-bold'>คอมเมนท์เกี่ยวกับการกำหนดการแก้ไข</h1>
                        <h1 className='border border-black py-2 px-4'>{meetingDetail?.managerApproves[0]?.comment_solution}</h1>
                    </div>
                    <div className='flex'>
                        <h1 className='border border-black py-2 px-4 font-bold'>คอมเมนท์เกี่ยวกับการแก้ไขปัญหา</h1>
                        <h1 className='border border-black py-2 px-4'>{meetingDetail?.managerApproves[0]?.comment_troubleshoot}</h1>
                    </div>
                </div>

                <div className="solution">
                    <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                            <tr className="border border-black text-center text-md">
                                <th className="border border-black px-4 py-2">หัวข้อการแก้ไช</th>
                                <th className="border border-black  px-4 py-2">ผู้รับผิดชอบ</th>
                                <th className="border border-black  px-4 py-2">วันที่กำหนดแก้ไข</th>
                                <th className="border border-black  px-4 py-2">วันที่แก้ไข</th>
                                <th className="border border-black  px-4 py-2">สถานะการแก้ไข</th>
                                <th className="border border-black  px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingDetail?.problemResolutions.map((resolution) => (
                                <tr key={resolution.id} className="hover:bg-gray-50 text-center items-center">
                                    <td className="border border-black px-4 py-2">{resolution.topic_solution}</td>
                                    <td className="border border-black px-4 py-2">{resolution.assign_to}</td>
                                    <td className="border border-black px-4 py-2">{resolution.target_finish ? new Date(resolution.target_finish.toString()).toLocaleDateString() : ''}</td>
                                    <td className="border border-black px-4 py-2">
                                        {resolution.troubleshootSolutions && resolution.troubleshootSolutions.length > 0 && resolution.troubleshootSolutions[0].finish_date ? new Date(resolution.troubleshootSolutions[0].finish_date.toString()).toLocaleDateString() : ''}
                                    </td>
                                    <td
                                        className={`border border-black px-4 py-2 ${resolution.status_solution === 'รอการแก้ไข' ? 'bg-yellow-300' : resolution.status_solution === 'แก้ไขสำเร็จ' ? 'bg-green-300' : ''}`}
                                    >
                                        {resolution.status_solution}
                                    </td>
                                    <td className="border border-black px-4 py-2 items-center flex justify-center">
                                        <a href={`/detail_report/troubleshoot/${resolution.id}`} className='cursor-pointer'>
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z" />
                                                <path fillRule="evenodd" d="M11 7V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm4.707 5.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </td>
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