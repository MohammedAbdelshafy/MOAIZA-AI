import { NextRequest, NextResponse } from 'next/server';
import {
  calculateCostEstimate,
  calculateBidAmount,
  calculateMargin,
  calculateWinningProbability,
} from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      materials,
      labor,
      equipment,
      transport,
      wastePercentage = 0.05,
      overheadPercentage = 0.1,
      profitPercentage = 0.15,
      riskPercentage = 0.05,
      bidStrategy = 'BALANCED',
      riskScore = 50,
    } = body;

    if (
      materials === undefined ||
      labor === undefined ||
      equipment === undefined ||
      transport === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing cost components' },
        { status: 400 }
      );
    }

    // Calculate cost estimate
    const costEstimate = calculateCostEstimate(
      materials,
      labor,
      equipment,
      transport,
      wastePercentage,
      overheadPercentage,
      profitPercentage,
      riskPercentage
    );

    // Calculate bid amount
    const recommendedBid = calculateBidAmount(costEstimate.total, bidStrategy);

    // Calculate margin
    const margin = calculateMargin(costEstimate.total, recommendedBid);

    // Estimate winning probability
    const winningProbability = calculateWinningProbability(
      margin,
      riskScore
    );

    const result = {
      costEstimate,
      bidStrategy,
      recommendedBid,
      margin,
      riskScore,
      winningProbability,
      timestamp: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Cost calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Cost calculation failed' },
      { status: 500 }
    );
  }
}
