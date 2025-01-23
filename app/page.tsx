'use client'
import React, { useEffect, useState } from 'react';

export default function FirstPage() {
  useEffect(() => {
  }, []);

  return (
    <div className="overflow-x-auto justify-center min-h-screen grid"
      style={{
        backgroundImage:
          "url('https://www.thainitrate.com/images/index/slider-1.JPG')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className='flex w-screen h-24 justify-between'>
        <div className="shrink-0 mt-4 ms-6">
          <img className="w-14 md:w-14 sm:w-8" src="https://www.thainitrate.com/images/tnc-logo.png" alt="ChitChat Logo" />
        </div>
        <div className='flex justify-center items-center flex-1'>
          <div className=' text-white text-center mt-4 lg:text-4xl md:text-sm sm:text-lg'>
            <h1 className='font-bold'>PROCESS DEVIATION INVESTIGATION FORM</h1>
            <h1 className='font-extralight'>รายงานความผิดปกติในกระบวนการผลิต</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-10 mb-14">
        <a
          href="/dashboard_submit"
          className="border border-black hover:border-white text-black hover:text-white h-40 md:h-40 sm:h-24 w-80 md:w-64 sm:w-36 flex items-center justify-center rounded-lg bg-gray-200 bg-opacity-50"
        >
          <div className="grid justify-center text-center">
            <h1 className="text-xl md:text-lg sm:text-base">รายงานความผิดปกติ</h1>
            <h1>&</h1>
            <h1 className="text-xl md:text-lg sm:text-base">ประวัติการรายงาน</h1>
          </div>
        </a>
        <a
          href="/dashboard_verify"
          className="border border-black hover:border-white text-black hover:text-white h-40 md:h-40 sm:h-24 w-80 md:w-64 sm:w-36 flex items-center justify-center rounded-lg bg-gray-200 bg-opacity-50"
        >
          <div className="grid justify-center text-center">
            <h1 className="text-xl md:text-lg sm:text-base">การตรวจสอบ
            </h1>
            <h1>&</h1>
            <h1 className="text-xl md:text-lg sm:text-base">
              อนุมัติ</h1>
          </div>
        </a>
      </div>
    </div>
  );
}
