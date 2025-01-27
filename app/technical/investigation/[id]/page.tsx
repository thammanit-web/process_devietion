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
                manager_approve:""
            })
            setOpen(false)
            fetchIncidentReports(Number(id))
        } catch (error) {
            console.error("Error approving report:", error)
        }
    }

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

            <div>
                <button onClick={() => setOpen(true)} className='drop-shadow-lg shadow-md px-4 py-2 rounded-lg hover:bg-gray-100'>+ เพิ่มการประชุม</button>
            </div>

            <div className='mt-6 mb-6'>
                <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-black">
                                วันที่นัดประชุม
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                วันที่ประชุม
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                หัวข้อการประชุม
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                รายละเอียดการประชุม
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                การอนุมัติ
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                กำหนดการแก้ไข
                            </th>
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
                                        <div className="relative group">
                                            <a href={`/technical/update_meeting/${meeting.id}`} className="cursor-pointer underline">
                                                รายละเอียดการประชุม
                                            </a>
                                            <div className="absolute left-1/2 w-52 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-500 text-white text-xs rounded-md px-3 py-1">
                                                เพิ่มรายละเอียดการประชุม
                                                <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3">
                                                    <svg
                                                        className="w-6 h-6 text-gray-500 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 border border-black" >{meeting?.manager_approve}</td>
                                    <td className="px-6 py-2 border flex items-center text-center justify-center gap-2">
                                        <div className="relative group">
                                            <a href={`/technical/set_solution/${meeting.id}`} className="cursor-pointer px-1">
                                                <svg
                                                    className="w-[25px] h-[25px] text-gray-800 dark:text-white"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="1.6"
                                                        d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h4M9 3v4a1 1 0 0 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
                                                    />
                                                </svg>
                                            </a>
                                            <div className="absolute left-1/2 w-52 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-500 text-white text-xs rounded-md px-3 py-1">
                                                เพิ่มกำหนดการแก้ไข
                                                <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3">
                                                    <svg
                                                        className="w-6 h-6 text-gray-500 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
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
                    href='/technical'
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
        </div>
    )
}