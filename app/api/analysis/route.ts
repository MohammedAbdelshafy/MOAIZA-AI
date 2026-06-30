import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument, analyzeBOQForRisks } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentContent, documentType = 'tender', tenderId } = body;

    if (!documentContent) {
      return NextResponse.json(
        { error: 'Document content is required' },
        { status: 400 }
      );
    }

    // Analyze document for BOQ extraction
    const extractionResult = await analyzeDocument(
      documentContent,
      documentType
    );

    // TODO: Save extraction results to database
    const analysis = {
      tenderId,
      status: 'ANALYZED',
      boqItems: extractionResult.boqItems,
      missingInfo: extractionResult.missingInfo,
      duplicates: extractionResult.duplicates,
      scopeGaps: extractionResult.scopeGaps,
      confidence: extractionResult.confidence,
      analyzedAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        analysis,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
