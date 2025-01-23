import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
export const dynamic = 'force-dynamic'; 
export async function POST(request: NextRequest) {
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: -1,
    path: '/',
  });

  return new NextResponse(
    JSON.stringify({ message: 'Logout successful' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    }
  );
}
