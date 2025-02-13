import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { subject, to, body,text,html } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: to,
            subject: subject,
            html: html,
        }
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json({ message: 'Error sending emails' }, { status: 500 });
    }
}
