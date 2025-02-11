'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export default function FirstPage() {
  const { data: session } = useSession();
  const [userDetails, setUsers] =  useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data)
      } catch (error) {
        alert("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const allowedTechnical = [
    "Maintenance Officer Mechanical",
    "Maintenance Officer Instrument and Electrical",
    "Maintenance Manager Department",
    "Maintenance Officer",
    "IT Officer"
  ];
  const allowedManager = [
    "Plant Manager",
    "IT Officer"
  ];
  const allowedMaintenance = [
    "Warehouse Section Head",
    "Warehouse and Logistic Officer",
    "Warehouse and Logistic Section Head",
    "IT Officer"
  ];

  const isAllowed = allowedTechnical.includes(userDetails?.jobTitle);
  const isAllowedManager = allowedManager.includes(userDetails?.jobTitle);
  const isAllowedMaintenance = allowedMaintenance.includes(userDetails?.jobTitle);

  return (
    <div className="overflow-x-auto mt-16 py-4">
      <div className='grid justify-center items-center'>
        <div className="flex justify-center gap-10 mb-6" >
          <a
            href="/production"
            className="md:text-lg sm:text-sm py-4 hover:bg-green-600 gap-2 text-white h-14 w-72 md:w-72 sm:w-36 flex items-center justify-center rounded-2xl bg-green-500 shadow-md drop-shadow-md border shadow-gray-200 hover:shadow-white">
            <svg className="w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
            </svg>
            กรอกคำร้อง Deviation
          </a>
        </div>
        <div className="flex justify-center gap-10" >
          <div className='grid justify-center gap-8'>

            <a href="/schedule" className={`md:text-lg sm:text-sm py-4 text-white h-14 w-72 flex items-center rounded-2xl 
              ${isAllowed ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 cursor-not-allowed opacity-50'}`}
            style={{ pointerEvents: isAllowed ? 'auto' : 'none' }}>
              <svg className="ms-2 mr-2 w-6 h-6 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18 5.05h1a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2h1v-1a1 1 0 1 1 2 0v1h3v-1a1 1 0 1 1 2 0v1h3v-1a1 1 0 1 1 2 0v1Zm-15 6v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8H3ZM11 18a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1Z" clipRule="evenodd" />
              </svg>
              ตรวจสอบและกำหนดวันประชุม
            </a>
            <a href="/maintenance_page"className={`md:text-lg sm:text-sm py-4 text-white h-14 w-72 flex items-center rounded-2xl 
              ${isAllowedMaintenance ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 cursor-not-allowed opacity-50'}`}
            style={{ pointerEvents: isAllowedMaintenance ? 'auto' : 'none' }}>
              <svg className="ms-2 mr-2  w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
              </svg>

              เพิ่มรายละเอียดการแก้ไข
            </a>
            <a href="/status" className="hover:bg-green-600 md:text-lg sm:text-sm gap-2 py-4 text-white h-14 w-72 md:w-72 sm:w-36 flex  rounded-2xl bg-green-500 shadow-md drop-shadow-md border shadow-gray-200 hover:shadow-white">
              <svg className="ms-2 mr-2  w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Zm2-5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm4 4a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0v-3Z" clipRule="evenodd" />
              </svg>

              การติดตามสถานะ Deviation
            </a>
          </div>


          <div className='grid justify-center gap-8'>

            <a href="/technical" className={`md:text-lg sm:text-sm py-4 text-white h-14 w-72 flex items-center rounded-2xl 
              ${isAllowed ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 cursor-not-allowed opacity-50'}`}
            style={{ pointerEvents: isAllowed ? 'auto' : 'none' }}>
              <svg className="ms-2 mr-2  w-6 h-6 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 5c.47 0 .917-.092 1.326-.26l1.967 1.967a1 1 0 0 0 1.414-1.414l-1.817-1.818A3.5 3.5 0 1 0 11.5 17Z" clipRule="evenodd" />
              </svg>
              วิเคราะห์และกำหนดการแก้ไข (สำหรับเทคนิค)</a>
            <a href="/manager_page" className={`md:text-lg sm:text-sm py-4 text-white h-14 w-72 flex items-center rounded-2xl 
              ${isAllowedManager ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 cursor-not-allowed opacity-50'}`}
            style={{ pointerEvents: isAllowedManager ? 'auto' : 'none' }}>
              <svg className="ms-2 mr-2  w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z" />
                <path fillRule="evenodd" d="M11 7V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm4.707 5.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
              </svg>
              สำหรับผู้อนุมัติ
            </a>
            <a href="/history" className="hover:bg-green-600 md:text-lg sm:text-sm gap-2 py-4 text-white h-14 w-72 md:w-72 sm:w-36 flex  rounded-2xl bg-green-500 shadow-md drop-shadow-md border shadow-gray-200 hover:shadow-white">
              <svg className="ms-2 w-6 h-6 text-gray-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5" />
              </svg>

              ประวัติ Deviation
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
