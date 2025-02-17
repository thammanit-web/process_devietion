'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import investigationMeeting from '../../investigation/[id]/page'
import { Modal } from '@/app/components/modal'
import { LoadingOverlay } from '@/app/components/loading'
import { report } from 'process'

interface InvestigationMeeting {
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: Boolean
    incidentReport: { id: number;
        priority: string;
        ref_no: string;
        topic: string;}[];
    problemResolutions: ProblemResolution[]
    managerApproves: ManagerApprove[]
    SelectedUser: {
        id: string;
        userId: string;
        display_name: string;
        email: string;
    }[];
}


interface ProblemResolution {
    id: string
    meeting_id: string
    topic_solution: string
    assign_to: string
    email_assign: string
    target_finish: string
    status_solution: string
    manager_approve: string
    managerApproves: ManagerApprove[]
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
    const [problemSolution, setProblemSolution] = useState<ProblemResolution | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const fetchMeeting = async (id: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingDetail({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingDetail: data.meetingDetail || [],
                managerApproves: data?.managerApproves || [],
                problemResolutions: data?.problemResolutions || [],
            });
            if (data.problemResolutions && data.problemResolutions.length > 0) {
                setProblemSolution(data.problemResolutions[0]);
            }
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
    const handleSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รออนุมัติการแก้ไข",
            },);
            const selectedUserEmails = meetingDetail?.SelectedUser?.map(user => user.email).filter(email => email) || [];
            const problemResolutionEmails = meetingDetail?.problemResolutions?.map(assign => assign.email_assign).filter(email => email) || [];

            const to = [...selectedUserEmails, ...problemResolutionEmails].join(',');
            await axios.post(`/api/send_email`, {
                to: "thammanit@thainitrate.com",
                subject: `Process Deviation`,
                html: `<p>รายงานความผิดปกติในกระบวนการผลิต</p>
                   <p><strong>หัวข้อ : </strong>${meetingDetail?.incidentReport[0]?.topic}</p>
                <p><strong>ดำเนินการเสร็จแล้ว</strong></p>
              <a href="${`http://localhost:3000/manager_page/improved/${id}`}">คลิกเพื่อตรวจสอบ</a>
               `
            });
            router.back()
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };
    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รอการแก้ไข",
            })
            const problemResolutionIds = meetingDetail?.problemResolutions.map(resolution => resolution.id);
            await axios.put(`/api/problem_resolution/${problemResolutionIds}`, {
                status_solution: "รอการแก้ไข",
            })
            const selectedUserEmails = meetingDetail?.SelectedUser?.map(user => user.email).filter(email => email) || [];
            const problemResolutionEmails = meetingDetail?.problemResolutions?.map(assign => assign.email_assign).filter(email => email) || [];

            const to = [...selectedUserEmails, ...problemResolutionEmails].join(',');
            await axios.post(`/api/send_email`, {
                to: to,
                subject: `Process Deviation`,
                html: `<p>รายงานความผิดปกติในกระบวนการผลิต</p>
                    <p><strong>หัวข้อ : </strong>${meetingDetail?.incidentReport[0]?.topic}</p>
                        <p><strong>ยังต้องแก้ไขเพิ่มเติม</strong></p>
              <a href="${`http://localhost:3000/manager_page/improved/${id}`}">คลิกเพื่อตรวจสอบ</a>
               `
            });
            console.log('Problem Resolution IDs:', problemResolutionIds);
            fetchMeeting(Number(id));
            router.back()
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
    }, [id]);


    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            {loading && <LoadingOverlay />}
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

                <div className='w-full  lg:flex md:flex gap-2 justify-between'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.topic_meeting}</p>
                    </div>
                    <div>
                        <a href={`/detail_deviation/${meetingDetail?.incident_report_id}`} className='flex gap-2 border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>
                            <svg className="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd" />
                            </svg>
                            รายละเอียด Deviation</a>
                    </div>

                </div>

                <div className="solution">
                    <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                            <tr className="bg-gray-300 text-center">
                                <th className="border border-black  px-4 py-2">ผู้รับผิดชอบ</th>
                                <th className="border border-black  px-4 py-2">หัวข้อการแก้ไช</th>
                                <th className="border border-black  px-4 py-2">วันที่กำหนดแก้ไข</th>
                                <th className="border border-black  px-4 py-2">วันที่แก้ไข</th>
                                <th className="border border-black  px-4 py-2">สถานะการแก้ไข</th>
                                <th className="border border-black  px-4 py-2">action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingDetail?.problemResolutions.map((problemSolution) => (
                                <tr key={problemSolution.id} className="hover:bg-gray-50 text-center items-center border border-black">
                                    <td className="border border-black px-4 py-2">{problemSolution.topic_solution}</td>
                                    <td className="border border-black px-4 py-2">{problemSolution.assign_to}</td>
                                    <td className="border border-black px-4 py-2">{problemSolution.target_finish ? new Date(problemSolution.target_finish.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}</td>
                                    <td className="border border-black px-4 py-2">
                                        {problemSolution.troubleshootSolutions && problemSolution.troubleshootSolutions.length > 0 && problemSolution.troubleshootSolutions[0].finish_date ? new Date(problemSolution.troubleshootSolutions[0].finish_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                                    </td>
                                    <td
                                        className={`border border-black px-4 py-2 ${problemSolution.status_solution === 'รอแก้ไข' ? 'bg-yellow-300' : problemSolution.status_solution === 'แก้ไขสำเร็จ' ? 'bg-green-300' : ''}`}
                                    >
                                        {problemSolution.status_solution}
                                    </td>
                                    <td className=" px-4 py-2 items-center flex justify-center">
                                        <a onClick={() => {
                                            setOpen(true);
                                            setProblemSolution(problemSolution);
                                        }} className='cursor-pointer underline font-black'>
                                            ดูการแก้ไช
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
                    onClick={handleReject}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ไม่อนุมัติ
                </a>
                <button onClick={handleSolution}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ส่งอนุมัติ
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className='px-4 py-4 justify-center items-center'>
                    <div>
                        {problemSolution && (
                            <>
                                <div className="solution">
                                    {problemSolution && problemSolution.troubleshootSolutions && problemSolution?.troubleshootSolutions.map((solution) => (
                                        <form key={solution.id} className='border border-black px-4 py-2'>
                                            <p>รายละเอียดการแก้ไข</p>
                                            <p className='ms-2 underline'>{solution.result_troubleshoot}</p>
                                            <p className='mt-4'>ไฟล์อัพโหลด</p>
                                            <p className='ms-2 underline'>
                                                <a href={`${process.env.NEXT_PUBLIC_STORAGE}${solution.file_summary}`} target='_blank' className='underline text-blue-500'>
                                                    {solution.file_summary?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                                </a></p>
                                            <p className='mt-4'>วันที่แก้ไข</p>
                                            <p className='ms-2 underline'>{solution.finish_date ? new Date(solution.finish_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}</p>
                                        </form>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

        </div>
    )
}