import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET() {
    return Response.json(await prisma.employee.findMany(
    ))
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { employee_name, employee_email,password,department } = await request.json();
    if (!employee_email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const existingUser = await prisma.employee.findUnique({
      where: { employee_email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
    const employee = await prisma.employee.create({
      data: {
        employee_name, employee_email,department,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { employeeId: employee.id, email: employee.employee_email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return NextResponse.json({ employee, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

