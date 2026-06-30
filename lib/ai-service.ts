import { OpenAI } from 'openai';
import { BOQItem } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractionResult {
  boqItems: BOQItem[];
  missingInfo: string[];
  duplicates: string[];
  scopeGaps: string[];
  confidence: number;
}

export interface RiskAnalysisResult {
  quantityDiscrepancies: string[];
  missingSpecifications: string[];
  priceVolatilityRisks: string[];
  incompleteDrawings: boolean;
  unusualRates: string[];
  scopeGaps: string[];
}

export async function analyzeDocument(
  documentContent: string,
  documentType: string = 'tender'
): Promise<ExtractionResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert construction quantity surveyor and BOQ specialist. 
Analyze the provided ${documentType} document and extract all BOQ items with precision.
Return a JSON object with the following structure:
{
  "boqItems": [
    {
      "description": "Item description",
      "quantity": number,
      "unit": "unit of measurement",
      "specifications": "technical specifications",
      "tradeCategory": "category like Concrete, Steel, etc",
      "confidence": number between 0 and 1
    }
  ],
  "missingInfo": ["list of missing information"],
  "duplicates": ["list of potential duplicate items"],
  "scopeGaps": ["list of potential scope gaps"],
  "confidence": overall confidence score
}`,
        },
        {
          role: 'user',
          content: `Please analyze the following ${documentType} document and extract BOQ items:\n\n${documentContent}`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse JSON from response');

    const result = JSON.parse(jsonMatch[0]) as ExtractionResult;
    return result;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
}

export async function analyzeBOQForRisks(
  boqItems: BOQItem[],
  marketPrices: { [key: string]: number }
): Promise<RiskAnalysisResult> {
  try {
    const boqSummary = boqItems
      .map(
        (item) =>
          `${item.description}: ${item.quantity} ${item.unit} @ ${item.unitRate || 'N/A'} = ${item.totalCost || 'N/A'}`
      )
      .join('\n');

    const pricesSummary = Object.entries(marketPrices)
      .map(([item, price]) => `${item}: ${price}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a construction risk assessment expert. Analyze the provided BOQ and market prices 
to identify risks. Return a JSON object with this structure:
{
  "quantityDiscrepancies": ["list of items with suspicious quantities"],
  "missingSpecifications": ["items lacking specifications"],
  "priceVolatilityRisks": ["items with volatile market prices"],
  "incompleteDrawings": boolean,
  "unusualRates": ["items with unusual unit rates"],
  "scopeGaps": ["potential gaps in scope"]
}`,
        },
        {
          role: 'user',
          content: `BOQ Items:\n${boqSummary}\n\nMarket Prices:\n${pricesSummary}`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse JSON from response');

    return JSON.parse(jsonMatch[0]) as RiskAnalysisResult;
  } catch (error) {
    console.error('Error analyzing BOQ risks:', error);
    throw error;
  }
}

export async function generateBidRecommendation(
  estimatedCost: number,
  riskScore: number,
  marginTarget: number = 15
): Promise<{
  recommendedBid: number;
  bidRationale: string;
  riskAdjustment: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a construction bidding strategist. Recommend a bid amount based on estimated cost, 
risk factors, and market conditions. Return JSON:
{
  "recommendedBid": number,
  "bidRationale": "explanation of bid strategy",
  "riskAdjustment": percentage adjustment for risk
}`,
        },
        {
          role: 'user',
          content: `Estimated Cost: ${estimatedCost}, Risk Score: ${riskScore}/100, Target Margin: ${marginTarget}%`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty response');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse JSON');

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating bid recommendation:', error);
    throw error;
  }
}

export async function generateExecutiveSummary(
  tenderTitle: string,
  boqItems: BOQItem[],
  estimatedCost: number,
  recommendedBid: number,
  riskScore: number
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a construction executive summarist. Create a professional executive summary 
for a construction tender bid. Keep it concise and impactful.`,
        },
        {
          role: 'user',
          content: `
Tender: ${tenderTitle}
BOQ Items Count: ${boqItems.length}
Estimated Cost: ${estimatedCost}
Recommended Bid: ${recommendedBid}
Risk Score: ${riskScore}/100

Generate a professional executive summary highlighting key points and strategy.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}
