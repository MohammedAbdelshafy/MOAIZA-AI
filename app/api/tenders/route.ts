import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch tenders from database for the authenticated company
    const mockTenders = [
      {
        id: '1',
        title: 'Metro Line Extension Project',
        clientName: 'Cairo Metro Authority',
        projectLocation: 'Cairo, Egypt',
        status: 'ANALYZED',
        estimatedCost: 50000000,
        recommendedBid: 55000000,
        riskScore: 35,
      },
      {
        id: '2',
        title: 'Residential Complex Development',
        clientName: 'New Cairo Development',
        projectLocation: 'New Cairo',
        status: 'DRAFT',
        estimatedCost: 25000000,
        recommendedBid: 27500000,
        riskScore: 45,
      },
    ];

    return NextResponse.json(
      {
        success: true,
        tenders: mockTenders,
        total: mockTenders.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tenders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, clientName, projectLocation, description } = body;

    if (!title || !clientName || !projectLocation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Create tender in database
    const newTender = {
      id: 'new-tender-id',
      title,
      clientName,
      projectLocation,
      description,
      status: 'DRAFT',
      createdAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        tender: newTender,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tender' },
      { status: 500 }
    );
  }
}
