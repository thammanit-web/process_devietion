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
            router.push('/')
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
            router.push('/')
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
                <div className='w-full flex justify-between gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.topic_meeting}</p>
                    </div>
                    <div>
                        <a href={`/detail_report/${id}`} className='border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>รายละเอียดการรายงาน</a>
                    </div>
                </div>

                <div className="solution">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-300 text-center">
                                <th className="border border-gray-300 px-4 py-2">หัวข้อการแก้ไช</th>
                                <th className="border border-gray-300 px-4 py-2">ผู้รับผิดชอบ</th>
                                <th className="border border-gray-300 px-4 py-2">วันที่กำหนดแก้ไข</th>
                                <th className="border border-gray-300 px-4 py-2">วันที่แก้ไข</th>
                                <th className="border border-gray-300 px-4 py-2">การอนุมัติ</th>
                                <th className="border border-gray-300 px-4 py-2">สถานะการแก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingDetail?.problemResolutions.map((solution) => (
                                <tr key={solution.id} className="hover:bg-gray-50 text-center">
                                    <td className="border border-gray-300 px-4 py-2">{solution.topic_solution}</td>
                                    <td className="border border-gray-300 px-4 py-2">{solution.assign_to}</td>
                                    <td className="border border-gray-300 px-4 py-2">{solution.target_finish ? new Date(solution.target_finish.toString()).toLocaleDateString() : ''}</td>
                                    <td className="border border-gray-300 px-4 py-2"></td>
                                    <td className="border border-gray-300 px-4 py-2">{solution.manager_approve}</td>
                                    <td className="border border-gray-300 px-4 py-2">{solution.status_solution}</td>
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
                                <h1>ความคิดเห็นการกำหนดการแก้ไขปัญหา</h1>
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
                                <h1>ความคิดเห็นการกำหนดการแก้ไขปัญหา</h1>
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