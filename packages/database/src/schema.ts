import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  decimal,
  jsonb,
  boolean,
  index,
} from 'drizzle-orm/pg-core';                                                              
                                                                                                                                       
// 1. USERS - User accounts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  timezone: text('timezone').default('UTC'),
  preferences: jsonb('preferences').$type<{
    language?: string;
    units?: 'metric' | 'imperial';
    notificationsEnabled?: boolean;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. OAUTH_CONNECTIONS - OAuth tokens for health platforms
export const oauthConnections = pgTable('oauth_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'apple_health', 'google_health', 'fitbit', 'whoop', 'oura'
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  scopes: jsonb('scopes').$type<string[]>(),
  metadata: jsonb('metadata'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastSyncAt: timestamp('last_sync_at'),
});

// 3. HEALTH_METRICS - Time-series health data (THE BIG TABLE)
export const healthMetrics = pgTable('health_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  metricType: text('metric_type').notNull(), // 'steps', 'sleep_duration','heart_rate', 'hrv', etc.
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(), // 'count', 'hours', 'bpm', 'ms', etc.
  timestamp: timestamp('timestamp').notNull(),
  source: text('source').notNull(), // 'apple_health', 'fitbit', 'manual', etc.
  metadata: jsonb('metadata'), // Additional data (e.g., sleep stages, GPScoordinates)
}, (table) => ({
  // Index for time-series queries (CRITICAL for performance)
  timestampIdx: index('health_metrics_timestamp_idx').on(table.timestamp),
  // Compound index for user-specific time queries
  userTimestampIdx: index('health_metrics_user_timestamp_idx').on(table.userId, table.timestamp),
  // Index for metric type queries
  metricTypeIdx: index('health_metrics_metric_type_idx').on(table.metricType),
}));

// 4. WORKOUTS - Exercise sessions
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'running', 'cycling', 'swimming', 'weight_training', etc.
  duration: integer('duration').notNull(), // in minutes
  calories: integer('calories'),
  distance: decimal('distance', { precision: 10, scale: 2 }), // in km
  averageHeartRate: integer('average_heart_rate'), // in bpm
  maxHeartRate: integer('max_heart_rate'), // in bpm
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  metadata: jsonb('metadata'), // GPS route, splits, elevation, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. GOALS - User health goals
export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  metricType: text('metric_type').notNull(), // 'steps', 'workouts_per_week', 'sleep_duration', etc.
  targetValue: decimal('target_value', { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal('current_value', { precision: 10, scale: 2
}).default('0'),
  unit: text('unit').notNull(),
  deadline: timestamp('deadline'),
  status: text('status').notNull().default('active'), // 'active', 'completed', 'paused', 'cancelled'
  milestones: jsonb('milestones').$type<Array<{
    targetValue: number;
    deadline: Date;
    achieved: boolean;
  }>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// 6. COACHING_SESSIONS - AI coaching conversation history
export const coachingSessions = pgTable('coaching_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentType: text('agent_type').notNull(), // 'data_science', 'domain_expert', 'health_coach'
  transcript: jsonb('transcript').$type<Array<{
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
  }>>().notNull(),
  insights: jsonb('insights'), // Key takeaways from the session
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. AGENT_EVENTS - Agent decision logs (for debugging and transparency)
export const agentEvents = pgTable('agent_events', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentType: text('agent_type').notNull(),
  action: text('action').notNull(), // 'analyze_trend', 'interpret_metric', 'suggest_goal', etc.
  reasoning: text('reasoning').notNull(), // Why the agent took this action
  input: jsonb('input'), // What data the agent received
  output: jsonb('output'), // What the agent produced
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  // Index for querying recent agent events
  timestampIdx: index('agent_events_timestamp_idx').on(table.timestamp),
}));

// 8. HEALTH_LITERATURE - Scientific research papers (with pgvector)
export const healthLiterature = pgTable('health_literature', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authors: jsonb('authors').$type<string[]>().notNull(),
  abstract: text('abstract').notNull(),
  publicationDate: timestamp('publication_date'),
  journal: text('journal'),
  doi: text('doi'), // Digital Object Identifier
  keywords: jsonb('keywords').$type<string[]>(),
  embedding: jsonb('embedding'), // Will store vector as JSON array (pgvector creates special column type)
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Index for text search
  titleIdx: index('health_literature_title_idx').on(table.title),
}));

// 9. MESSAGING_CONNECTIONS - Connected platforms (WhatsApp, Telegram, Discord)
export const messagingConnections = pgTable('messaging_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // 'whatsapp', 'telegram', 'discord'
  platformUserId: text('platform_user_id').notNull(), // Phone number, chat ID, etc.
  credentials: jsonb('credentials'), // Encrypted auth tokens
  isActive: boolean('is_active').default(true),
  preferences: jsonb('preferences'), // User settings per platform
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at'),
});

// 10. CONVERSATIONS - Chat sessions per channel
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  platformConversationId: text('platform_conversation_id').notNull(), // External platform's chat ID
  status: text('status').notNull().default('active'), // 'active', 'archived', 'closed'
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at'),
}, (table) => ({
  // Index for finding active conversations
  userPlatformIdx: index('conversations_user_platform_idx').on(table.userId, table.platform),
}));

// 11. MESSAGES - Individual messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() =>
  conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user', 'agent', 'system'
  content: text('content').notNull(),
  messageType: text('message_type').notNull().default('text'), // 'text', 'image', 'file', 'interactive'
  metadata: jsonb('metadata'), // Buttons, attachments, etc.
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => ({
  // Index for fetching conversation history
  conversationIdx: index('messages_conversation_idx').on(table.conversationId, table.timestamp),
}));

// 12. PROACTIVE_MESSAGES - Scheduled check-ins and reminders
export const proactiveMessages = pgTable('proactive_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  messageType: text('message_type').notNull(), // 'daily_check_in', 'goal_reminder', 'weekly_summary'
  content: text('content').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'sent', 'failed', 'cancelled'
  platform: text('platform').notNull(), // Where to send
  metadata: jsonb('metadata'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  // Index for finding scheduled messages
  scheduledIdx:
index('proactive_messages_scheduled_idx').on(table.scheduledFor),
  // Index for user's scheduled messages
  userStatusIdx: index('proactive_messages_user_status_idx').on(table.userId, table.status),
}));