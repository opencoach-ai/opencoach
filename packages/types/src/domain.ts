// Core Domain Types                                                        
// These represent the business entities used across the entire system      

// ============ User Types ============

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  email: string;
  displayName?: string;
  timezone?: string;
}

// ============ Goal Types ============

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  startAt: Date | null;
  targetAt: Date | null;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalCategory =
  | 'steps'
  | 'sleep'
  | 'exercise'
  | 'nutrition'
  | 'weight'
  | 'mindfulness'
  | 'custom';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// ============ Health Metrics Types ============

export interface HealthMetric {
  id: string;
  userId: string;
  metricType: MetricType;
  value: number;
  unit: string;
  source: DataSource;
  sourceId: string | null;
  recordedAt: Date;
  createdAt: Date;
}

export type MetricType =
  | 'steps'
  | 'distance'
  | 'active_minutes'
  | 'calories_burned'
  | 'sleep_duration'
  | 'sleep_efficiency'
  | 'heart_rate'
  | 'heart_rate_variability'
  | 'blood_pressure_systolic'
  | 'blood_pressure_diastolic'
  | 'weight'
  | 'body_fat_percentage'
  | 'oxygen_saturation'
  | 'respiratory_rate';

export type DataSource =
  | 'apple_health'
  | 'google_fit'
  | 'fitbit'
  | 'whoop'
  | 'oura'
  | 'manual';

// ============ Data Source Connection Types ============

export interface DataSourceConnection {
  id: string;
  userId: string;
  source: DataSource;
  accessToken: string; // encrypted
  refreshToken: string | null; // encrypted
  tokenExpiresAt: Date | null;
  lastSyncAt: Date | null;
  syncStatus: 'connected' | 'error' | 'expired';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Session Types (for Gateway) ============

export interface Session {
  id: string;
  userId: string;
  type: 'main' | 'group';
  channel: string;
  channelId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  lastActiveAt: Date;
}

// ============ Message Types ============

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}
