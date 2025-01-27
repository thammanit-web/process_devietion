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
    assign_to: string
    target_finish: string
    status_solution: string
    manager_approve: string
}

export default function setSolution() {
    const { id } = useParams()
    const router = useRouter()
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)
    const [problemResolution, setProblemResolution] = useState<ProblemResolution>({
        id: '',
        meeting_id: '',
        topic_solution: '',
        assign_to: '',
        target_finish: '',
        status_solution: '',
        manager_approve: '',
    })
    const [open, setOpen] = useState<boolean>(false);

    const fetchMeeting = async (id: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingDetail({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingDetail: data.meetingDetail || []
            });
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedAssign = e.target.value;
        setProblemResolution((prevState) => ({
            ...prevState,
            assign_to: selectedAssign,
            [name]: value
        }));
    };

    useEffect(() => {
        if (id) {
            fetchMeeting(Number(id));
        }
        setProblemResolution((prevState) => ({
            ...prevState,
        }));
    }, [id]);

    const CreateSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`/api/problem_resolution`, {
                ...problemResolution,
                meeting_id: Number(id),
                manager_approve: "",
                status_solution: "รอแก้ไช"
            });
            fetchMeeting(Number(id));
            setOpen(false);
        } catch (error) {
            alert('Create Solution error');
            console.error(error);
        }
    };

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...meetingDetail,
                manager_approve: "รอการอนุมัติ",
            });
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รออนุมัติกำหนดการแก้ไข"
            })
            router.push('/technical')
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
                <div className='w-full  lg:flex md:flex gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.topic_meeting}</p>
                    </div>
                </div>
                <div>
                    <button onClick={() => setOpen(true)} className='drop-shadow-md shadow-md px-4 py-2 rounded-lg hover:bg-gray-100'>+ กำหนดการแก้ไข</button>
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
                    onClick={router.back}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
                <button
                    onClick={handleApprove}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ยืนยัน
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">กำหนดการแก้ไข</h1>
                    <div className='w-full'>
                        <label htmlFor="topic_solution" className="block text-sm font-medium text-gray-700">
                            หัวข้อการแก้ไข
                        </label>
                        <input
                            type='text'
                            name="topic_solution"
                            id="topic_solution"
                            value={problemResolution.topic_solution}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="target_finish" className="block text-sm font-medium text-gray-700">
                            กำหนดวันที่แก้ไข
                        </label>
                        <input
                            type='datetime-local'
                            name="target_finish"
                            id="target_finish"
                            required
                            value={problemResolution.target_finish}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="assign_to" className="block text-sm font-medium text-gray-700">
                            เลือกผู้รับผิดชอบ
                        </label>
                        <div className="relative">
                            <select

                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                name='assign_to'
                                id="assign_to"
                                value={problemResolution.assign_to}
                                onChange={handleChange}
                                required
                            >
                                <option></option>
                                <option value="นาย A">นาย A</option>
                                <option value="นาย A">นาย A</option>
                                <option value="นาย A">นาย A</option>
                                <option value="นาย A">นาย A</option>
                                <option value="นาย A">นาย A</option>
                            </select>
                        </div>
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
                        <button className="border border-green-300 rounded-lg py-1.5 px-10
                           bg-green-400 hover:bg-green-600 text-white" onClick={CreateSolution}>
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}