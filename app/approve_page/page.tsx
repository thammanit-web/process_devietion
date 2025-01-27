'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import investigationMeeting from './[id]/page';

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
    id:string
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
  const [InMeetingReport, setInMeetingReport] = useState<IncidentReport[]>([]);

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
      <div className='flex justify-end items-between w-screen mb-4 mt-4'>
        <button
          onClick={handleLogout}
          className='mx-8 w-46 h-14 bg-trasparent px-4 border  text-gray-950 hover:text-gray-400 rounded-xl mt-4 shadow-md text-center items-center grid hover:bg-gray-100'>
          ออกจากระบบ
        </button>
      </div>

      <div className="relative overflow-x-auto mx-8 mb-16">
        <div className='text-lg mb-2'>รอยืนยันการตรวจสอบ</div>
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
                incident.status_report === "รออนุมัติกำหนดการแก้ไข"
              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) => incident.status_report === "รออนุมัติกำหนดการแก้ไข")
                  .map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center">
                      <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                      <td className="px-6 py-4 border border-black">{incident.topic}</td>
                      <td className={`text-white ${incident.priority === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {incident.priority}
                      </td>
                      <td className="px-6 py-4 border border-black">{incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString() : ''}</td>
                      <td className="px-6 py-4 border border-black">{incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 border border-black">{incident.reporter_name}</td>
                      <td className={` text-white ${incident.status_report === 'รออนุมัติการรายงานความผิดปกติ' ? 'bg-yellow-400' :
                        incident.status_report === 'รอยืนยันการตรวจสอบ' ? 'bg-orange-400' :
                          incident.status_report === 'รอการประชุม' ? 'bg-blue-400' :
                            incident.status_report === 'รอการอนุมัติการกำหนดการแก้ไข' ? 'bg-purple-400' :
                              incident.status_report === 'รอการแก้ไข' ? 'bg-red-400' :
                                incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'bg-indigo-400' :
                                  incident.status_report === 'รออนุมัติการแก้ไข' ? 'bg-teal-400' :
                                  incident.status_report === 'รออนุมัติกำหนดการแก้ไข' ? 'bg-teal-500' :
                                    incident.status_report === 'แก้ไขแล้ว' ? 'bg-green-400' :
                                      'bg-gray-400'
                        }`}>
                        {incident.status_report}
                      </td>
                      <td className="px-6 py-4 border border-black" data-tooltip-target="tooltip-default">
                        <Link href={`/approve_page/${incident.investigationMeetings[0]?.id}`} className='underline bg-green-400 px-3 py-3 rounded-xl text-white hover:text-gray-400'>อนุมัติ</Link>
                      </td>
                    </tr>
                  )))}
          </tbody>
        </table>
      </div>
   
    </div>
  );
}
