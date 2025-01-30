'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
}

export default function DashboardSubmit() {
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

  const hadleSubmitReport = () => {
    router.push('/create_report')
  }

  return (
    <div className="overflow-x-auto justify-center min-w-screen grid">
      <div className='flex justify-end items-between w-screen mb-4 mt-4'>

        <button
          onClick={hadleSubmitReport}
          className='mx-8 border px-4 py-2 border-gray-400 rounded-md hover:bg-gray-300'>
          + รายงานปัญหา
        </button>
      </div>

      <div className="relative overflow-x-auto mx-8 mb-16">
        <div className='text-lg mb-2'>รอยืนยันการรายงานความผิดปกติ</div>
        <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
          <thead className="text-center text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 border border-black">
                Ref. No
              </th>
              <th scope="col" className="px-6 py-3 border border-black">
                Topic
              </th>
              <th scope="col" className="px-6 py-3 border border-black">
                วันและเวลาเกิดเหตุ
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
                incident.status_report === "รออนุมัติการรายงานความผิดปกติ"
              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) => incident.status_report === "รออนุมัติการรายงานความผิดปกติ")
                  .map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center">
                      <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                      <td className="px-6 py-4 border border-black">{incident.topic}</td>
                      <td className="px-6 py-4 border border-black">
                        {incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border border-black">
                        {incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="px-6 py-4 border border-black">
                        <Link href={`/head_verify/${incident.id}`} className='underline'> {incident.reporter_name}</Link>

                      </td>
                      <td className={` text-white ${incident.status_report === 'รออนุมัติการรายงานความผิดปกติ' ? 'bg-yellow-400' :
                        incident.status_report === 'รอยืนยันการตรวจสอบ' ? 'bg-orange-400' :
                          incident.status_report === 'รอการประชุม' ? 'bg-blue-400' :
                            incident.status_report === 'รอการอนุมัติการกำหนดการแก้ไข' ? 'bg-purple-400' :
                              incident.status_report === 'รอการแก้ไข' ? 'bg-red-400' :
                                incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'bg-indigo-400' :
                                  incident.status_report === 'รออนุมัติการแก้ไข' ? 'bg-teal-400' :
                                    incident.status_report === 'แก้ไขแล้ว' ? 'bg-green-400' :
                                      'bg-gray-400'
                        }`}>
                        {incident.status_report}
                      </td>
                      <td className="px-6 py-4 border border-black" data-tooltip-target="tooltip-default">
                        <Link href={`/dashboard_submit/${incident.id}`} className='underline'>รายละอียด</Link>
                      </td>
                    </tr>
                  )))
            }
          </tbody>
        </table>
      </div>

      <div className="relative overflow-x-auto mx-8 mb-16">
        <div className='text-lg mb-2'>ประวัติการรายงานความผิดปกติ</div>
        <table className="table-auto min-w-max w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-black">
          <thead className="text-center text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 border border-black">
                Ref. No
              </th>
              <th scope="col" className="px-6 py-3 border border-black">
                Topic
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
                incident.status_report === "แก้ไขแล้ว"
              ).length == 0 ? (
                <tr>
                  <td colSpan={100} className='text-center py-4'>ไม่มีรายงานความผิดปกติ</td>
                </tr>
              ) : (
                Incidentreports.filter((incident) => incident.status_report === "แก้ไขแล้ว")
                  .map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-100 border border-black text-center">
                      <td className="px-6 py-4 border border-black">{incident.ref_no}</td>
                      <td className="px-6 py-4 border border-black">{incident.topic}</td>
                      <td className="px-6 py-4 border border-black">
                        {incident.incident_date ? new Date(incident.incident_date.toString()).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border border-black">
                        {incident.report_date ? new Date(incident.report_date.toString()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 border border-black">{incident.reporter_name}</td>
                      <td className={` text-white ${incident.status_report === 'รออนุมัติการรายงานความผิดปกติ' ? 'bg-yellow-400' :
                        incident.status_report === 'รอยืนยันการตรวจสอบ' ? 'bg-orange-400' :
                          incident.status_report === 'รอการประชุม' ? 'bg-blue-400' :
                            incident.status_report === 'รอการอนุมัติการกำหนดการแก้ไข' ? 'bg-purple-400' :
                              incident.status_report === 'รอการแก้ไข' ? 'bg-red-400' :
                                incident.status_report === 'รอตรวจสอบการแก้ไข' ? 'bg-indigo-400' :
                                  incident.status_report === 'รออนุมัติการแก้ไข' ? 'bg-teal-400' :
                                    incident.status_report === 'แก้ไขแล้ว' ? 'bg-green-400' :
                                      'bg-gray-400'
                        }`}>
                        {incident.status_report}
                      </td>
                      <td className="px-6 py-4 border border-black" data-tooltip-target="tooltip-default">
                        <Link href={`/detail_report/${incident.id}`} className='underline'>รายละอียด</Link>
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
