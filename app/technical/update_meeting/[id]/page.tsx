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

    const [open, setOpen] = useState<boolean>(false);
    const [meetingId, setMeetingId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


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
        setInvestigation((prevState) => ({
            ...prevState,
        }));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvestigation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            console.error("Invalid ID");
            return;
        }
        try {
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...Investigation,
                manager_approve:'รอกำหนดการแก้ไข'
            } );
           
            router.back()
            fetchMeeting(Number(id));
        } catch (error) {
            console.error("Error updating meeting:", error);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !meetingId) {
            alert("กรุณาเลือกไฟล์และยืนยันการรายงาน");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('meetingId', meetingId.toString());

        try {

            await axios.post('/api/file_meeting', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchMeeting(meetingId)
            alert("อัพโหลดไฟล์สำเร็จ");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("อัพโหลดไฟล์ไม่สำเร็จ");
        }
    };



    if (!Investigation) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    const meetingDate = Investigation.meeting_date
        ? new Date(Investigation.meeting_date)
        : new Date();
    const localDate = meetingDate.toISOString().slice(0, 16).replace('T', 'T');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-semibold mb-2">รายละเอียดการประชุม</h1>
            <div className='gap-4 grid mb-4'>
                {Investigation.incidentReport.map((incident) => (
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
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{Investigation.topic_meeting}</p>
                    </div>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>วันที่นัดประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>
                            {Investigation.scheduled_date ? new Date(Investigation.scheduled_date.toString()).toLocaleString() : ""}</p>
                    </div>
                </div>
            </div>

            <div className='mt-6 mb-6'>
                <div className='w-full mb-4'>
                    <label htmlFor="meeting_date" className="block text-sm font-medium text-gray-700">
                        วันที่ประชุม
                    </label>
                    <input
                        type='datetime-local'
                        name="meeting_date"
                        id="meeting_date"
                        value={localDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></input>
                </div>
                <div className='w-full mb-4'>
                    <label htmlFor="summary_meeting" className="block text-sm font-medium text-gray-700">
                        สรุปการประชุม
                    </label>
                    <textarea
                        name="summary_meeting"
                        id="summary_meeting"
                        rows={6}
                        required
                        value={Investigation.summary_meeting || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <p>อัพโหลดไฟล์ที่เกี่ยวข้อง</p>
                <hr className="border-t-solid border-1 border-grey" />
                <div>
                    <ul className='mb-4 text-lg underline'>
                        {Investigation.meetingFiles.map((file) => (
                            <li key={file.id} className="mt-1">
                                <a href={file.file_url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                    {file.file_url?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <label htmlFor="file" className="block text-xs text-gray-700">
                        เลือกไฟล์ (สูงสุด 5MB)
                    </label>
                    <div className='flex gap-2'>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.mp4"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                            className="flex border hover:shadow-md rounded-lg py-1.5 px-4"
                            onClick={handleFileUpload}
                        >
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd" />
                            </svg>

                        </button>
                    </div>
                </div>
            </div>

            <div className='gap-2 flex justify-end'>
                <a
                    onClick={() => router.back()}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
                <button onClick={() => setOpen(true)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    ยืนยัน
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">แก้ไขรายละเอียด</h1>


                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="flex flex-row justify-center gap-2">
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10
               bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => setOpen(false)}
                        >
                            ยกเลิก
                        </button>
                        <button onClick={updateMeeting} className="border border-green-300 rounded-lg py-1.5 px-10
               bg-green-400 hover:bg-green-600 text-white">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}