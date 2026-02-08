// Agent Tool Interfaces
// These define the contracts for agent tools (functions agents can call)

// ============ Agent Tool Base ============

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  handler: ToolHandler;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, ToolProperty>;
  required?: string[];
}

export interface ToolProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
}

export type ToolHandler = (input: unknown) => Promise<ToolResult>;

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}

// ============ Data Science Agent Tools ============

export interface TrendAnalysisInput {
  metricType: string;
  timeRange: TimeRange;
  aggregation?: 'avg' | 'sum' | 'min' | 'max';
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface TrendAnalysisResult {
  metricType: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  dataPoints: Array<{
    timestamp: Date;
    value: number;
  }>;
  insight: string;
}

// ============ Domain Expert Agent Tools ============

export interface MetricInterpretationInput {
  metricType: string;
  value: number;
  unit: string;
  demographics?: Demographics;
}

export interface Demographics {
  age?: number;
  sex?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' |
'very_active';
}

export interface MetricInterpretationResult {
  metricType: string;
  value: number;
  status: 'low' | 'normal' | 'high' | 'critical';
  range: {
    min: number;
    max: number;
    optimal: { min: number; max: number };
  };
  interpretation: string;
  recommendations: string[];
}

// ============ Health Coach Agent Tools ============

export interface GoalSuggestionInput {
  userGoals: string[];
  currentMetrics: Record<string, number>;
  preferences?: {
    focusAreas?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface GoalSuggestionResult {
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
    targetValue: number;
    unit: string;
    timeframe: string;
    rationale: string;
  }>;
}

export interface MotivationalMessageInput {
  context: 'goal_achievement' | 'streak' | 'improvement' |
'encouragement';
  userGoal?: string;
  progress?: number;
}

export interface MotivationalMessageResult {
  message: string;
  tone: 'encouraging' | 'celebratory' | 'empathetic';
}

// ============ Agent Registry ============

export interface AgentDefinition {
  id: string;
  name: string;
  type: 'ds' | 'de' | 'hc';
  model: 'anthropic' | 'openai';
  systemPrompt: string;
  tools: AgentTool[];
  temperature?: number;
  maxTokens?: number;
}

export interface AgentRequest {
  agentId: string;
  sessionId: string;
  message: string;
  context?: {
    userId: string;
    conversationHistory?: ConversationMessage[];
  };
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AgentResponse {
  message: string;
  toolCalls?: ToolCall[];
  metadata: {
    agentId: string;
    model: string;
    tokensUsed: number;
  };
}

export interface ToolCall {
  tool: string;
  input: unknown;
  result: unknown;
}
