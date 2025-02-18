'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'
import investigationMeeting from '../../investigation/[id]/page'
import { LoadingOverlay } from '@/app/components/loading'
interface InvestigationMeeting {
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: Boolean
    SelectedUser: Array<{ userId: string }>;
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
    email_assign: string
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
    problemSolution: string
}
interface ManagerApprove {
    id: string
    meeting_id: string
    solution_id: string
    comment_solution: string
    comment_troubleshoot: string
}

interface User {
    id: string;
    displayName: string | null;
    mail: string | null;
    jobTitle: string | null;
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
        email_assign: '',
        target_finish: '',
        status_solution: '',
        manager_approve: '',
        troubleshootSolutions: [],
    })
    const [open, setOpen] = useState<boolean>(false);
    const [Isopen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | "">("");

    const fetchMeeting = async (id: number) => {
        try {
            const respone = await fetch(`/api/investigation_meeting/${id}`)
            const data = await respone.json()
            console.log("Fetched Data:", data);
            setMeetingDetail({
                ...data,
                incidentReport: data?.incidentReport ? [data.incidentReport] : [],
                meetingDetail: data.meetingDetail || [],
                managerApproves: data.managerApproves || []
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data.value || []);
            } catch (error) {
                alert("Error fetching users");
            }
        };

        fetchUsers();
    }, []);

    const CreateSolution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = users.find((u) => u.id === selectedUser);
            if (!user) return alert("ไม่พบข้อมูลผู้ใช้");
            setLoading(true)
            await axios.post(`/api/problem_resolution`, {
                ...problemResolution,
                assign_to: user.displayName,
                email_assign: user.mail,
                meeting_id: Number(id),
                status_solution: "รอการแก้ไข"
            });
            setLoading(false)
            fetchMeeting(Number(id));
            setOpen(false);
        } catch (error) {
            setLoading(false)
            alert('Create Solution error');
            console.error(error);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            ["IT Officer"].includes(user.jobTitle ?? "")
    );
    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedUserEmails = users
            .filter(user => selectedUser.includes(user.id))
            .map(user => user.mail);
        setLoading(true);

        try {
            setLoading(true)
            await axios.put(`/api/investigation_meeting/${id}`, {
                ...meetingDetail,
                manager_approve: "รออนุมัติกำหนดการแก้ไข",
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await axios.post(`/api/manager_approve`, {
                meeting_id: Number(meetingDetail?.problemResolutions[0].meeting_id),
                solution_id: Number(meetingDetail?.problemResolutions[0].id),
                comment_solution: '',
                comment_troubleshoot: ''
            });
            await axios.put(`/api/incident_report/${meetingDetail?.incident_report_id}`, {
                status_report: "รออนุมัติกำหนดการแก้ไข"
            })

            if (selectedUserEmails.length > 0) {
                await axios.post(`/api/send_email`, {
                    to: ["thammanitrinthang@gmail.com"],
                    subject: "Process Deviation",
                    html: `<p>รายงานความผิดปกติในกระบวนการผลิต</p>
<p style="margin-bottom: 10px;">หัวข้อ: ${meetingDetail?.topic_meeting}</p>
<a href="${`${process.env.URL}/manager_page/schedule/${id}`}">คลิกเพื่ออนุมัติ</a>`
                });
            }
            router.back()
        } catch (error) {
            setLoading(false)
            alert('ส่งอนุมัติ error');
            console.error(error);
        }
    };

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            {loading && <LoadingOverlay />}
            <div className="gap-4 grid mb-4">
                <div>
                    <p className='text-2xl font-semibold'>
                        การกำหนดการแก้ไข รายงาน {meetingDetail?.incidentReport[0]?.topic}
                    </p>
                </div>
                <div className='w-full  lg:flex md:flex gap-2'>
                    <div className='flex'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm border border-black px-4 py-2'>หัวข้อการประชุม</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs border border-black px-4 py-2'>{meetingDetail?.topic_meeting}</p>
                    </div>
                </div>
                <div>
                    <button onClick={() => setOpen(true)} className='border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>+ กำหนดการแก้ไข</button>
                </div>


                <div className="solution">
                    <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                            <tr className="border border-black text-center text-md">
                                <th className="border border-black px-4 py-2">หัวข้อการแก้ไช</th>
                                <th className="border border-black  px-4 py-2">ผู้รับผิดชอบ</th>
                                <th className="border border-black  px-4 py-2">วันที่กำหนดแก้ไข</th>
                                <th className="border border-black  px-4 py-2">วันที่แก้ไข</th>
                                <th className="border border-black  px-4 py-2">สถานะการแก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingDetail?.problemResolutions?.map((resolution) => (
                                <tr key={resolution.id} className="hover:bg-gray-50 text-center items-center">
                                    <td className="border border-black px-4 py-2">{resolution.topic_solution}</td>
                                    <td className="border border-black px-4 py-2">
                                        {resolution.assign_to}
                                    </td>
                                    <td className="border border-black px-4 py-2">{resolution.target_finish ? new Date(resolution.target_finish.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', }) : ''}</td>
                                    <td className="border border-black px-4 py-2">
                                        {resolution.troubleshootSolutions && resolution.troubleshootSolutions.length > 0 && resolution.troubleshootSolutions[0].finish_date ? new Date(resolution.troubleshootSolutions[0].finish_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                                    </td>
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
                    onClick={router.back}
                    className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
                <button
                    onClick={() => setIsOpen(true)}
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
                            type='date'
                            name="target_finish"
                            required
                            onChange={handleChange}
                            onClick={() => console.log(problemResolution)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="assign_to" className="block text-sm font-medium text-gray-700">
                            เลือกผู้รับผิดชอบ
                        </label>
                        <div className="w-full">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">-- เลือกผู้ใช้ --</option>
                                {filteredUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.displayName} ({user.jobTitle})
                                    </option>
                                ))}
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
            <Modal open={Isopen} onClose={() => setIsOpen(false)}>
                <div className="flex flex-col gap-4 px-4 py-4">
                    <h1 className="text-2xl justify-center">ยืนยันการกำหนดการแก้ไข</h1>
                    <p>
                    </p>
                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="flex flex-row justify-center gap-2">
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10
                                     bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            ยกเลิก
                        </button>
                        <button onClick={handleApprove} className="border border-green-300 rounded-lg py-1.5 px-10
                                     bg-green-400 hover:bg-green-600 text-white">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}