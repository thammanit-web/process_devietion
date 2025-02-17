'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal'
import { LoadingOverlay } from '@/app/components/loading'
import investigationMeeting from '@/app/technical/investigation/[id]/page'

interface IncidentReport {
    id: string;
    ref_no: string;
    topic: string;
    machine_code: string;
    machine_name: string;
    incident_date: string;
    incident_time: string;
    incident_description: string;
    priority: string;
    category_report: string;
    summary_incident: string;
    reporter_name: string;
    report_date: string;
    status_report: string;
    dead_approve?: string;
    ReportFiles: {
        id: number;
        file_url?: string;
    }[];
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
    file_meeting: string
    problemResolution: {
        id: number;
        manager_approve: string
        status_solution: string
    }[]
}
interface User {
    id: string;
    displayName: string | null;
    mail: string | null;
    jobTitle: string | null;
}

export default function AapproveReport() {
    const { id } = useParams()
    const [report, setReport] = useState<IncidentReport | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [Investigation, setInvestigation] = useState<InvestigationMeeting>({
        id: '',
        incident_report_id: '',
        topic_meeting: '',
        scheduled_date: '',
        meeting_date: '',
        summary_meeting: '',
        investigation_signature: '',
        manager_approve: '',
        file_meeting: '',
        problemResolution: []
    })
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const fetchIncidentReports = async (id: number) => {
        try {
            const res = await fetch(`/api/incident_report/${id}`)
            const data = await res.json()
            setReport(data)
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchIncidentReports(Number(id))
        } setInvestigation((prevState) => ({
            ...prevState
        }));
    }, [id])

    const handleCreateMeeting = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInvestigation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const CreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedUserEmails = users
            .filter(user => selectedUsers.includes(user.id))
            .map(user => user.mail);
        setLoading(true);
        try {
            if (selectedUserEmails.length > 0) {
                await axios.post("/api/send_email", {
                    to: selectedUserEmails.join(','),
                    subject: "Process Deviation",
                    html: `<p> <strong>กำหนดวันประชุม:</strong> ${Investigation.scheduled_date ? new Date(Investigation.scheduled_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                    <br><strong>หัวข้อการประชุม:</strong> ${Investigation.topic_meeting}
                    <br><a href="${`https://process-devietion-brown.vercel.app/technical/investigation/${id}`}" target="_blank">คลิก Link ตรวจสอบและอนุมัติ</a></p>`,
                });
            }

            await axios.put(`/api/incident_report/${id}`, {
                status_report: "รอการประชุม",
            });

            const userRequests = selectedUsers.map(userId => {
                const user = users.find(u => u.id === userId);
                if (!user) return alert("ไม่พบข้อมูลผู้ใช้");
                
                return {
                  userId,
                  display_name: user.displayName,
                  email: user.mail,
                };
              });
              
              try {
                const response = await axios.post(`/api/investigation_meeting`, {
                  ...Investigation,
                  incident_report_id: Number(id),
                  selectedUsers: userRequests,  
                });
              } catch (error) {
                console.error("Error creating investigation:", error);
              }
              

            router.back();
            fetchIncidentReports(Number(id));
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message);
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                if (!res.ok) throw new Error("Failed to fetch users");

                const data = await res.json();
                setUsers(data.value || []);
            } catch (error) {
                setError("Error fetching users");
            }
        };

        fetchUsers();
    }, []);


    const filteredUsers = users.filter(user =>
        user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        &&
        !['', 'Service'].includes(user.jobTitle ?? "")
    );

    const handleUserCheckboxChange = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleUserDelete = (userId: string) => {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
    };

    if (!report) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {loading && <LoadingOverlay />}
            <h1 className="text-2xl font-semibold mb-4">ยืนยันการตรวจสอบรายงาน</h1>
            <form className="space-y-6">
                <div className='flex gap-4'>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm'>Priority</p>
                        <p className={`font-bold underline ${report.priority === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>{report.priority}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm'>Ref. No.</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs'>{report.ref_no}</p>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm'>Topic</p>
                        <p className='lg:text-lg md:text-xs sm:text-xs underline' >{report.topic}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm'>Category</p>
                        <p className='underline lg:text-lg md:text-xs sm:text-xs'>{report.category_report}</p>
                    </div>
                </div>

                <div className="lg:flex md:flex sm:grid gap-4">
                    <div className='w-full '>
                        <p className='lg:text-lg md:text-sm sm:text-sm'>รหัสเครื่องจักร</p>
                        <p className='border rounded-lg px-4 py-2'>{report.machine_code}</p>
                    </div>

                    <div className='w-full'>
                        <p className='lg:text-lg md:text-sm sm:text-sm'>ชื่อเครื่องจักร/อุปกรณ์</p>
                        <p className='border rounded-lg px-4 py-2'>{report.machine_name}</p>
                    </div>


                    <div className='w-full'>
                        <p className='lg:text-lg md:text-sm sm:text-sm'>วันและเวลาที่เกิดเหตุ</p>
                        <p className='border rounded-lg px-4 py-2'>{report.incident_date ? new Date(report.incident_date.toString()).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) : ''}</p>
                    </div>

                </div>

                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className='w-full'>
                        <p className='lg:text-lg md:text-sm sm:text-sm'>เหตุการณ์</p>
                        <p className='border rounded-lg px-4 py-2'>{report.incident_description}</p>
                    </div>
                    <div className='w-full'>
                        <p className='lg:text-lg md:text-sm sm:text-sm'>สาเหตุความผิดปกติเบื้องต้น</p>
                        <p className='border rounded-lg px-4 py-2'>{report.summary_incident}</p>
                    </div>
                </div>

                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className="lg:grid md:grid sm:flex lg:text-lg md:text-lg sm:text-sm">
                        <p className="border px-4 py-2 underline">ไฟล์ประกอบการรายงาน</p>
                        {report.ReportFiles.length == 0 ? (
                            <div>
                                <p className="text-center py-4 font-bold text-lg border px-4">
                                    ไม่มีไฟล์ประกอบการตรวจสอบ!!
                                </p>
                            </div>
                        ) : (
                            report.ReportFiles?.map((file) => (
                                <li key={file.id} className="mt-1 border px-4 py-2">
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_STORAGE}${file.file_url}`}
                                        className="text-blue-500"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {file.file_url
                                            ?.split("/")
                                            .pop()
                                            ?.split("-")
                                            .slice(1)
                                            .join("-") ?? ""}
                                    </a>
                                </li>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className='lg:flex md:flex sm:flex lg:text-lg md:text-lg sm:text-sm'>
                        <p className='border px-4 py-2 underline'>ชื่อผู้รายงาน</p>
                        <p className='border px-4 py-2 text-red-600'>{report.reporter_name}</p>
                    </div>
                    <div className='lg:flex md:flex sm:flex lg:text-lg md:text-lg sm:text-sm'>
                        <p className='border px-4 py-2 underline'>วันที่รายงาน</p>
                        <p className='border px-4 py-2 text-red-600'>{report.report_date ? new Date(report.report_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}</p>
                    </div>
                </div>
            </form>
            <div className='gap-2 flex justify-end'>
                <a
                    onClick={router.back}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    กลับ
                </a>
                <button
                    onClick={() => setOpen(true)}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ยืนยันและกำหนดวันประชุม
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4 overflow-y-auto">
                    <h1 className="text-2xl justify-center">กำหนดวันประชุม</h1>
                    <div className='w-full'>
                        <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">
                            เลือกวันและเวลา
                        </label>
                        <input
                            type='date'
                            name="scheduled_date"
                            id="scheduled_date"
                            value={Investigation.scheduled_date}
                            onChange={handleCreateMeeting}
                            onClick={() => console.log(Investigation.scheduled_date)}
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

                    <div className='select-name'>
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">เลือกผู้มีส่วนเกี่ยวข้อง:</h3>
                            <ul className="list-disc pl-5 border py-2 px-4 rounded-lg">
                                {selectedUsers.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    return user ? (
                                        <li key={userId} className="flex justify-between">
                                            {user.displayName}
                                            <button
                                                onClick={() => handleUserDelete(userId)}
                                                className="text-red-500 ml-2 border boer-red-500 px-2"
                                            >
                                                X
                                            </button>
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        </div>
                        <div className="mb-4 px-4">
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อ"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border px-4 py-1 rounded-lg w-full"
                            />
                        </div>

                        <div className="flex flex-col mb-4 max-h-40 overflow-y-auto">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center mb-2 gap-2">
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        value={user.id}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserCheckboxChange(user.id)}
                                        className="ms-2 mt-2 rounded-sm"
                                    />
                                    <label htmlFor={`user-${user.id}`} className="text-sm">
                                        {user.displayName}
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        ({user.jobTitle})
                                    </span>
                                </div>
                            ))}
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