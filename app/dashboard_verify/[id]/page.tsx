'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface IncidentReport {
    priority: string;
    ref_no: string;
    topic: string;
    machine_code: string;
    machine_name: string;
    incident_date: string;
    incident_time: string;
    incident_description: string;
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


export default function detailVerify() {
    const { id } = useParams()
    const [report, setReport] = useState<IncidentReport | null>(null)

    const router = useRouter()

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
        }
    }, [id])

    if (!report) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <h1 className="lg:text-2xl md:text-xl sm:text-lg font-semibold mb-4">รายละเอียดการรายงาน {report.topic}</h1>
            <form className="space-y-6">
            <div className='flex gap-4'>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold lg:text-lg md:text-sm sm:text-sm'>Priority</p>
                        <p className={`font-bold underline ${report.priority === 'urgent' ? 'text-red-500' : 'text-blue-500'}`}>{report.priority}</p>
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
                        <p className='border rounded-lg px-4 py-2'>{report.incident_date ? new Date(report.incident_date.toString()).toLocaleString() : ''}</p>
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
                                        href={file.file_url}
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
                        <p className='border px-4 py-2 text-red-600'>{report.report_date ? new Date(report.report_date.toString()).toLocaleDateString() : ''}</p>
                    </div>
                </div>

                <div className='gap-4 flex justify-end'>
                    <a href='/dashboard_verify'
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        กลับ
                    </a>
                </div>
            </form>
        </div>
    )
}