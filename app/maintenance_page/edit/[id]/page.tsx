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
    const [troubleShoots, setTroubleshoot] = useState<Troubleshoot>({
        id: '',
        solution_id: '',
        result_troubleshoot: '',
        file_summary: '',
        finish_date: '',

    })
    const [open, setOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);


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
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setTroubleshoot((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };
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

    const handleTroubleshoot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !troubleShoots.result_troubleshoot || !troubleShoots.finish_date) {
            alert('All fields are required.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('result_troubleshoot', troubleShoots.result_troubleshoot);
        formData.append('finish_date', troubleShoots.finish_date);
        formData.append('solution_id', id?.toString() || '');
        try {

            const response = await axios.post('/api/troubleshoot_solution', formData);
            fetchSolution(Number(id));
            setOpen(false);
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    const handleSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/problem_resolution/${id}`, {
                status_solution: "แก้ไขสำเร็จ",
            })
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รอตรวจสอบการแก้ไข",
            })

            fetchSolution(Number(id));
            router.push(`/maintenance_page/${problemSolution?.meeting_id}`)
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.delete(`/api/troubleshoot_solution/${problemSolution?.troubleshootSolutions[0].id}`)
            fetchSolution(Number(id));
        } catch (error) {
            console.error("Error Delete report:", error)
        }
    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className="gap-4 grid mb-4">

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
                                <th className="border border-black px-4 py-2">รายละเอียดการแก้ไข</th>
                                <th className="border border-black px-4 py-2">ไฟล์อัพโหลด</th>
                                <th className="border border-black px-4 py-2">วันที่แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problemSolution && problemSolution.troubleshootSolutions && problemSolution?.troubleshootSolutions.map((solution) => (
                                <tr key={solution.id} className="hover:bg-gray-50 text-center items-center border border-black">
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
                <a
                    onClick={handleSolution}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    บันทึก
                </a>
            </div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div>
                    <div >
                        <h1>รายละเอียดการแก้ไข</h1>
                        <textarea
                            value={troubleShoots.result_troubleshoot}
                            onChange={handleChange}
                            rows={6}
                            required
                            id='result_troubleshoot'
                            name='result_troubleshoot'
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        >
                        </textarea>
                    </div>
                    <div className='mt-4'>
                        <h1>วันที่แก้ไข</h1>
                        <input
                            type='datetime-local'
                            value={troubleShoots.finish_date}
                            onChange={handleChange}
                            required
                            id='finish_date'
                            name='finish_date'
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm '
                        >
                        </input>
                    </div>
                    <div className='mt-4'>
                        <h1>ไฟล์อัพโหลด</h1>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required
                            accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.mp4"
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        >
                        </input>
                    </div>
                    <div className='w-full justify-end flex'>
                        <a
                            onClick={handleTroubleshoot}
                            className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            บันทึก
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    )
}