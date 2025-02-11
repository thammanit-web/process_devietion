import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { emails, scheduled_date, topic_meeting } = await req.json();

        if (!emails || emails.length === 0) {
            return NextResponse.json({ message: "No emails provided" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'thammanitrinthang@gmail.com',
            to: emails.join(','),
            subject: `Process Deviation ${topic_meeting}`,
            text: `กำหนดวันประชุม: ${scheduled_date ? new Date(scheduled_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit'}) : ''}\nหัวข้อการประชุม: ${topic_meeting}`,
            html: `<p> <strong>กำหนดวันประชุม:</strong> ${scheduled_date ? new Date(scheduled_date.toString()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit'}) : ''}
            <br><strong>หัวข้อการประชุม:</strong> ${topic_meeting}
            <br><a href="${`http://localhost:3000/technical`}" target="_blank">คลิก Link ตรวจสอบและอนุมัติ</a></p>`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json({ message: 'Error sending emails' }, { status: 500 });
    }
}
