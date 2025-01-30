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
          <a href="/dashboard_verify" className='border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>หน้าหลัก</a>
          <button
            onClick={handleLogout}
            className='border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
            </svg>
          </button>
        </div>
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
                incident.status_report === "รอยืนยันการตรวจสอบ"
              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) => incident.status_report === "รอยืนยันการตรวจสอบ")
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
                        <Link href={`/technical/approve_report/${incident.id}`} className='underline bg-red-500 px-3 py-3 rounded-xl text-white hover:text-gray-400'>ตรวจสอบ!</Link>
                      </td>
                    </tr>
                  )))}
          </tbody>
        </table>
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
                incident.status_report !== "แก้ไขแล้ว"
                && incident.status_report !== "รอยืนยันการตรวจสอบ"
                && incident.status_report !== "แก้ไขแล้ว"
                && incident.status_report !== "รออนุมัติการรายงานความผิดปกติ"

              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) =>
                  incident.status_report !== "แก้ไขแล้ว"
                  && incident.status_report !== "รอยืนยันการตรวจสอบ"
                  && incident.status_report !== "แก้ไขแล้ว"
                  && incident.status_report !== "รออนุมัติการรายงานความผิดปกติ"
                )
                  .map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center">
                      <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                      <td className="px-6 py-4 border border-black">{incident.topic}</td>
                      <td className={`text-white ${incident.priority === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {incident.priority}
                      </td>
                      <td className="px-6 py-4 border border-black">{incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString() : ''}</td>
                      <td className="px-6 py-4 border border-black">{incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4 border border-black">
                        {incident.investigationMeetings.length > 0 && incident.investigationMeetings[0].scheduled_date
                          ? new Date(incident.investigationMeetings[0].scheduled_date.toString()).toLocaleDateString()
                          : ''}
                      </td>
                      <td className="px-6 py-4 border border-black">{incident.reporter_name}</td>
                      <td className={` text-white ${incident.status_report === 'รออนุมัติการรายงานความผิดปกติ' ? 'bg-[#ff6347]' :
                        incident.status_report === 'รอยืนยันการตรวจสอบ' ? 'bg-[#32cd32]' :
                          incident.status_report === 'รอการประชุม' ? 'bg-[#1e90ff]' :
                            incident.status_report === 'รอการอนุมัติการกำหนดการแก้ไข' ? 'bg-[#ff1493]' :
                              incident.status_report === 'รอการแก้ไข' ? 'bg-[#ff4500]' :
                                incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'bg-[#8a2be2]' :
                                  incident.status_report === 'รออนุมัติการแก้ไข' ? 'bg-[#00bfff]' :
                                    incident.status_report === 'รออนุมัติกำหนดการแก้ไข' ? 'bg-[#adff2f]' :
                                      incident.status_report === 'แก้ไขแล้ว' ? 'bg-[#da70d6]' :
                                        'bg-[#808080]'
                        }`}>
                        {incident.status_report}
                      </td>
                        <td className="px-6 py-4 border border-black">
                        <Link 
                          href={incident.status_report === 'รอตรวจสอบการแก้ไข' 
                          ? `/technical/check_maintenance/${incident.investigationMeetings[0]?.id}` 
                          : `/technical/investigation/${incident.id}`} 
                          className='underline bg-blue-300 px-3 py-3 rounded-xl text-black hover:text-gray-400'>
                          {incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'รีวิวการแก้ไข' : 'ติดตามแก้ไข'}
                        </Link>
                        </td>

                    </tr>
                  )))
            }
          </tbody>
        </table>
      </div>

    </div>
  );
}
