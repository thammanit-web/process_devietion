'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'

interface IncidentReport {
    ref_no: string;
    topic: string;
    priority: string;
    investigationMeetings: InvestigationMeeting[];
}
interface InvestigationMeeting {
    id: string
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: string
    meetingFiles: {
        id: number;
        file_url?: string;
    }[];
    problemResolution: {
        id: number;
        manager_approve: string
        status_solution: string
    }[]
}

export default function investigationMeeting() {
    const { id } = useParams()
    const [report, setReport] = useState<IncidentReport | null>(null)
    const [Investigation, setInvestigation] = useState<InvestigationMeeting>({
        id: '',
        incident_report_id: '',
        topic_meeting: '',
        scheduled_date: '',
        meeting_date: '',
        summary_meeting: '',
        investigation_signature: '',
        manager_approve: '',
        meetingFiles: [],
        problemResolution: []
    })
    const [open, setOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)

    const router = useRouter()

    const fetchMeeting = async (meetingId: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${meetingId}`)
            const data = await respone.json()
            setMeetingDetail({
                ...data,
                meetingFiles: data.meetingFiles || [],
                problemResolution: data.problemResolution || []
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }

    const fetchIncidentReports = async (id: number) => {
        try {
            const res = await fetch(`/api/incident_report/${id}`)
            const data = await res.json()
            setReport({ ...data, investigationMeetings: data.investigationMeetings || [] })
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }


    useEffect(() => {
        if (id) {
            fetchIncidentReports(Number(id))
        }
        setInvestigation((prevState) => ({
            ...prevState
        }));
    }, [id])
    useEffect(() => {
        if (meetingDetail?.id) {
            fetchMeeting(Number(meetingDetail?.id))
        }
    }, [])

    const handleCreateMeeting = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvestigation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const CreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`/api/investigation_meeting`, {
                ...Investigation,
                incident_report_id: Number(id),
                manager_approve: ""
            })
            setOpen(false)
            fetchIncidentReports(Number(id))
        } catch (error) {
            console.error("Error approving report:", error)
        }
    }
    const openModal = (meetingId: string) => {
        setSelectedMeetingId(meetingId);
        setIsOpen(true);
    };

    if (!report) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-semibold mb-4">รายละเอียดการประชุม</h1>
            <div className='gap-4 grid mb-4'>
                <div className='flex'>
                    <div className='w-full flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Priority</p>
                        <p className={`py-2 font-bold underline border border-black px-4 ${report.priority === 'urgent' ? 'text-red-500' : 'text-blue-500'}`}>{report.priority}</p>
                    </div>

                </div>
                <div className='w-full  lg:flex md:flex'>
                    <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Topic</p>
                    <p className='lg:text-lg md:text-xs sm:text-xs underline border border-black px-4 py-2' >{report.topic}</p>
                    <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>Ref. No.</p>
                    <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{report.ref_no}</p>
                </div>
            </div>

            <div className='mt-6 mb-6'>
                <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-black"> วันที่นัดประชุม</th>
                            <th scope="col" className="px-6 py-3 border border-black">วันที่ประชุม</th>
                            <th scope="col" className="px-6 py-3 border border-black">หัวข้อการประชุม</th>
                            <th scope="col" className="px-6 py-3 border border-black"> รายละเอียดการประชุม</th>
                            <th scope="col" className="px-6 py-3 border border-black">การอนุมัติ</th>
                            <th scope="col" className="px-6 py-3 border border-black"> กำหนดการแก้ไข</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report?.investigationMeetings?.map((meeting) => (
                                <tr key={meeting.id} className="border border-black text-center text-md">
                                    <td className="px-6 py-2 border border-black">
                                        {meeting.scheduled_date ? new Date(meeting.scheduled_date).toLocaleString() : ''}
                                    </td>
                                    <td className="px-6 py-2 border border-black">
                                        {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleString() : ''}
                                    </td>
                                    <td className="px-6 py-2 border border-black">{meeting.topic_meeting}</td>
                                    <td className="px-6 py-2 border border-black">
                                        <div className='flex justify-center gap-6'>
                                            <div>
                                                <div className="relative group cursor-pointer">
                                                    <a href={`/technical/detail_meeting/${meeting.id}`} className='cursor-pointer underline font-bold'>
                                                        รายละเอียดการประชุม
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 border border-black" >{meeting?.manager_approve}</td>
                                    <td className="px-6 py-2 border flex items-center text-center justify-center gap-2">
                                        <div className="relative group">
                                            <a href={`/detail_report/set_solve/${meeting.id}`} className="cursor-pointer underline font-bold">
                                                กำหนดการแก้ไข
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>

            <div className='gap-2 flex justify-end'>
                <a
                    onClick={router.back}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">กำหนดวันประชุม</h1>
                    <div className='w-full'>
                        <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                            เลือกวันและเวลา
                        </label>
                        <input
                            type='datetime-local'
                            name="scheduled_date"
                            id="scheduled_date"
                            value={Investigation.scheduled_date}
                            onChange={handleCreateMeeting}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="topic_meeting" className="block text-sm font-medium text-gray-700">
                            หัวข้อการประชุม
                        </label>
                        <input
                            type='text'
                            name="topic_meeting"
                            id="topic_meeting"
                            required
                            value={Investigation.topic_meeting}
                            onChange={handleCreateMeeting}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>

                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="flex flex-row justify-center gap-2">
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10
               bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => setOpen(false)}
                        >
                            ยกเลิก
                        </button>
                        <button onClick={CreateMeeting} className="border border-green-300 rounded-lg py-1.5 px-10
               bg-green-400 hover:bg-green-600 text-white">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">รายละเอียดการประชุม</h1>
                    <div className='mt-6 mb-6'>
                        <div className='w-full mb-4'>
                            <label htmlFor="meeting_date" className="block text-lg underline font-medium text-gray-700">
                                วันที่ประชุม
                            </label>
                            <div
                                className="mt-1 text-lg block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >{Investigation.meeting_date ? new Date(Investigation.meeting_date.toString()).toLocaleDateString() : ""}</div>
                        </div>
                        <div className='w-full mb-4'>
                            <label htmlFor="summary_meeting" className="block text-lg underline font-medium text-gray-700">
                                สรุปการประชุม
                            </label>
                            <div className="mt-1 text-lg block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >{Investigation.summary_meeting}</div>
                        </div>

                        <p className='text-lg underline'>ไฟล์ที่เกี่ยวข้อง</p>
                        <div className='mb-4'>
                            {
                                Investigation.meetingFiles?.map((file) => (
                                    <li key={file.id} className="mt-1 border px-4 py-2">
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_STORAGE}${file.file_url}`}
                                            className="text-blue-500"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {file.file_url?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                        </a>
                                    </li>
                                )
                                )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}