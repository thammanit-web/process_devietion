'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'
import { LoadingOverlay } from '@/app/components/loading'

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
    troubleshootSolutions: Troubleshoot[]
}
interface Troubleshoot {
    id: string
    solution_id: string
    result_troubleshoot: string
    file_summary: string
    finish_date: string
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
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [IsOpen, setIsOpen] = useState<boolean>(false);
    const [troubleShoots, setTroubleshoot] = useState<Troubleshoot>({
        id: '',
        solution_id: '',
        result_troubleshoot: '',
        file_summary: '',
        finish_date: '',

    })
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
            await axios.put(`/api/investigation_meeting/${id}`, {
                manager_approve: "รอตรวจสอบการแก้ไข",
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รอตรวจสอบการแก้ไข",
            })
            router.push('/maintenance_page')
        } catch (error) {
            alert('ส่งรีวิว error');
            console.error(error);
        }
    };
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
        if (problemSolution) {
            formData.append('solution_id', problemSolution.id);
        }
        try {
            setLoading(true)
            await axios.post('/api/troubleshoot_solution', formData);
            await axios.put(`/api/problem_resolution/${problemSolution?.id}`, {
                status_solution: "แก้ไขสำเร็จ",
            })
            fetchMeeting(Number(id));
            setLoading(false)
            setIsOpen(false);
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };
    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.delete(`/api/troubleshoot_solution/${problemSolution?.troubleshootSolutions[0].id}`)
            fetchMeeting(Number(id));
            setLoading(false)
            setOpen(false);
        } catch (error) {
            console.error("Error Delete report:", error)
        }
    }


    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
    }, [id]);


    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>

            {loading && <LoadingOverlay />}
            <div className="gap-4 grid mb-4">
                <p className='text-2xl font-semibold'>ดำเนินการแก้ไข</p>
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
                                    <td className="border border-black px-4 py-2">{problemSolution.target_finish ? new Date(problemSolution.target_finish.toString()).toLocaleDateString() : ''}</td>
                                    <td className="border border-black px-4 py-2">
                                        {problemSolution.troubleshootSolutions && problemSolution.troubleshootSolutions.length > 0 && problemSolution.troubleshootSolutions[0].finish_date ? new Date(problemSolution.troubleshootSolutions[0].finish_date.toString()).toLocaleDateString() : ''}
                                    </td>
                                    <td className={`border border-black px-4 py-2 text-white ${problemSolution.status_solution === 'รอการแก้ไข' ? 'bg-blue-600' : problemSolution.status_solution === 'แก้ไขสำเร็จ' ? 'bg-green-400' : ''}`}>
                                        {problemSolution.status_solution}
                                    </td>
                                    <td className=" px-4 py-2 items-center flex justify-center">
                                        {problemSolution.troubleshootSolutions.length === 0 ? (
                                            <a onClick={() => {
                                                setIsOpen(true);
                                            }} className='cursor-pointer underline font-black'>
                                                เพิ่มการแก้ไข
                                            </a>
                                        ) : (
                                            <a onClick={() => {
                                                setOpen(true);
                                                setProblemSolution(problemSolution);
                                            }} className='cursor-pointer underline font-black'>
                                                ดูการแก้ไช
                                            </a>
                                        )}
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
                <button onClick={(e) => {
                    if (!problemSolution || !meetingDetail?.problemResolutions.every(resolution => resolution.status_solution === "แก้ไขสำเร็จ")) {
                        alert('แก้ไขยังไม่เสร็จ');
                        return;
                    }
                    handleSolution(e);
                }}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ส่งรีวิว
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className='px-4 py-4 justify-center items-center'>
                    <div>
                        {problemSolution && (
                            <>
                                <div className="solution mt-6">
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
                                            <p className='ms-2 underline'>{solution.finish_date ? new Date(solution.finish_date.toString()).toLocaleDateString('en-GB') : ''}</p>
                                            <div className='flex justify-end w-full'>
                                                <a onClick={handleDelete} className='cursor-pointer justify-end text-red-500 px-2 rounded-sm'>
                                                    ลบ
                                                </a>
                                            </div>
                                        </form>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal open={IsOpen} onClose={() => setIsOpen(false)}>
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