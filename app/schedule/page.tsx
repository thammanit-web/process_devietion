'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'

interface IncidentReport {
    id: number;
    ref_no: String
    priority: String
    topic: String
    machine_code: String
    machine_name: String
    incident_date: String
    incident_time: String
    incident_description: String
    total_time: String
    summary_incident: String
    reporter_name: String
    report_date: String
    status_report: String
    head_approve: String
    investigationMeetings: InvestigationMeeting[];
}
interface InvestigationMeeting {
    id: number;
    incident_report_id: string
    topic_meeting: string
    scheduled_date: string
    meeting_date: string
    summary_meeting: string
    investigation_signature: string
    manager_approve: Boolean
    file_meeting: string
}

export default function dashboardTechnical() {
    const [Incidentreports, setIncidentreport] = useState<IncidentReport[]>([]);

    const router = useRouter()

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axios.get('/api/incident_report')
            setIncidentreport(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogout = async () => {
        const response = await fetch('/api/auth/logout', { method: 'POST' });

        if (response.ok) {
            router.push('/');
        } else {
            console.error('Failed to logout');
        }
    };

    return (
        <div className="overflow-x-auto justify-center min-w-screen grid">
            <div className='flex justify-end w-screen mb-4 mt-4'>
                <div className='mx-8 flex gap-2'>
                    <a href="/" className='flex border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>
                        <svg className="w-5 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                        </svg>
                        หน้าหลัก
                    </a>
                </div>
            </div>

            <div className="relative overflow-x-auto mx-8 mb-16">
                <div className='text-lg mb-2'>รอตรวจสอบและกำหนดวันประชุม</div>
                <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                        <tr>
                            <th scope="col" className="px-6 py-3 border border-black">
                                Ref. No
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                Topic
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                Priority
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                วันที่เกิดเหตุ
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                วันที่รายงาน
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                ชื่อผู้รายงาน
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                สถานะ
                            </th>
                            <th scope="col" className="px-6 py-3 border border-black">
                                action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Incidentreports.filter((incident) =>
                                incident.status_report === "รอยืนยันการตรวจสอบ"
                            ).length == 0 ? (
                                <tr>
                                    <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                                </tr>
                            ) : (
                                Incidentreports.filter((incident) => incident.status_report === "รอยืนยันการตรวจสอบ")
                                    .map((incident) => (
                                        <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center cursor-pointer" onClick={()=>router.push(`/schedule/${incident.id}`)}>
                                            <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                                            <td className="px-6 py-4 border border-black">{incident.topic}</td>
                                            <td>
                                                <p className={`py-2 rounded-xl text-white ${incident.priority === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`}>{incident.priority}</p>
                                            </td>
                                            <td className="px-6 py-4 border border-black">{incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString() : ''}</td>
                                            <td className="px-6 py-4 border border-black">{incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString() : ''}</td>
                                            <td className="px-6 py-4 border border-black">{incident.reporter_name}</td>
                                            <td>
                                                <p className={`py-2 rounded-xl text-white ${incident.status_report === 'รออนุมัติการรายงานความผิดปกติ' ? 'bg-yellow-300' :
                                                    incident.status_report === 'รอยืนยันการตรวจสอบ' ? 'bg-yellow-300' :
                                                        incident.status_report === 'รอการประชุม' ? 'bg-blue-400' :
                                                            incident.status_report === 'รออนุมัติกำหนดการแก้ไข' ? 'bg-yellow-300' :
                                                                incident.status_report === 'รอการแก้ไข' ? 'bg-blue-600' :
                                                                    incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'bg-yellow-300' :
                                                                        incident.status_report === 'รออนุมัติการแก้ไข' ? 'bg-red-500' :
                                                                            incident.status_report === 'แก้ไขแล้ว' ? 'bg-green-400' :
                                                                                'bg-white'
                                                    }`}>
                                                    {incident.status_report}</p>
                                            </td>
                                            <td className="px-6 py-4 border border-black" data-tooltip-target="tooltip-default">
                                                <Link href={`/schedule/${incident.id}`} className='underline  rounded-xl text-black font-bold'>ตรวจสอบ</Link>
                                            </td>
                                        </tr>
                                    )))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
