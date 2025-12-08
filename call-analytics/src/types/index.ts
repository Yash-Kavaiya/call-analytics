import { Timestamp } from 'firebase/firestore';

// User types
export type UserRole = 'owner' | 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Organization types
export type PlanType = 'starter' | 'professional' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  ownerId: string;
  callsThisMonth: number;
  callsLimit: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface OrganizationMember {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  joinedAt: Timestamp | Date;
}

// Call types
export type CallStatus = 'uploading' | 'processing' | 'transcribing' | 'analyzing' | 'completed' | 'failed';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Call {
  id: string;
  phoneNumber?: string;
  customerName?: string;
  duration: number; // seconds
  audioUrl: string;
  audioFileName: string;
  status: CallStatus;
  transcript?: TranscriptSegment[];
  sentiment?: SentimentType;
  sentimentScore?: number;
  topics?: string[];
  summary?: string;
  keywords?: string[];
  agentId?: string;
  agentName?: string;
  organizationId: string;
  createdAt: Timestamp | Date;
  analyzedAt?: Timestamp | Date;
  error?: string;
}

export interface TranscriptSegment {
  speaker: 'agent' | 'customer' | 'unknown';
  text: string;
  startTime: number;
  endTime: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Session types for NextAuth
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  plan: PlanType;
}

// Plan limits (updated for Razorpay pricing)
export const PLAN_LIMITS: Record<PlanType, { calls: number; members: number; retention: number; price: number }> = {
  starter: { calls: 10, members: 1, retention: 30, price: 0 },
  professional: { calls: 100, members: 5, retention: 90, price: 749 },
  enterprise: { calls: Infinity, members: Infinity, retention: Infinity, price: 16599 },
};
