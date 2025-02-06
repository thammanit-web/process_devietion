'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Modal } from '../../components/modal';
import { LoadingOverlay } from '@/app/components/loading';

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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [incidentReportId, setIncidentReportId] = useState<number | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData((prevState) => ({
            ...prevState,
            report_date: today
        }));

    }, []);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
    
        const maxSize = 5 * 1024 * 1024; 
        const allowedTypes = [
            "image/jpeg", "image/png", "application/pdf", 
            "video/mp4", "video/quicktime",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"
        ];
    
        const validFiles = Array.from(files).filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                alert(`Invalid file type: ${file.name}`);
                return false;
            }
            if (file.size > maxSize) {
                alert(`File too large: ${file.name} (max 5MB)`);
                return false;
            }
            return true;
        });
    
        if (validFiles.length > 0) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.topic || !formData.machine_code || !formData.machine_name || !formData.incident_date || !formData.incident_description || !formData.category_report) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        const incidentSummary = formData.summary_incident?.trim() === '' ? 'ไม่มีสาเหตุเบื้องต้น' : formData.summary_incident;

        const formDataWithFiles = new FormData();
        formDataWithFiles.append('topic', formData.topic);
        formDataWithFiles.append('machine_code', formData.machine_code);
        formDataWithFiles.append('machine_name', formData.machine_name);
        formDataWithFiles.append('incident_date', formData.incident_date);
        formDataWithFiles.append('incident_description', formData.incident_description);
        formDataWithFiles.append('category_report', formData.category_report);
        formDataWithFiles.append('summary_incident', incidentSummary);
        formDataWithFiles.append('reporter_name', formData.reporter_name);
        formDataWithFiles.append('report_date', formData.report_date);
        formDataWithFiles.append('priority', formData.priority);
        selectedFiles.forEach((file, index) => {
            formDataWithFiles.append('files', file);
        });
        try {
            setLoading(true);
            const response = await axios.post('/api/incident_report', formDataWithFiles, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setIncidentReportId(response.data.incidentReport.id);
            router.back();
        } catch (error: any) {
            alert(error);
        }
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };

    return (
        <div className="relative max-w-6xl mx-auto px-4 py-8">
            {loading && <LoadingOverlay />}
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

                <p>อัพโหลดไฟล์ที่เกี่ยวข้อง</p>
                <hr className="border-t-solid border-1 border-grey" />
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-400">เลือกไฟล์ (สูงสุด 5MB)</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.mp4"
                        multiple
                        onChange={handleFileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Selected Files:</h3>
                        <ul className="space-y-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center gap-16">
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(file)}
                                        className="text-red-500 hover:text-red-700 border border-black px-2"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {errorMessage && (
                    <div className="text-red-600">{errorMessage}</div>
                )}
            </form>
            <div className="flex gap-4 justify-end mt-4">
                <button
                    onClick={router.back}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={() => setOpen(true)}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    ส่งรายงาน
                </button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-2xl justify-center">ยืนยันการรายงาน</h1>
                    <p>
                    </p>
                    <hr className="border-t-solid border-1 border-grey" />
                    <div className="flex flex-row justify-center gap-2">
                        <button
                            className="border border-neutral-300 rounded-lg py-1.5 px-10
                         bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => setOpen(false)}
                        >
                            ยกเลิก
                        </button>
                        <button onClick={handleSubmit} className="border border-green-300 rounded-lg py-1.5 px-10
                         bg-green-400 hover:bg-green-600 text-white">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
