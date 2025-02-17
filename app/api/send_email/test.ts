import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        console.log('Token Test helllo world:', token);

        if (!token || !token.accessToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { subject, to, html } = await request.json();

        const recipients = to.split(',').map((email: string) => ({
            emailAddress: { address: email.trim() }
        }));

        const sendEmail = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: {
                    subject: subject,
                    body: { contentType: 'HTML', content: html },
                    toRecipients: recipients,
                },
            }),
        });

        if (!sendEmail.ok) {
            throw new Error(`Graph API Error: ${await sendEmail.text()}`);
        }

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
    }
}
