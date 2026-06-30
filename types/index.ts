// Auth types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'MANAGER' | 'ESTIMATOR' | 'VIEWER';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  phone: string;
}

// Tender types
export interface Tender {
  id: string;
  title: string;
  clientName: string;
  projectLocation: string;
  status: TenderStatus;
  estimatedCost?: number;
  recommendedBid?: number;
  expectedMargin?: number;
  riskScore?: number;
  bidStrategy: BidStrategy;
}

export type TenderStatus =
  | 'DRAFT'
  | 'UPLOADED'
  | 'ANALYZED'
  | 'REVIEWED'
  | 'BID_READY'
  | 'SUBMITTED'
  | 'WON'
  | 'LOST';

export type BidStrategy = 'AGGRESSIVE' | 'BALANCED' | 'CONSERVATIVE';

// BOQ types
export interface BOQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate?: number;
  totalCost?: number;
  confidence: number;
  tradeCategory?: string;
  specifications?: string;
}

// Cost types
export interface CostEstimate {
  materials: number;
  labor: number;
  equipment: number;
  transport: number;
  waste: number;
  overhead: number;
  profit: number;
  riskAllowance: number;
  total: number;
}

// Risk types
export interface RiskFlag {
  id: string;
  type: RiskType;
  severity: number;
  description: string;
  recommendation?: string;
}

export type RiskType =
  | 'QUANTITY_DISCREPANCY'
  | 'MISSING_SPECIFICATION'
  | 'PRICE_VOLATILITY'
  | 'INCOMPLETE_DRAWINGS'
  | 'UNUSUAL_RATE'
  | 'SCOPE_GAP'
  | 'DELIVERY_RISK'
  | 'REGULATION_CHANGE';

// Material types
export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentPrice?: number;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
}

// Report types
export interface Report {
  id: string;
  type: ReportType;
  tenderId: string;
  content?: string;
  generatedAt: Date;
}

export type ReportType =
  | 'BOQ_EXCEL'
  | 'COST_BREAKDOWN'
  | 'FINANCIAL_PROPOSAL'
  | 'TENDER_SUMMARY'
  | 'PDF_REPORT';

// Historical data
export interface HistoricalBid {
  id: string;
  clientName: string;
  projectName: string;
  estimatedCost: number;
  bidAmount: number;
  margin: number;
  status: 'WON' | 'LOST' | 'PENDING';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
