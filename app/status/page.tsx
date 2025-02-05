'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
interface IncidentReport {
  id:number
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

export default function DashboardVerify() {
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


  const exportToExcel = () => {
    if (Incidentreports.length === 0) {
      alert("No data to export!");
      return;
    }
    const formattedData =  Incidentreports.filter((incident) => incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รอยืนยันการตรวจสอบ" && incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รออนุมัติการรายงานความผิดปกติ")
    .map((report) => ({
      'Priority': report.priority,
      'Reference No': report.ref_no,
      'Topic': report.topic,
      'Category': report.category_report,
      'รหัสเครื่องจักร': report.machine_code,
      'ชื่อเครื่องจักร/อุปกรณ์': report.machine_name,
      'วันที่เกิดเหตุ': report.incident_date? new Date(report.incident_date).toLocaleString('en-GB', {day: '2-digit',month: '2-digit',year: '2-digit',hour: '2-digit', minute: '2-digit', hour12: false }):'',
      'เหตุการณ์': report.incident_description,
      'ผู้รายงานความผิดปกติ': report.reporter_name,
      'วันที่รายงาน': report.report_date? new Date(report.report_date).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: '2-digit',hour: '2-digit', minute: '2-digit', hour12: false }):'',
      'สถานะ': report.status_report,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
    worksheet['!cols'] = [
      { wch: 10 }, 
      { wch: 20 }, 
      { wch: 15 },
      { wch: 15 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 }, 
      { wch: 20 } 
    ];
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incident Reports");
  
    XLSX.writeFile(workbook, `Process Deviation.xlsx`);
  };

  return (
    <div className="overflow-x-auto justify-center min-w-screen grid">
      <div className='flex justify-end items-between w-screen mb-4 mt-4'>
        <div className='mx-8 flex gap-2'>
        <button onClick={exportToExcel} className="border-red-500 border text-red-500 px-2 py-1 rounded-lg hover:text-red-300 hover:border-red-300">Export Excel</button>
          <a href="/" className='flex border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>
            <svg className="w-5 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
            </svg>
            หน้าหลัก
          </a>
        </div>
      </div>

      <div className="relative overflow-x-auto mx-8 mb-16">
        <div className='text-lg mb-2'>การรายงานความผิดปกติในกระบวนการผลิต</div>
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
                วันและเวลาที่เกิดเหตุ
              </th>
              <th scope="col" className="px-6 py-3 border border-black">
                วันที่รายงาน
              </th>
              <th scope="col" className="px-6 py-3 border border-black">
                วันที่นัดประชุม
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
                incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รอยืนยันการตรวจสอบ" && incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รออนุมัติการรายงานความผิดปกติ"
              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) => incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รอยืนยันการตรวจสอบ" && incident.status_report !== "แก้ไขแล้ว" && incident.status_report !== "รออนุมัติการรายงานความผิดปกติ")
                  .map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center cursor-pointer" onClick={()=>router.push(`/detail_deviation/${incident.id}`)}>
                      <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                      <td className="px-6 py-4 border border-black">{incident.topic}</td>
                      <td>
                        <p className={`py-2 rounded-xl text-white ${incident.priority === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`}>{incident.priority}</p>
                      </td>
                      <td className="px-6 py-4 border border-black">{incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString('en-GB', {day: '2-digit',month: '2-digit',year: '2-digit',hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'}</td>
                      <td className="px-6 py-4 border border-black">{incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: '2-digit',hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'}</td>
                      <td className="px-6 py-4 border border-black">
                        {incident.investigationMeetings.length > 0 && incident.investigationMeetings[0].scheduled_date
                          ? new Date(incident.investigationMeetings[0].scheduled_date.toString()).toLocaleDateString('en-GB', {day: '2-digit',month: '2-digit',year: '2-digit',hour: '2-digit', minute: '2-digit', hour12: false })
                          : ''}
                      </td>
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
                      <td className="px-6 py-4 border border-black" ><Link href={`/detail_deviation/${incident.id}`} className='underline'>รายละอียด</Link></td>
                    </tr>
                  )))
            }
          </tbody>
        </table>
      </div>

    </div>
  );
}
