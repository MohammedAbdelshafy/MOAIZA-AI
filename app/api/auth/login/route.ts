import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual authentication logic
    // This is a placeholder for demonstration
    const mockUser = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'ESTIMATOR',
    };

    return NextResponse.json(
      {
        success: true,
        user: mockUser,
        token: 'mock-jwt-token',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
