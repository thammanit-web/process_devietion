'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function DetailVerify() {
    const { id } = useParams();
    const [report, setReport] = useState<IncidentReport | null>(null);
    const router = useRouter();
    const reportRef = useRef<HTMLDivElement>(null); 

    const fetchIncidentReports = async (id: number) => {
        try {
            const res = await fetch(`/api/incident_report/${id}`);
            const data = await res.json();
            setReport(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchIncidentReports(Number(id));
        }
    }, [id]);

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
        saveAs(file, `Incident_Report_${report.ref_no}.xlsx`);
    };

    if (!report) {
        return <div className="grid justify-center items-center h-screen"><div className="flex justify-center text-center items-center w-screen text-3xl font-bold">Loading...</div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div ref={reportRef}>
                <h1 className="lg:text-2xl md:text-xl sm:text-lg font-semibold mb-4">รายละเอียดการรายงาน {report.topic}</h1>
                <p><strong>Priority:</strong> {report.priority}</p>
                <p><strong>Reference No:</strong> {report.ref_no}</p>
                <p><strong>Machine Code:</strong> {report.machine_code}</p>
                <p><strong>Machine Name:</strong> {report.machine_name}</p>
                <p><strong>Incident Date:</strong> {new Date(report.incident_date).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {report.incident_description}</p>
                <p><strong>Reporter:</strong> {report.reporter_name}</p>
                <p><strong>Report Date:</strong> {new Date(report.report_date).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-4 mt-6">
                <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
                <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">Export Excel</button>
            </div>

            <div className="mt-6">
                <button onClick={router.back} className="bg-gray-600 text-white px-4 py-2 rounded">กลับ</button>
            </div>
        </div>
    );
}
