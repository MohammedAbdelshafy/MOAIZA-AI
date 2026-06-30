import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, companyName, country, city } =
      body;

    if (!email || !password || !firstName || !lastName || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Implement actual user registration and company creation
    // This is a placeholder for demonstration
    const mockCompany = {
      id: '1',
      name: companyName,
      country,
      city,
    };

    const mockUser = {
      id: '1',
      email,
      firstName,
      lastName,
      role: 'OWNER',
      companyId: mockCompany.id,
    };

    return NextResponse.json(
      {
        success: true,
        user: mockUser,
        company: mockCompany,
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
