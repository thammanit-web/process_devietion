'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { empty } from '@prisma/client/runtime/library';

interface IncidentReport {
    topic: string;
    machine_code: string;
    machine_name: string;
    incident_date: Date;
    incident_description: string;
    category_report: string;
    summary_incident: string;
    reporter_name: string;
    report_date: Date;
    priority: string;
    isOpen: boolean;
    selectedOption: string;
}

export default function Create() {
    const [topic, setTopic] = useState('')
    const [machine_code, setMachineCode] = useState('')
    const [machine_name, setMachineName] = useState('')
    const [incident_date, setIncidentDate] = useState('')
    const [incident_description, setIncidentDescription] = useState('')
    const [category_report, setCategoryReport] = useState<string>('');
    const [summary_incident, setSummaryIncident] = useState('')
    const [reporter_name, setReporterName] = useState('')
    const [report_date, setReportDate] = useState('')
    const [priority, setPriority] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const router = useRouter()

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setReportDate(today);
    }, []);
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setCategoryReport(selectedCategory);

        switch (selectedCategory) {
            case 'Product quality!':
            case 'Safety!':
            case 'Emergency!':
                setPriority('Urgent');
                break;
            case 'Equipment failure':
            case 'Process condition':
                setPriority('Normal');
                break;
            default:
                setPriority('Normal');
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedOption(category_report);
        setIsOpen(false);
        const incidentSummary = summary_incident?.trim() === '' ? 'ไม่มีสาเหตุเบื้องต้น' : summary_incident;

        try {
            await axios.post('/api/incident_report', {
                priority,
                topic,
                machine_code,
                machine_name,
                incident_date,
                incident_description,
                category_report,
                summary_incident:incidentSummary,
                reporter_name,
                report_date
            })
            router.push('/dashboard_submit')
        } catch (error) {
            console.error(error)
        }
    }

    const handleBack = () => {
        router.push('/dashboard_submit')
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
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
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
                                value={category_report}
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
                            value={machine_code}
                            onChange={(e) => setMachineCode(e.target.value)}
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
                            value={machine_name}
                            onChange={(e) => setMachineName(e.target.value)}
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
                            value={incident_date}
                            onChange={(e) => setIncidentDate(e.target.value)}
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
                            value={incident_description}
                            onChange={(e) => setIncidentDescription(e.target.value)}
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
                            value={summary_incident}
                            onChange={(e) => setSummaryIncident(e.target.value)}
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
                            value={reporter_name}
                            onChange={(e) => setReporterName(e.target.value)}
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
                            value={report_date}
                            onChange={(e) => setReportDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></input>
                    </div>
                </div>

                <div className='gap-4 flex justify-end'>
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
            </form>
        </div>
    )
}
