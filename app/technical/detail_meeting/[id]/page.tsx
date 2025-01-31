'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
interface InvestigationMeeting {
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: string
    incidentReport:
    {
        id: number
        priority: string
        ref_no: string
        topic: string
    }[]
    meetingFiles: {
        id: number;
        file_url?: string;
    }[];
}

export default function updateMeeting() {
    const { id } = useParams()
    const [Investigation, setInvestigation] = useState<InvestigationMeeting>({
        incident_report_id: '',
        topic_meeting: '',
        scheduled_date: '',
        meeting_date: '',
        summary_meeting: '',
        investigation_signature: '',
        manager_approve: '',
        incidentReport: [],
        meetingFiles: []
    });
    const [meetingId, setMeetingId] = useState<number | null>(null);


    const router = useRouter()

    const fetchMeeting = async (id: number) => {
        try {

            const respone = await fetch(`/api/investigation_meeting/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingId(id)
            setInvestigation({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingFiles: Array.isArray(data?.meetingFiles) ? data.meetingFiles : []
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
    }, [id]);

    if (!Investigation) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-semibold mb-4">รายละเอียดการประชุม</h1>
            <div className='gap-4 grid mb-4'>

                <div className='w-full  lg:flex md:flex gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{Investigation.topic_meeting}</p>
                    </div>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>วันที่นัดประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>
                            {Investigation.scheduled_date ? new Date(Investigation.scheduled_date.toString()).toLocaleDateString() : ""}</p>
                    </div>
                </div>

            </div>

            <div className='mt-6 mb-6'>
                <div className='w-full mb-4'>
                    <label htmlFor="meeting_date" className="block text-lg underline font-medium text-gray-700">
                        วันที่ประชุม
                    </label>
                    <div
                        className="mt-1 text-lg boder border-black px-4 py-2 "
                    >
                        {Investigation.meeting_date ? new Date(Investigation.meeting_date.toString()).toLocaleDateString() : ""}
                    </div>
                </div>
                <div className='w-full mb-4'>
                    <label htmlFor="summary_meeting" className="block text-lg underline font-medium text-gray-700">
                        สรุปการประชุม
                    </label>
                    <div className="mt-1 text-lg boder border-black px-4 py-2"
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

            <div className='gap-2 flex justify-end'>
                <a
                    onClick={() => router.back()}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
            </div>

        </div>
    )
}