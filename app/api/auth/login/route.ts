import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
export const dynamic = 'force-dynamic'; 
export async function POST(request: Request) {

  try {
    const { employee_email, password } = await request.json();

    if (!employee_email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { employee_email },
    });

    if (!employee) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { employeeId: employee.id, email: employee.employee_email ,department: employee.department},
      SECRET_KEY,
    );

    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2592000,
    });

    return new NextResponse(
      JSON.stringify({ message: 'Login successful', employee: { id: employee.id, employee_name: employee.employee_name,employee_email: employee.employee_email,department:employee.department } }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
