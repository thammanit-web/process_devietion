'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    investigationMeetings: InvestigationMeeting[];
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
    meetingFiles: {
        id: number;
        file_url?: string;
    }[];
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
export default function detailVerify() {
    const { id } = useParams()
    const [report, setReport] = useState<IncidentReport | null>(null)
    const [meetingDetail, setMeetingDetail] = useState<InvestigationMeeting | null>(null)
    const [open, setOpen] = useState<boolean>(false);
    const [problemSolution, setProblemSolution] = useState<ProblemResolution | null>(null)
    const [openDetail, setOpenDetail] = useState(false);
    const router = useRouter()
    const reportRef = useRef<HTMLFormElement>(null); 
    

    const fetchIncidentReports = async (id: number) => {
        try {
            const res = await fetch(`/api/incident_report/${id}`)
            const data = await res.json()
            setReport(data)
        } catch (error) {
            console.error('Error fetching report:', error)
        }
    }
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

    const exportToPDF = () => {
        if (reportRef.current) {
            html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 10;

                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save(`Process_Deviation_${report?.ref_no}.pdf`);
            });
        }
    };

    // Export as Excel
    const exportToExcel = () => {
        if (!report) return;

        const worksheet = XLSX.utils.json_to_sheet([
            {
                'Priority': report.priority,
                'Reference No': report.ref_no,
                'Topic': report.topic,
                'Category': report.category_report,
                'Machine Code': report.machine_code,
                'Machine Name': report.machine_name,
                'Incident Date': report.incident_date,
                'Description': report.incident_description,
                'Reporter': report.reporter_name,
                'Report Date': report.report_date,
                'Status': report.status_report,
            },
        ]);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Incident Report');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, `Process_Deviation_${report.ref_no}.xlsx`);
    };

    useEffect(() => {
        if (id) {
            fetchIncidentReports(Number(id))
        }
    }, [id])

    useEffect(() => {
        if (report?.investigationMeetings[0]?.id) {
            fetchMeeting(Number(report?.investigationMeetings[0]?.id));
        }
    }, [report?.investigationMeetings[0]?.id]);

    if (!report) {
        return <div className='grid justify-center items-center h-screen'><div className='flex justify-center text-center items-center w-screen text-3xl font-bold'>Loading...</div></div>
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <div className='flex justify-between w-full'>
                <h1 className="lg:text-2xl md:text-xl sm:text-lg font-semibold mb-4">รายละเอียดการรายงาน {report.topic}</h1>
                <div className="flex gap-4 mt-6">
                    <button onClick={exportToPDF} className="border-red-500 border text-red-500 px-2 py-1 rounded-lg">Export PDF</button>
                    <button onClick={exportToExcel} className="border-red-500 border text-red-500 px-2 py-1 rounded-lg">Export Excel</button>
                </div>
            </div>
            <form className="space-y-6"  ref={reportRef}>
                <div className='flex gap-4' >
                    <div className='w-full flex gap-4'>
                        <p className='font-bold'>Priority</p>
                        <p className={`font-bold underline ${report.priority === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>{report.priority}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold '>Ref. No.</p>
                        <p className='underline'>{report.ref_no}</p>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold '>Topic</p>
                        <p className=' underline' >{report.topic}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-bold '>Category</p>
                        <p className='underline '>{report.category_report}</p>
                    </div>
                </div>

                <div className="lg:flex md:flex sm:grid gap-4">
                    <div className='w-full '>
                        <p className=''>รหัสเครื่องจักร</p>
                        <p className='border rounded-lg x-4 py-2'>{report.machine_code}</p>
                    </div>

                    <div className='w-full'>
                        <p className=''>ชื่อเครื่องจักร/อุปกรณ์</p>
                        <p className='border rounded-lg px-4 py-2'>{report.machine_name}</p>
                    </div>


                    <div className='w-full'>
                        <p className=''>วันและเวลาที่เกิดเหตุ</p>
                        <p className='border rounded-lg px-4 py-2'>{report.incident_date ? new Date(report.incident_date.toString()).toLocaleString() : ''}</p>
                    </div>

                </div>

                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className='w-full'>
                        <p className=''>เหตุการณ์</p>
                        <p className='border rounded-lg px-4 py-2'>{report.incident_description}</p>
                    </div>
                    <div className='w-full'>
                        <p className=''>สาเหตุความผิดปกติเบื้องต้น</p>
                        <p className='border rounded-lg px-4 py-2'>{report.summary_incident}</p>
                    </div>
                </div>
                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className="lg:grid md:grid sm:flex ">
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

                <div className="lg:flex md:flex sm:grid gap-4 w-full ">
                    <div className='lg:flex md:flex sm:flex '>
                        <p className='border px-4 py-2 underline'>ชื่อผู้รายงาน</p>
                        <p className='border px-4 py-2 text-red-600'>{report.reporter_name}</p>
                    </div>
                    <div className='lg:flex md:flex sm:flex lg:text-lg md:text-lg sm:text-sm'>
                        <p className='border px-4 py-2 underline'>วันที่รายงาน</p>
                        <p className='border px-4 py-2 text-red-600'>{report.report_date ? new Date(report.report_date.toString()).toLocaleDateString() : ''}</p>
                    </div>
                </div>

                <hr className="border-t-solid border-1 border-gray-300" />
                <h1 className="lg:text-xl md:text-xl sm:text-lg mb-4 underline">รายละเอียดการประชุม</h1>
                <div className="lg:flex md:flex sm:grid gap-4 w-full justify-center items-center">
                    <div>
                        <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 border border-black"> วันที่นัดประชุม</th>
                                    <th scope="col" className="px-6 py-3 border border-black">วันที่ประชุม</th>
                                    <th scope="col" className="px-6 py-3 border border-black">หัวข้อการประชุม</th>
                                    <th scope="col" className="px-6 py-3 border border-black"> รายละเอียดการประชุม</th>
                                    <th scope="col" className="px-6 py-3 border border-black"> การอนุมัติ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    report?.investigationMeetings?.map((meeting) => (
                                        <tr key={meeting.id} className="border border-black text-center text-md">
                                            <td className="px-6 py-2 border border-black">
                                                {meeting.scheduled_date ? new Date(meeting.scheduled_date).toLocaleDateString() : ''}
                                            </td>
                                            <td className="px-6 py-2 border border-black">
                                                {meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString() : ''}
                                            </td>
                                            <td className="px-6 py-2 border border-black">{meeting.topic_meeting}</td>
                                            <td className="px-6 py-2 border border-black">
                                                <a onClick={() => {
                                                    setOpenDetail(true);
                                                    setMeetingDetail(meeting)
                                                }} className='cursor-pointer underline font-black'>
                                                    ดูรายละเอียดการประชุม
                                                </a>
                                            </td>
                                            <td className="px-6 py-2 border border-black">{meeting.manager_approve}</td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>

                <hr className="border-t-solid border-1 border-gray-300" />
                <h1 className="lg:text-xl md:text-xl sm:text-lg mb-4 underline">การกำหนดการแก้ไข</h1>
                <div className="lg:flex md:flex sm:grid gap-4 w-full justify-center items-center">
                    <div>
                        <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400 text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3 border border-black">หัวข้อการแก้ไช</th>
                                    <th scope="col" className="px-6 py-3 border border-black">ผู้รับผิดชอบ</th>
                                    <th scope="col" className="px-6 py-3 border border-black">วันที่กำหนดแก้ไข</th>
                                    <th scope="col" className="px-6 py-3 border border-black">วันที่แก้ไข</th>
                                    <th scope="col" className="px-6 py-3 border border-black">สถานะการแก้ไข</th>
                                    <th scope="col" className="px-6 py-3 border border-black">การแก้ไข</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meetingDetail?.problemResolutions?.map((resolution) => (
                                    <tr key={resolution.id} className="border border-black text-center text-md">
                                        <td className="border border-black px-6 py-2">{resolution.topic_solution}</td>
                                        <td className="border border-black px-6 py-2">{resolution.assign_to}</td>
                                        <td className="border border-black px-6 py-2">{resolution.target_finish ? new Date(resolution.target_finish.toString()).toLocaleDateString() : ''}</td>
                                        <td className="border border-black px-6 py-2">
                                            {resolution.troubleshootSolutions[0]?.finish_date ? new Date(resolution.troubleshootSolutions[0]?.finish_date.toString()).toLocaleDateString() : ''}
                                        </td>
                                        <td className={`border border-black px-4 py-2 text-white ${resolution.status_solution === 'รอการแก้ไข' ? 'bg-blue-600' : resolution.status_solution === 'แก้ไขสำเร็จ' ? 'bg-green-400' : ''}`}>
                                            {resolution.status_solution}
                                        </td>
                                        <td className="px-6 py-2 border border-black">
                                            <a onClick={() => {
                                                setOpen(true);
                                                setProblemSolution(resolution);
                                            }} className='cursor-pointer underline font-black'>
                                                ดูการแก้ไช
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='gap-4 flex justify-end'>
                    <a onClick={router.back}
                        className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        กลับ
                    </a>
                </div>
            </form>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className='px-4 py-4 justify-center items-center'>
                    <div>
                        {problemSolution && (
                            <>
                                <div className="solution">
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
                                        </form>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
            <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
                <div className="flex flex-col gap-4 px-4">
                    <h1 className="text-xl font-black">รายละเอียดการประชุม</h1>
                    {meetingDetail && (
                        <>
                            <div>
                                <div className='w-full mb-4'>
                                    <label htmlFor="meeting_date" className="underline block text-sm font-medium text-gray-700">
                                        วันที่ประชุม
                                    </label>
                                    <div
                                        className="rounded-md mt-2 border border-black px-4 py-2"
                                    >{meetingDetail.meeting_date ? new Date(meetingDetail.meeting_date.toString()).toLocaleDateString() : ""}</div>
                                </div>
                                <div className='w-full mb-4'>
                                    <label htmlFor="summary_meeting" className="block text-sm underline font-medium text-gray-700">
                                        สรุปการประชุม
                                    </label>
                                    <div className="rounded-md mt-2 border border-black px-4 py-2"
                                    >{meetingDetail.summary_meeting}</div>
                                </div>

                                <p className='text-sm underline'>ไฟล์ที่เกี่ยวข้อง</p>
                                <div className="rounded-md mt-2 border border-black px-4 py-2">

                                    {
                                        meetingDetail.meetingFiles?.map((file) => (
                                            <li key={file.id}>
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
                        </>
                    )}
                </div>
            </Modal>
        </div>
    )
}