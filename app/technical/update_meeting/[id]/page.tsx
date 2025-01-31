'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'
import investigationMeeting from '../../investigation/[id]/page'

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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


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
        const today = new Date().toISOString().slice(0, 16);
        setInvestigation((prevState) => ({
            ...prevState,
            meeting_date: today
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

        const formData = new FormData();
        formData.append("meeting_date", Investigation.meeting_date);
        formData.append("summary_meeting", Investigation.summary_meeting);

        selectedFiles.forEach((file, index) => {
            formData.append(`files`, file);
        });

        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }

        try {
            const response = await axios.put(`/api/investigation_meeting/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Update response:", response);
            router.back();
        } catch (error) {
            console.error("Error updating meeting:", error);
            alert("Failed to update meeting. Please check the data and try again.");
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles((prevFiles) => [
                ...prevFiles,
                ...Array.from(files),
            ]);
        }
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };

    if (!Investigation) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-semibold mb-4">เพิ่มรายละเอียดการประชุม</h1>
            <div className='gap-4 grid mb-4'>
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
                        type='date'
                        name="meeting_date"
                        id="meeting_date"
                        value={Investigation.meeting_date || ""}
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
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-400">เลือกไฟล์ (สูงสุด 5MB)</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.mp4"
                        multiple
                        onChange={handleFileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Selected Files:</h3>
                        <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center gap-4">
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(file)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


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