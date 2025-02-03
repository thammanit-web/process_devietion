'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'

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
    managerApproves: ManagerApprove[]
}
interface ManagerApprove {
    id: string
    meeting_id: string
    solution_id: string
    comment_solution: string
    comment_troubleshoot: string
}

export default function SetSolution() {
    const { id } = useParams()
    const router = useRouter()
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)
    const [managerApproves, setManagerApprove] = useState<ManagerApprove>({
        id: '',
        meeting_id: '',
        solution_id: '',
        comment_solution: '',
        comment_troubleshoot: ''
    })
    const [openApprove, setOpenApprove] = useState<boolean>(false);
    const [openReject, setOpenReject] = useState<boolean>(false);

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
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setManagerApprove((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
        setManagerApprove((prevState) => ({
            ...prevState,
        }));
    }, [id]);

    const handleManagerApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            await axios.post(`/api/manager_approve`, {
                ...managerApproves,
                meeting_id: Number(id),
                solution_id: meetingDetail?.problemResolutions[0]?.id,
            });
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...meetingDetail,
                manager_approve: "อนุมัติแล้ว",
            }
                , {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รอการแก้ไข",
            })
            fetchMeeting(Number(id));
            router.back()
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    const handleManagerReject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`/api/manager_approve`, {
                ...managerApproves,
                meeting_id: id,
                solution_id: meetingDetail?.problemResolutions[0]?.id,
            });
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...meetingDetail,
                manager_approve: "ไม่อนุมัติ",
            }
                , {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                    status_report: "รอการประชุม",
                })
            router.push('/')
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };



    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className="gap-4 grid mb-4">
                <p className='text-2xl font-semibold'>อนุมัติกำหนดการแก้ไข</p>
                <div className='w-full flex gap-2 '>
                    <div className="flex">
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการรายงาน</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.incidentReport[0]?.topic}</p>
                    </div>

                </div>

                <div className='w-full flex justify-between gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>
                            {meetingDetail?.topic_meeting}</p>
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
                                <tr>
                                    <th scope="col" className="px-6 py-3 border border-black">หัวข้อการแก้ไช</th>
                                    <th scope="col" className="px-6 py-3 border border-black">ผู้รับผิดชอบ</th>
                                    <th scope="col" className="px-6 py-3 border border-black">วันที่กำหนดแก้ไข</th>
                                    <th scope="col" className="px-6 py-3 border border-black">สถานะการแก้ไข</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meetingDetail?.problemResolutions?.map((resolution) => (
                                    <tr key={resolution.id} className="border border-black text-center text-md">
                                        <td className="border border-black px-6 py-2">{resolution.topic_solution}</td>
                                        <td className="border border-black px-6 py-2">{resolution.assign_to}</td>
                                        <td className="border border-black px-6 py-2">{resolution.target_finish ? new Date(resolution.target_finish.toString()).toLocaleDateString() : ''}</td>
                                        <td className={`border border-black px-4 py-2 text-white ${resolution.status_solution === 'รอการแก้ไข' ? 'bg-blue-600' : resolution.status_solution === 'แก้ไขสำเร็จ' ? 'bg-green-400' : ''}`}>
                                            {resolution.status_solution}
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>


            </div>
            <div className='gap-2 flex justify-end'>
                <a
                    onClick={() => setOpenReject(true)}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ไม่อนุมัติ
                </a>
                <button
                    onClick={() => setOpenApprove(true)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    อนุมัติ
                </button>
            </div>

            <Modal open={openApprove} onClose={() => setOpenApprove(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">กำหนดการแก้ไข</h1>
                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="grid justify-center gap-2">
                        <div className='comment'>
                            <div>
                                <h1>แสดงความคิดเห็น</h1>
                                <input
                                    value={managerApproves.comment_solution}
                                    type="text"
                                    name='comment_solution'
                                    id='comment_solution'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className='button mt-4 gap-2 flex'>
                            <button
                                className="border border-neutral-300 rounded-lg py-1.5 px-10
                           bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => setOpenApprove(false)}
                            >
                                ยกเลิก
                            </button>
                            <button className="border border-green-300 rounded-lg py-1.5 px-10
                           bg-green-400 hover:bg-green-600 text-white" onClick={handleManagerApprove}>
                                อนุมัติ
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={openReject} onClose={() => setOpenReject(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">กำหนดการแก้ไข</h1>
                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="flex flex-col justify-center gap-2">
                        <div className='comment'>
                            <div>
                                <h1>แสดงความคิดเห็น</h1>
                                <input
                                    value={managerApproves.comment_solution}
                                    type="text"
                                    name='comment_solution'
                                    id='comment_solution'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='button mt-4 gap-2 flex'>
                            <button
                                className="border border-neutral-300 rounded-lg py-1.5 px-10
                           bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => setOpenReject(false)}
                            >
                                ยกเลิก
                            </button>
                            <button className="border border-red-300 rounded-lg py-1.5 px-10
                           bg-red-500 hover:bg-red-600 text-white" onClick={handleManagerReject}>
                                อนุมัติ
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}