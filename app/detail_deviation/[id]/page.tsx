'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Modal } from '@/app/components/modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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

                pdf.save(`Process Deviation ${report?.topic}.pdf`);
            });
        }
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
            <button onClick={router.back} className='rounded-full px-2 border py-2 border-gray-800 hover:border-gray-400'>
                <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                </svg>
            </button>
            <div className='flex justify-end w-full'>
                <button onClick={exportToPDF} className="border-red-500 border text-red-500 px-2 py-1 rounded-lg hover:text-red-300 hover:border-red-300">Export PDF</button>
            </div>

            <form className="gap-6 ms-10 grid" ref={reportRef}>
                <h1 className="lg:text-2xl md:text-xl sm:text-lg font-semibold mb-4">รายงานความผิดปกติในกระบวนการผลิต</h1>
                <div className="md:flex sm:grid gap-6">
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold'>Priority</p>
                        <p className={`font-semibold underline ${report.priority === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>{report.priority}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold '>Ref. No.</p>
                        <p className='underline'>{report.ref_no}</p>
                    </div>
                </div>
                <div className="md:flex sm:grid gap-6">
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold '>Topic</p>
                        <p className=' underline' >{report.topic}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold '>Category</p>
                        <p className='underline '>{report.category_report}</p>
                    </div>
                </div>

                <div className="md:flex sm:grid gap-6">
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold'>รหัสเครื่องจักร</p>
                        <p className=''>{report.machine_code}</p>
                    </div>

                    <div className='w-full flex gap-4'>
                        <p className='font-semibold'>ชื่อเครื่องจักร/อุปกรณ์</p>
                        <p className=''>{report.machine_name}</p>
                    </div>
                </div>


                <div className='w-full flex gap-4'>
                    <p className='font-semibold'>วันและเวลาที่เกิดเหตุ</p>
                    <p className=''>{report.incident_date ? new Date(report.incident_date.toString()).toLocaleString() : ''}</p>
                </div>



                <div className="md:flex sm:grid gap-6">
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold'>เหตุการณ์</p>
                        <p >{report.incident_description}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='font-semibold'>สาเหตุความผิดปกติเบื้องต้น</p>
                        <p >{report.summary_incident}</p>
                    </div>
                </div>
                <div className="lg:flex md:flex sm:grid gap-4 w-full">
                    <div className="lg:grid md:grid sm:flex ">
                        <p className="font-semibold">ไฟล์ประกอบการรายงาน</p>
                        {report.ReportFiles.length == 0 ? (
                            <div>
                                <p className="text-center mt-2">
                                    ไม่มีไฟล์ประกอบการตรวจสอบ!!
                                </p>
                            </div>
                        ) : (
                            report.ReportFiles?.map((file) => (
                                <li key={file.id} className="mt-1 ">
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

                <div className="md:flex sm:grid gap-6">
                    <div className='w-full flex gap-4'>
                        <p className='underline'>ชื่อผู้รายงาน</p>
                        <p className=' text-red-600'>{report.reporter_name}</p>
                    </div>
                    <div className='w-full flex gap-4'>
                        <p className='underline'>วันที่รายงาน</p>
                        <p className=' text-red-600'>{report.report_date ? new Date(report.report_date.toString()).toLocaleDateString() : ''}</p>
                    </div>
                </div>

                <hr className="border-t-solid border-1 border-gray-300" />
                <h1 className="lg:text-xl md:text-xl sm:text-lg mb-4 underline">รายละเอียดการประชุม</h1>
                {
                    report?.investigationMeetings?.filter((meeting) => meeting.manager_approve === 'อนุมัติแล้ว').length === 0
                        ? <p>ยังไม่ประชุม</p>
                        : report?.investigationMeetings
                            ?.filter((meeting) => meeting.manager_approve === 'อนุมัติแล้ว')
                            .map((meeting) => (
                                <div key={meeting.id}>
                                    <div className='ms-4 gap-6 grid'>
                                        <div className='flex gap-4'>
                                            <p className='font-semibold'>วันที่นัดประชุม</p>
                                            <p>{meeting.scheduled_date ? new Date(meeting.scheduled_date).toLocaleDateString() : ''}</p>
                                        </div>
                                        <div className='flex gap-4'>
                                            <p className='font-semibold'>วันที่ประชุม</p>
                                            <p>{meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString() : ''}</p>
                                        </div>
                                        <div className='flex gap-4'>
                                            <p className='font-semibold'>หัวข้อการประชุม</p>
                                            <p>{meeting.topic_meeting}</p>
                                        </div>
                                        <div className='grid gap-4'>
                                            <p className='font-semibold'>รายละเอียดการประชุม</p>
                                            <p className='ms-2'>{meeting.summary_meeting}</p>
                                        </div>
                                        <div className='grid gap-4'>
                                            <p className='font-semibold'>ไฟล์ที่เกี่ยวข้อง</p>
                                            <p>  {
                                                meeting.meetingFiles?.map((file) => (
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
                                                )}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                <hr className="border-t-solid border-1 border-gray-300" />
                <h1 className="lg:text-xl md:text-xl sm:text-lg mb-4 underline">การกำหนดการแก้ไข</h1>
                {
                    meetingDetail?.problemResolutions && meetingDetail.problemResolutions.length === 0
                        ? <p>ยังไม่กำหนดการแก้ไข</p>
                        : meetingDetail?.problemResolutions?.map((resolution) => (
                            <div key={resolution.id} className='ms-4 gap-6 grid border border-gray-600 justify-center py-4'>
                                <div className='flex gap-4'>
                                    <div className='flex gap-4'>
                                        <p className="font-semibold">หัวข้อการแก้ไช</p>
                                        <p>{resolution.topic_solution}</p>
                                    </div>
                                    <div className='flex gap-4'>
                                        <p className="font-semibold">ผู้รับผิดชอบ</p>
                                        <p>{resolution.assign_to}</p>
                                    </div>
                                    <div className='flex gap-4'>
                                        <p className="font-semibold">วันที่กำหนดแก้ไข</p>
                                        <p>{resolution.target_finish ? new Date(resolution.target_finish.toString()).toLocaleDateString() : ''}</p>
                                    </div>

                                    <div className='flex gap-4'>
                                        <p className="font-semibold">วันที่แก้ไข</p>
                                        <p>
                                            {resolution.troubleshootSolutions[0]?.finish_date ? new Date(resolution.troubleshootSolutions[0]?.finish_date.toString()).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                    <div className='flex gap-4'>
                                        <p className="font-semibold">สถานะการแก้ไข</p>
                                        <p>{resolution.status_solution}</p>
                                    </div>
                                </div>

                                <div>
                                    {
                                        resolution && resolution.troubleshootSolutions && resolution.troubleshootSolutions.length === 0
                                            ? <p>ยังไม่แก้ไข</p>
                                            : resolution?.troubleshootSolutions?.map((solution) => (
                                                <div key={solution.id} className=' gap-6 flex border border-gray-600 justify-center py-4'>
                                                    <div className='flex gap-4'>
                                                        <p className='font-semibold'>รายละเอียดการแก้ไข</p>
                                                        <p >{solution.result_troubleshoot}</p>
                                                    </div>
                                                    <div className='flex gap-4'>
                                                        <p className='font-semibold'>ไฟล์อัพโหลด</p>
                                                        <p>
                                                            <a href={`${process.env.NEXT_PUBLIC_STORAGE}${solution.file_summary}`} target='_blank' className='underline text-blue-500'>
                                                                {solution.file_summary?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                                            </a></p>
                                                    </div>
                                                    <div className='flex gap-4'>
                                                        <p className='font-semibold'>วันที่แก้ไข</p>
                                                        <p>{solution.finish_date ? new Date(solution.finish_date.toString()).toLocaleDateString('en-GB') : ''}</p>
                                                    </div>
                                                </div>
                                            ))}
                                </div>

                            </div>
                        ))}
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