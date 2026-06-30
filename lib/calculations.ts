import { CostEstimate } from '@/types';

export function calculateCostEstimate(
  materials: number,
  labor: number,
  equipment: number,
  transport: number,
  wastePercentage: number = 0.05,
  overheadPercentage: number = 0.1,
  profitPercentage: number = 0.15,
  riskPercentage: number = 0.05
): CostEstimate {
  const subtotal = materials + labor + equipment + transport;
  const waste = subtotal * wastePercentage;
  const overhead = (subtotal + waste) * overheadPercentage;
  const profit = (subtotal + waste + overhead) * profitPercentage;
  const riskAllowance = (subtotal + waste + overhead + profit) * riskPercentage;

  return {
    materials,
    labor,
    equipment,
    transport,
    waste,
    overhead,
    profit,
    riskAllowance,
    total: subtotal + waste + overhead + profit + riskAllowance,
  };
}

export function calculateBidAmount(
  estimatedCost: number,
  strategy: 'AGGRESSIVE' | 'BALANCED' | 'CONSERVATIVE'
): number {
  const multipliers = {
    AGGRESSIVE: 1.05,
    BALANCED: 1.15,
    CONSERVATIVE: 1.25,
  };

  return estimatedCost * multipliers[strategy];
}

export function calculateMargin(
  estimatedCost: number,
  bidAmount: number
): number {
  return ((bidAmount - estimatedCost) / bidAmount) * 100;
}

export function calculateWinningProbability(
  margin: number,
  riskScore: number,
  historyWinRate: number = 0.5
): number {
  // Simple heuristic: higher margin = lower probability, higher risk = lower probability
  const marginFactor = Math.max(0, 1 - margin / 100);
  const riskFactor = 1 - riskScore / 100;
  const baseProbability = (marginFactor * 0.4 + riskFactor * 0.4 + historyWinRate * 0.2) * 100;

  return Math.max(0, Math.min(100, baseProbability));
}

export function formatCurrency(
  amount: number,
  currency: string = 'EGP'
): string {
  const symbols = {
    EGP: 'ج.م',
    USD: '$',
    AED: 'د.إ',
    SAR: '﷼',
  };

  return `${(amount / 1000000).toFixed(2)}M ${symbols[currency as keyof typeof symbols] || currency}`;
}

export function calculateRiskScore(
  discrepancies: number,
  missingInfo: number,
  incompleteDrawings: boolean,
  priceVolatility: number = 0
): number {
  let score = 0;

  score += Math.min(discrepancies * 10, 25);
  score += Math.min(missingInfo * 5, 20);
  score += incompleteDrawings ? 20 : 0;
  score += Math.min(priceVolatility * 2, 25);

  return Math.min(score, 100);
}

export function convertToArabic(text: string): string {
  // Simple Arabic number conversion
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function getFileSizeInMB(sizeInBytes: number): string {
  return (sizeInBytes / (1024 * 1024)).toFixed(2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getBoqCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Concrete': 'bg-blue-100 text-blue-800',
    'Steel': 'bg-gray-100 text-gray-800',
    'Sand': 'bg-yellow-100 text-yellow-800',
    'Labor': 'bg-green-100 text-green-800',
    'Equipment': 'bg-purple-100 text-purple-800',
    'Transport': 'bg-indigo-100 text-indigo-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'UPLOADED': 'bg-blue-100 text-blue-800',
    'ANALYZED': 'bg-indigo-100 text-indigo-800',
    'REVIEWED': 'bg-purple-100 text-purple-800',
    'BID_READY': 'bg-green-100 text-green-800',
    'SUBMITTED': 'bg-yellow-100 text-yellow-800',
    'WON': 'bg-green-100 text-green-800',
    'LOST': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
