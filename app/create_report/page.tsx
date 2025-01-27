'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Modal } from '../components/modal';

interface IncidentForm {
    topic: string;
    machine_code: string;
    machine_name: string;
    incident_date: string;
    incident_description: string;
    category_report: string;
    summary_incident: string;
    reporter_name: string;
    report_date: string;
    priority: string;
    ReportFiles: {
        id: number;
        file_url?: string;
    }[];
}

export default function createReport() {
    const [formData, setFormData] = useState<IncidentForm>({
        topic: '',
        machine_code: '',
        machine_name: '',
        incident_date: '',
        incident_description: '',
        category_report: '',
        summary_incident: '',
        reporter_name: '',
        report_date: '',
        priority: '',
        ReportFiles: []
    });
    const [selectedOption, setSelectedOption] = useState('');
    const [open, setOpen] = useState<boolean>(false);
    const [incidentReportId, setIncidentReportId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    const router = useRouter();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData((prevState) => ({
            ...prevState,
            report_date: today
        }));

    }, []);

    const fetchReports = async () => {
        try {

            const response = await fetch(`/api/incident_report/${incidentReportId}`);

            if (!response.ok) {
                throw new Error('Incident not found');
            }

            const data = await response.json();
            setFormData(data);
        } catch (err) {
            console.log(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
    };


    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            category_report: selectedCategory,
            priority: ['Product quality!', 'Safety!', 'Emergency!'].includes(selectedCategory) ? 'Urgent' : 'Normal'
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedOption(formData.category_report);

        const incidentSummary = formData.summary_incident?.trim() === '' ? 'ไม่มีสาเหตุเบื้องต้น' : formData.summary_incident;

        try {
            const response = await axios.post('/api/incident_report', {
                ...formData,
                summary_incident: incidentSummary
            });

            setIncidentReportId(response.data.incidentReport.id);
            setOpen(true);

        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !incidentReportId) {
            alert("กรุณาเลือกไฟล์และยืนยันการรายงาน");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('incidentReportId', incidentReportId.toString());

        try {

            const response = await axios.post('/api/upload_reference', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchReports();
            alert("อัพโหลดไฟล์สำเร็จ");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("อัพโหลดไฟล์ไม่สำเร็จ");
        }
    };


    const handleBack = () => {
        router.push('/dashboard_submit');
    };
    const handleCancel = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.delete(`/api/incident_report/${incidentReportId}`)
            router.push('/dashboard_submit')
        } catch (error) {
            console.error("Error rejecting report:", error)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">แบบฟอร์มรายงานความผิดปกติ</h1>
            <form className="space-y-6">
                <div className="flex gap-4">
                    <div className='w-full'>
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                            หัวข้อ
                        </label>
                        <input
                            type="text"
                            name="topic"
                            id="topic"
                            required
                            value={formData.topic}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="category_report" className="block text-sm font-medium text-gray-700">
                            ประเภท
                        </label>
                        <div className="relative">
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                id="category_report"
                                value={formData.category_report}
                                required
                                onChange={handleCategoryChange}
                            >
                                <option>เลือกประเภท</option>
                                <option value="Product quality!">Product quality!</option>
                                <option value="Equipment failure">Equipment failure</option>
                                <option value="Safety!">Safety!</option>
                                <option value="Process condition">Process condition</option>
                                <option value="Emergency!">Emergency!</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="md:flex sm:grid-col gap-4">
                    <div className='w-full'>
                        <label htmlFor="machine_code" className="block text-sm font-medium text-gray-700">
                            รหัสเครื่องจักร
                        </label>
                        <input
                            type='text'
                            name="machine_code"
                            id="machine_code"
                            required
                            value={formData.machine_code}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>

                    <div className='w-full'>
                        <label htmlFor="machine_name" className="block text-sm font-medium text-gray-700">
                            ชื่อเครื่องจักร/อุปกรณ์
                        </label>
                        <input
                            type='text'
                            name="machine_name"
                            id="machine_name"
                            required
                            value={formData.machine_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>

                    <div className='w-full'>
                        <label htmlFor="incident_date" className="block text-sm font-medium text-gray-700">
                            วันที่เกิดเหตุและเวลาที่เกินเหตุ
                        </label>
                        <input
                            type='datetime-local'
                            name="incident_date"
                            id="incident_date"
                            required
                            value={formData.incident_date}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className='max-w-6xl'>
                        <label htmlFor="incident_description" className="block text-sm font-medium text-gray-700">
                            เหตุการณ์
                        </label>
                        <textarea
                            name="incident_description"
                            id="incident_description"
                            rows={6}
                            required
                            value={formData.incident_description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div className='max-w-6xl'>
                        <label htmlFor="summary_incident" className="block text-sm font-medium text-gray-700">
                            สาเหตุความผิดปกติเบื้องต้น (option)
                        </label>
                        <textarea
                            name="summary_incident"
                            id="summary_incident"
                            rows={4}
                            value={formData.summary_incident}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className='w-full'>
                        <label htmlFor="reporter_name" className="block text-sm font-medium text-gray-700">
                            ลงชื่อผู้รายงาน
                        </label>
                        <input
                            type='text'
                            name="reporter_name"
                            id="reporter_name"
                            required
                            value={formData.reporter_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>

                    <div className='w-full'>
                        <label htmlFor="report_date" className="block text-sm font-medium text-gray-700">
                            วันที่รายงาน
                        </label>
                        <input
                            type='date'
                            name="report_date"
                            id="report_date"
                            required
                            disabled
                            value={formData.report_date}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                </div>
            </form>
            <div className='gap-4 flex justify-end mt-4'>
                <button onClick={handleBack}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    ส่งรายงาน
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">ยืนยันการรายงานปัญหา</h1>
                    <p>อัพโหลดไฟล์ที่เกี่ยวข้อง</p>
                    <hr className="border-t-solid border-1 border-grey" />
                    <div>
                        <div className='flex gap-4'>
                            <p>ชื่อผู้รายงาน</p>
                            <p className='underline'>{formData.reporter_name}</p>
                            <p>วันที่รายงาน</p>
                            <p className='underline'>{formData.report_date ? new Date(formData.report_date.toString()).toLocaleString() : ''}</p>
                        </div>
                        <ul className='mb-4 text-lg underline'>
                            {formData.ReportFiles.map((file) => (
                                <li key={file.id} className="mt-1">
                                    <a href={file.file_url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                                        {file.file_url?.split('/').pop()?.split('-').slice(1).join('-') ?? ''}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                            เลือกไฟล์ (สูงสุด 5MB)
                        </label>
                        <div className='flex gap-2'>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.mp4"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <button
                                className="flex border hover:shadow-md rounded-lg py-1.5 px-4"
                                onClick={handleFileUpload}
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd" />
                                </svg>

                            </button>
                        </div>
                    </div>

                    <div className="flex flex-row justify-center gap-2">
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10 bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleCancel}
                        >
                            ยกเลิกส่งรายงาน
                        </button>
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={handleBack}
                        >
                            ยืนยันส่งรายงาน
                        </button>

                    </div>
                </div>
            </Modal>
        </div>
    )
}
