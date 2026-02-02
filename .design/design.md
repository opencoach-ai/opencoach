# OpenCoach - AI Personal Health Agent - Design Document

## Overview

OpenCoach is an AI-native personal health agent built using **Agent-native Architecture** principles. The system operates as a forward-agent: autonomous, proactive, and relentless in helping users improve their health through data-driven insights and behavior change.

### Core Design Philosophy
- **LLM-First**: All decision logic flows through LLM, no hardcoded business rules
- **Observation-ReAct Loop**: Agents continuously observe events and take actions
- **Multi-Agent System**: Specialized sub-agents with clear responsibilities
- **Permission Boundary**: Agents ask permission only when decisions affect user options
- **Event-Driven**: Reactive to health data changes, user actions, and scheduled triggers

### Technology Stack
- **Backend**: Node.js + Hono + TypeScript (tRPC for type-safe APIs)
- **Frontend**: Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Mobile**: React Native (iOS/Android) + Messaging Platform Integrations (WhatsApp/Telegram/Discord)
- **Database**: PostgreSQL (premium) / SQLite (local, open-source)
- **ORM**: Drizzle ORM
- **Agent Framework**: Mastra + Vercel AI SDK (full-stack TypeScript agent framework)
- **Vector DB**: pgvector (for semantic search of health literature)
- **Message Queue**: BullMQ (Redis-backed job queue)
- **Infrastructure**: Docker + Docker Compose (local deploy)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                             Client Layer                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   Web    │  │  Mobile  │  │ WhatsApp │  │ Telegram │  │ Discord  │  │ Slack  ││
│  │  (NextJS)│  │(React N.)│  │(Baileys) │  │(grammY)  │  │(discord.js)│ │ (Bolt)││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘│
└───────┼────────────┼─────────────┼─────────────┼─────────────┼─────────────┼───────┘
        │            │             │             │             │             │
        └────────────────────────────────────────────────────────────────────────────┘
                                        │
                         ┌──────────────▼──────────────────┐
                         │     Gateway WebSocket Plane     │
                         │     ws://127.0.0.1:18789        │
                         │    (Control Plane + Sessions)   │
                         └──────────────┬──────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
┌───────▼────────┐          ┌──────────▼──────────┐        ┌──────────▼──────────┐
│  CLI Surface    │          │  Agent Orchestrator │        │  Data Pipeline      │
│  - gateway      │          │  (Session Routing)  │        │  (Ingestion)        │
│  - agent        │          │  (Mastra)           │        │                     │
│  - send         │          │                     │        │                     │
│  - wizard       │          │                     │        │                     │
│  - doctor       │          │                     │        │                     │
└─────────────────┘          └──────────┬┬─────────┘        └─────────────────────┘
                                        │ │
        ┌──────────────────────────────┘ └──────────────────────┐
        │                                                            │
┌───────▼────────┐    ┌──────────┐         ┌────────────────────────▼─────┐
│   DS Agent     │    │DE Agent  │         │     HC Agent                  │
│ (Data Science) │    │(Domain   │         │  (Health Coach)               │
│   (Mastra)     │    │ Expert)  │         │  - Multi-platform Chat        │
│                │    │(Mastra)  │         │  - Motivational Interviewing  │
└───────┬────────┘    └────┬─────┘         └──────────────┬───────────────┘
        │                  │                              │
        └──────────────────┼──────────────────────────────┘
                           │
                    ┌──────▼──────────────────────────────────┐
                    │          Knowledge Base                  │
                    │  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
                    │  │ Vector  │ │  User   │ │Health   │    │
                    │  │  DB     │ │  Data   │ │Literature│   │
                    │  │(pgvector)│ │(Drizzle)│ │          │    │
                    │  └─────────┘ └─────────┘ └─────────┘    │
                    └──────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Message Queue   │
                    │    (BullMQ)       │
                    │    + Redis        │
                    └───────────────────┘
```

### Gateway Architecture (OpenClaw-inspired)

**WebSocket Control Plane**:
- Single WebSocket endpoint: `ws://127.0.0.1:18789`
- Central hub for all communication: sessions, channels, tools, events
- Real-time bidirectional messaging between clients and agents
- Presence tracking, typing indicators, and usage monitoring

**Session Model**:
- `main` session: Direct 1:1 agent conversations
- Group/channel isolation: Separate sessions for group chats
- Multi-agent routing: Route different channels/accounts to isolated agents
- Per-session activation modes, queue modes, reply-back policies
- Session pruning and cleanup for resource management

**CLI Surface**:
```bash
opencoach gateway      # Start gateway daemon
opencoach agent        # Talk to the health coach agent
opencoach send         # Send messages via connected channels
opencoach wizard       # Onboarding wizard for setup
opencoach doctor       # Health checks and troubleshooting
```

**Gateway Protocol Methods** (WebSocket RPC):
- `agent.invoke` - Execute agent with tools
- `sessions.list` - List active sessions
- `sessions.get` - Get session transcript
- `channels.send` - Send message to channel
- `channels.status` - Get channel connection status
- `events.subscribe` - Subscribe to events

### Messaging Platform Channels

OpenCoach uses the same channel libraries as OpenClaw for proven reliability:

| Platform | Library | Notes |
|----------|---------|-------|
| **WhatsApp** | Baileys | No official API required |
| **Telegram** | grammY | Modern TypeScript framework |
| **Slack** | Bolt | Official Slack framework |
| **Discord** | discord.js | Full Discord API coverage |
| **Google Chat** | Chat API | Google Workspace integration |
| **Signal** | signal-cli | Desktop signal-cli required |
| **iMessage** | imsg | macOS only, Messages app must be signed in |
| **Microsoft Teams** | Bot Framework | Enterprise integration |
| **Matrix** | Extension | Community-maintained |
| **Zalo / Zalo Personal** | Extension | Vietnam market |
| **BlueBubbles** | Extension | iMessage bridge for non-macOS |

**Channel Configuration** (`~/.opencoach/channels.json`):
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+1234567890", "*"],
      "groups": ["*"]
    },
    "telegram": {
      "enabled": true,
      "botToken": "123456:ABCDEF",
      "groups": {
        "*": {
          "requireMention": true
        }
      }
    },
    "discord": {
      "enabled": true,
      "token": "MTIzNDU2...",
      "dm": {
        "policy": "pairing"
      }
    }
  }
}
```

**DM Pairing Security** (Default for safety):
- Unknown senders receive a short pairing code
- Bot does not process messages until approved
- Approve with: `opencoach pairing approve <channel> <code>`
- Public DMs require explicit opt-in (`dmPolicy: "open"`)

### Messaging Platform Integration

OpenCoach integrates into popular messaging platforms (WhatsApp, Telegram, Discord) to provide a natural, conversational health coaching experience. Similar to OpenClaw, the system operates as a "virtual human coach" that can:

**Natural Conversation Flow**:
- Proactive check-ins: "Hey! I noticed you haven't logged a workout in 3 days. Everything okay?"
- Goal reminders: "Don't forget your 30-min run scheduled for today at 6 PM!"
- Insights delivery: "Your sleep improved by 12% this week. Great work sticking to your bedtime!"
- Interactive conversations: Users can chat naturally, ask questions, receive coaching

**Gateway-Channel Communication**:
```typescript
// Channel sends message to Gateway
interface ChannelToGateway {
  type: 'message' | 'event' | 'presence';
  channel: 'whatsapp' | 'telegram' | 'discord' | 'slack' | etc;
  from: string; // User ID / phone number
  content: string;
  metadata: {
    timestamp: Date;
    isGroup: boolean;
    groupId?: string;
    // Platform-specific data
  };
}

// Gateway routes to agent and responds
interface GatewayToChannel {
  type: 'message' | 'typing' | 'presence';
  to: string;
  content: string;
  format: 'text' | 'markdown' | 'interactive';
  metadata?: {
    quotedMessageId?: string;
    inlineButtons?: Button[][];
    attachments?: Attachment[];
  };
}
```

### Agent Loop Architecture (ReAct Pattern)

```
Observation Event → Agent Manager → Router → Sub-Agent → Action Execution → Feedback Loop

Event Triggers:
  - New health data arrives
  - User asks question
  - Scheduled check-in (daily/weekly)
  - Goal deadline approaching
  - User activity detected (e.g., missed workout)
```

### Deployment Models

1. **Open-Source (Local Deployment)**
   - Docker Compose stack running on user's machine
   - SQLite database for local data storage
   - Web interface at localhost:3000
   - Data export to local filesystem

2. **Premium (Cloud)**
   - Managed cloud deployment (Vercel/Railway/AWS)
   - PostgreSQL database
   - Scalable infrastructure
   - Automatic backups
   - Cross-device sync

## Components and Interfaces

### 1. Auth Service

**Tech Stack**: Hono + NextAuth.js + TypeScript

**Responsibilities**:
- User authentication and authorization
- OAuth integration with third-party health platforms
- Session management
- API key management

**Key Endpoints**:
```typescript
// OAuth flows
POST /api/auth/oauth/apple-health
POST /api/auth/oauth/google-health
POST /api/auth/oauth/fitbit
POST /api/auth/oauth/whoop
POST /api/auth/oauth/oura

// Session management
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

**Implementation**: NextAuth.js with custom OAuth providers

---

### 2. Data Pipeline Service

**Tech Stack**: Hono + TypeScript + BullMQ

**Responsibilities**:
- Ingest health data from multiple sources
- Normalize and standardize data formats
- Validate data quality
- Store in database

**Key Interfaces**:
```typescript
interface HealthDataSource {
  name: string;
  type: 'wearable' | 'app' | 'platform';
  syncInterval: number; // minutes
  lastSync: Date;
  isActive: boolean;
}

interface DataIngestor {
  fetch(startDate: Date, endDate: Date): Promise<RawHealthData[]>;
  normalize(raw: RawHealthData[]): Promise<NormalizedHealthData[]>;
  validate(data: NormalizedHealthData[]): ValidationResult;
  store(data: NormalizedHealthData[]): Promise<void>;
}

// Supported data sources
class AppleHealthIngestor implements DataIngestor { }
class GoogleHealthIngestor implements DataIngestor { }
class FitbitIngestor implements DataIngestor { }
class WhoopIngestor implements DataIngestor { }
class OuraIngestor implements DataIngestor { }
```

**Data Types Extracted**:
```typescript
interface HealthMetrics {
  // Activity
  steps: number;
  distance: number; // meters
  activeCalories: number;
  restingCalories: number;

  // Heart
  heartRate: number; // bpm
  restingHeartRate: number;
  heartRateVariability: number; // ms
  bloodPressure?: { systolic: number; diastolic: number; };

  // Sleep
  sleepDuration: number; // minutes
  sleepEfficiency: number; // percentage
  sleepStages: {
    deep: number; // minutes
    light: number;
    rem: number;
    awake: number;
  };

  // Workouts
  workouts: Workout[];

  // Other
  oxygenSaturation?: number; // percentage
  bodyTemperature?: number; // celsius
  stressScore?: number; // 0-100
  timestamp: Date;
}
```

---

### 3. Agent Orchestrator

**Tech Stack**: Mastra + Vercel AI SDK + Hono

**Responsibilities**:
- Route events to appropriate sub-agents
- Manage agent lifecycle
- Coordinate multi-agent workflows
- Handle permission requests

**Key Interface**:
```typescript
interface AgentOrchestrator {
  // Event routing
  onEvent(event: HealthEvent): Promise<AgentResponse>;

  // Agent management
  route(event: HealthEvent): SubAgentType;
  invokeAgent(agent: SubAgentType, context: AgentContext): Promise<AgentResult>;

  // Permission handling
  requestPermission(action: ProposedAction): Promise<boolean>;

  // Workflow orchestration
  runWorkflow(workflow: AgentWorkflow): Promise<WorkflowResult>;
}

type HealthEvent =
  | { type: 'data_received'; data: HealthMetrics[] }
  | { type: 'user_query'; query: string; userId: string }
  | { type: 'scheduled_check'; schedule: 'daily' | 'weekly' }
  | { type: 'goal_deadline'; goalId: string; status: 'approaching' | 'missed' }
  | { type: 'user_inactive'; streak: number };

type SubAgentType = 'data_science' | 'domain_expert' | 'health_coach';
```

---

### 4. Data Science Agent (DS Agent)

**Tech Stack**: Mastra Agent + Vercel AI SDK

**Responsibilities**:
- Analyze trends in personal health data
- Compare current vs historical metrics
- Identify patterns and correlations
- Generate numerical insights

**Capabilities**:
```typescript
interface DataScienceAgent {
  // Trend analysis
  analyzeTrend(
    metric: keyof HealthMetrics,
    timeframe: 'week' | 'month' | 'quarter'
  ): Promise<TrendInsight>;

  // Comparative analysis
  comparePeriods(
    metric: keyof HealthMetrics,
    period1: DateRange,
    period2: DateRange
  ): Promise<ComparisonResult>;

  // Pattern detection
  detectPatterns(metrics: HealthMetrics[]): Promise<Pattern[]>;

  // Predictions (future enhancement)
  predictFuture(metric: keyof HealthMetrics, days: number): Promise<Prediction>;

  // Answer specific questions
  answerQuestion(question: string, data: HealthMetrics[]): Promise<string>;
}

interface TrendInsight {
  metric: string;
  direction: 'improving' | 'declining' | 'stable';
  magnitude: number; // percentage change
  confidence: number; // 0-1
  startDate: Date;
  endDate: Date;
  summary: string; // LLM-generated explanation
}
```

**Example Questions Handled**:
- "Has my running pace improved over the last month?"
- "What's my average sleep duration on weekdays vs weekends?"
- "Do I exercise more when I sleep better?"

---

### 5. Domain Expert Agent (DE Agent)

**Tech Stack**: Mastra Agent + Vercel AI SDK + pgvector

**Responsibilities**:
- Interpret health metrics in clinical context
- Compare with population norms
- Provide evidence-based explanations
- Reference scientific literature

**Capabilities**:
```typescript
interface DomainExpertAgent {
  // Metric interpretation
  interpretMetric(
    metric: keyof HealthMetrics,
    value: number
  ): Promise<Interpretation>;

  // Population comparison
  compareWithPopulation(
    metric: keyof HealthMetrics,
    userValue: number,
    demographic: Demographic
  ): Promise<PopulationComparison>;

  // Biomarker explanation
  explainBiomarker(biomarker: string): Promise<Explanation>;

  // Health question answering
  answerQuestion(question: string, context: HealthContext): Promise<string>;

  // Literature search (via vector DB)
  searchLiterature(query: string): Promise<Paper[]>;
}

interface Interpretation {
  metric: string;
  value: number;
  status: 'optimal' | 'normal' | 'elevated' | 'concerning';
  explanation: string;
  references?: string[]; // Links to scientific sources
  recommendations?: string[];
}

interface PopulationComparison {
  metric: string;
  userValue: number;
  population: {
    mean: number;
    percentile: number; // user's percentile
    category: 'below_average' | 'average' | 'above_average';
  };
}
```

**Example Questions Handled**:
- "Is a blood pressure of 137/83 okay?"
- "What's a good heart rate variability score for my age?"
- "How does my sleep efficiency compare to most people?"

---

### 6. Health Coach Agent (HC Agent)

**Tech Stack**: Mastra Agent + Vercel AI SDK + Messaging Platform Adapters

**Responsibilities**:
- Conduct motivational interviewing
- Help set achievable goals
- Create behavior change plans
- Provide accountability and encouragement
- Handle natural conversations across messaging platforms (WhatsApp, Telegram, Discord)

**Capabilities**:
```typescript
interface HealthCoachAgent {
  // Motivational interviewing
  conductSession(userContext: UserContext): Promise<CoachingSession>;

  // Goal setting
  suggestGoals(data: HealthMetrics[], userContext: UserContext): Promise<Goal[]>;
  validateGoal(goal: Goal): Promise<ValidationResult>;

  // Behavior change planning
  createPlan(goal: Goal, barriers: Barrier[]): Promise<ActionPlan>;

  // Proactive check-ins
  checkIn(userId: string): Promise<CheckInResult>;

  // Barrier identification
  identifyBarriers(goal: Goal, progress: Progress): Promise<Barrier[]>;
}

interface Goal {
  id: string;
  type: 'activity' | 'sleep' | 'nutrition' | 'other';
  target: number | string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'achieved' | 'missed';
  milestones: Milestone[];
}

interface ActionPlan {
  goalId: string;
  steps: ActionStep[];
  schedule: Schedule;
  resources: Resource[];
  contingencies: ContingencyPlan[];
}

interface CoachingSession {
  transcript: Message[];
  insights: string[];
  actionItems: string[];
  nextSteps: string[];
}
```

**Example Interactions**:
- "I haven't exercised in a week. What should I do?"
- "Help me set a realistic sleep goal for next month."
- "Why do I keep skipping my Monday workouts?"

---

### 7. Knowledge Base

**Components**:

a) **User Data Store**
```typescript
interface UserDataStore {
  // CRUD for health metrics
  saveMetrics(userId: string, metrics: HealthMetrics[]): Promise<void>;
  getMetrics(userId: string, dateRange: DateRange): Promise<HealthMetrics[]>;

  // User profile and preferences
  getUserProfile(userId: string): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void>;

  // Goals and progress
  saveGoal(goal: Goal): Promise<void>;
  getGoals(userId: string): Promise<Goal[]>;
  updateGoalProgress(goalId: string, progress: number): Promise<void>;

  // Coaching history
  saveSession(session: CoachingSession): Promise<void>;
  getSessions(userId: string): Promise<CoachingSession[]>;
}
```

b) **Vector Database (Health Literature)**
```typescript
interface LiteratureDatabase {
  // Semantic search
  search(query: string, limit?: number): Promise<Paper[]>;

  // Get specific paper
  getPaper(id: string): Promise<Paper>;

  // Get evidence for claim
  getEvidence(claim: string): Promise<Evidence[]>;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  doi: string;
  embedding: number[]; // vector embedding
}
```

---

### 8. Notification Service

**Responsibilities**:
- Send daily health reports via email
- Deliver proactive check-ins
- Alert for goal deadlines
- Permission request notifications

**Interface**:
```typescript
interface NotificationService {
  sendReport(userId: string, report: HealthReport): Promise<void>;
  sendCheckIn(userId: string, message: string): Promise<void>;
  sendPermissionRequest(userId: string, action: ProposedAction): Promise<boolean>;
  sendAlert(userId: string, alert: Alert): Promise<void>;
}
```

---

### 9. Calendar Integration Service

**Responsibilities**:
- Sync goals to wearable activity rings
- Schedule workout sessions
- Check for scheduling conflicts

**Interface**:
```typescript
interface CalendarService {
  // Platform detection
  getPlatform(userId: string): 'apple' | 'google' | 'outlook' | null;

  // Create events
  createEvent(userId: string, event: CalendarEvent): Promise<string>;

  // Check availability
  checkAvailability(userId: string, window: DateRange): Promise<TimeSlot[]>;

  // Sync goals to wearable
  syncGoal(userId: string, goal: Goal): Promise<void>;
}

interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  location?: string;
  reminders: number[]; // minutes before event
}
```

---

### 10. Web Dashboard (Frontend)

**Tech Stack**: Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui + Vercel AI SDK

**Pages/Components**:

a) **Dashboard Overview**
```typescript
// Key metrics visualization
interface DashboardOverview {
  todaySummary: TodaySummary;
  weeklyTrends: TrendChart[];
  goalProgress: GoalProgress[];
  upcomingSchedule: ScheduledEvent[];
  quickActions: QuickAction[];
}
```

b) **Health Analytics**
```typescript
// Deep dive into specific metrics
interface AnalyticsView {
  metricSelector: MetricSelector;
  timeRangeSelector: TimeRangeSelector;
  chart: MetricChart;
  insights: InsightCard[];
  comparison: PopulationComparisonView;
}
```

c) **Goals & Planning**
```typescript
interface GoalsView {
  activeGoals: Goal[];
  suggestedGoals: Goal[];
  goalCreator: GoalCreatorForm;
  actionPlans: ActionPlan[];
  calendarIntegration: CalendarWidget;
}
```

d) **Coach Chat**
```typescript
interface ChatView {
  messages: Message[];
  inputField: ChatInput;
  suggestedQuestions: SuggestedQuestion[];
  agentIndicator: AgentType; // Shows which agent is responding
}
```

e) **Data Sources Management**
```typescript
interface DataSourcesView {
  connectedSources: HealthDataSource[];
  availableSources: HealthDataSource[];
  syncStatus: SyncStatus;
  lastSyncTime: Date;
}
```

---

### 11. Mobile App (React Native)

**Tech Stack**: React Native + TypeScript + React Navigation

**Features**:
- Native health data syncing (Apple HealthKit / Google Health Connect)
- Push notifications for check-ins and reminders
- Offline-first architecture with local SQLite cache
- Biometric authentication for sensitive health data
- Background data sync

**Key Screens**:
```typescript
interface MobileScreens {
  homeScreen: HomeScreen; // Dashboard with today's metrics
  analyticsScreen: AnalyticsScreen; // Detailed charts and trends
  goalsScreen: GoalsScreen; // Active goals and progress
  coachChatScreen: CoachChatScreen; // In-app chat with HC Agent
  profileScreen: ProfileScreen; // User settings and data sources
}
```

---

### 12. Channel Adapters

**Tech Stack**: Baileys (WhatsApp), grammY (Telegram), Bolt (Slack), discord.js (Discord), etc.

**Channel Adapter Interface**:
```typescript
interface ChannelAdapter {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  send(message: GatewayToChannel): Promise<void>;
  onMessage(callback: (msg: ChannelToGateway) => void): void;
  isConnected(): boolean;
}

// WhatsApp (Baileys)
class WhatsAppChannel implements ChannelAdapter {
  name = 'whatsapp';
  private socket: BaileysSocket;

  async start() {
    this.socket = makeWASocket({
      auth: useBaileysAuthState('credentials/whatsapp'),
      printQRInTerminal: true
    });

    this.socket.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        this.messageCallback({
          type: 'message',
          channel: 'whatsapp',
          from: msg.key.remoteJid,
          content: msg.message?.conversation || '',
          metadata: {
            timestamp: new Date(msg.messageTimestamp * 1000),
            isGroup: msg.key.participant !== undefined
          }
        });
      }
    });
  }

  async send(message: GatewayToChannel) {
    await this.socket.sendMessage(message.to, {
      text: message.content
    });
  }
}

// Telegram (grammY)
class TelegramChannel implements ChannelAdapter {
  name = 'telegram';
  private bot: Bot;

  constructor(token: string) {
    this.bot = new Bot(token);
  }

  async start() {
    this.bot.on('message:text', async (ctx) => {
      this.messageCallback({
        type: 'message',
        channel: 'telegram',
        from: ctx.from.id.toString(),
        content: ctx.message.text,
        metadata: {
          timestamp: new Date(),
          isGroup: ctx.chat.type !== 'private'
        }
      });
    });

    await this.bot.start();
  }

  async send(message: GatewayToChannel) {
    await this.bot.api.sendMessage(message.to, message.content);
  }
}

// Discord (discord.js)
class DiscordChannel implements ChannelAdapter {
  name = 'discord';
  private client: Client;

  constructor(token: string) {
    this.client = new Client({ intents: GatewayIntentBits.DirectMessages });
  }

  async start() {
    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;

      this.messageCallback({
        type: 'message',
        channel: 'discord',
        from: message.author.id,
        content: message.content,
        metadata: {
          timestamp: message.createdAt,
          isGroup: message.channel.type !== ChannelType.DM
        }
      });
    });

    await this.client.login(this.token);
  }

  async send(message: GatewayToChannel) {
    const channel = await this.client.channels.fetch(message.to);
    if (channel && channel.isTextBased()) {
      await channel.send(message.content);
    }
  }
}
```

**Channel Manager**:
```typescript
class ChannelManager {
  private channels: Map<string, ChannelAdapter> = new Map();

  register(adapter: ChannelAdapter) {
    this.channels.set(adapter.name, adapter);
  }

  async startAll() {
    await Promise.all(
      Array.from(this.channels.values()).map(ch => ch.start())
    );
  }

  async sendToChannel(channelName: string, message: GatewayToChannel) {
    const channel = this.channels.get(channelName);
    if (channel) {
      await channel.send(message);
    }
  }

  onChannelMessage(callback: (msg: ChannelToGateway) => void) {
    for (const channel of this.channels.values()) {
      channel.onMessage(callback);
    }
  }
}
```

## Data Models

### Database Schema (PostgreSQL/SQLite)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_tier VARCHAR(20) DEFAULT 'free', -- 'free' | 'premium'
  preferences JSONB,
  deployment_type VARCHAR(20) DEFAULT 'local' -- 'local' | 'cloud'
);

-- OAuth Connections
CREATE TABLE oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'apple_health', 'google_health', 'fitbit', etc.
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  scope TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Health Metrics (time-series data, potentially partitioned)
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,

  -- Activity metrics
  steps INT,
  distance FLOAT, -- meters
  active_calories INT,
  resting_calories INT,

  -- Heart metrics
  heart_rate INT, -- bpm
  resting_heart_rate INT,
  heart_rate_variability FLOAT, -- ms
  blood_pressure_systolic INT,
  blood_pressure_diastolic INT,

  -- Sleep metrics
  sleep_duration INT, -- minutes
  sleep_efficiency FLOAT, -- 0-100
  sleep_deep INT, -- minutes
  sleep_light INT,
  sleep_rem INT,
  sleep_awake INT,

  -- Other metrics
  oxygen_saturation FLOAT, -- 0-100
  body_temperature FLOAT, -- celsius
  stress_score INT, -- 0-100

  raw_data JSONB, -- Store original source data for flexibility

  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for efficient time-series queries
CREATE INDEX idx_health_metrics_user_timestamp ON health_metrics(user_id, timestamp DESC);
CREATE INDEX idx_health_metrics_source ON health_metrics(source);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL,
  type VARCHAR(50), -- 'running', 'cycling', 'swimming', etc.
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration INT, -- minutes
  calories INT,
  distance FLOAT, -- meters
  avg_heart_rate INT,
  max_heart_rate INT,
  raw_data JSONB
);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'activity', 'sleep', 'nutrition', 'other'
  target JSONB NOT NULL, -- Flexible target structure
  deadline DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'achieved', 'missed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goal Milestones
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  target_value FLOAT,
  achieved_value FLOAT,
  achieved_at TIMESTAMP,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pending'
);

-- Action Plans
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  steps JSONB NOT NULL, -- Array of action steps
  schedule JSONB, -- Recurring schedule info
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coaching Sessions
CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type VARCHAR(20) NOT NULL, -- 'data_science', 'domain_expert', 'health_coach'
  transcript JSONB NOT NULL, -- Array of messages
  insights JSONB, -- Array of insight strings
  action_items JSONB, -- Array of action items
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Observations/Events (audit log)
CREATE TABLE agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  agent_type VARCHAR(20),
  event_data JSONB,
  action_taken JSONB,
  permission_requested BOOLEAN,
  permission_granted BOOLEAN,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Vector Embeddings for Literature (pgvector)
CREATE TABLE health_literature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT[],
  journal VARCHAR(255),
  year INT,
  abstract TEXT,
  doi VARCHAR(255),
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX idx_literature_embedding ON health_literature USING ivfflat (embedding vector_cosine_ops);

-- Messaging Platform Connections
CREATE TABLE messaging_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL, -- 'whatsapp', 'telegram', 'discord'
  platform_user_id VARCHAR(255) NOT NULL, -- External platform user ID
  is_primary BOOLEAN DEFAULT false, -- User's preferred messaging platform
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, platform_user_id)
);

-- Conversations (unified across platforms)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL,
  platform_conversation_id VARCHAR(255), -- External conversation/thread ID
  agent_type VARCHAR(20), -- 'data_science', 'domain_expert', 'health_coach'
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived'
  context JSONB, -- Conversation context for agent continuity
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- 'user', 'agent', 'system'
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'interactive', 'media', 'system'
  metadata JSONB, -- Platform-specific data, attachments, etc.
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Proactive Message Schedule
CREATE TABLE proactive_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_type VARCHAR(50) NOT NULL, -- 'user_inactive', 'goal_deadline', 'daily_checkin'
  message_content TEXT NOT NULL,
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  platform VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### TypeScript Interfaces

```typescript
// Core types
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  subscriptionTier: 'free' | 'premium';
  preferences: UserPreferences;
  deploymentType: 'local' | 'cloud';
}

interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: {
    emailReports: boolean;
    dailySummary: boolean;
    weeklySummary: boolean;
    goalReminders: boolean;
    proactiveCheckins: boolean;
  };
  privacy: {
    dataRetention: number; // days
    shareWithPopulation: boolean;
    allowClinicalIntegration: boolean;
  };
  deployment: {
    storageLocation: 'local' | 'cloud';
    syncAcrossDevices: boolean;
  };
}

interface HealthEvent {
  id: string;
  userId: string;
  type: EventType;
  timestamp: Date;
  data: unknown;
}

type EventType =
  | 'data_received'
  | 'user_query'
  | 'scheduled_check'
  | 'goal_deadline'
  | 'user_inactive'
  | 'permission_request';

interface AgentResponse {
  agentType: SubAgentType;
  response: unknown;
  actionRequired?: boolean;
  permissionRequest?: ProposedAction;
}

interface ProposedAction {
  type: 'create_goal' | 'schedule_workout' | 'send_message' | 'update_calendar';
  description: string;
  impact: string;
  requiresPermission: boolean;
}
```

## Error Handling

### Error Categories

1. **Data Ingestion Errors**
   - API authentication failures
   - Rate limiting from third-party APIs
   - Malformed data from sources
   - Network timeouts

2. **Agent Execution Errors**
   - LLM API failures (timeout, rate limit, content filter)
   - Missing context/data for analysis
   - Conflicting agent recommendations
   - Tool execution failures

3. **User Interaction Errors**
   - Invalid user input
   - Permission denials
   - Session timeouts
   - Invalid OAuth tokens

### Error Handling Strategy

```typescript
// Centralized error handler
class ErrorHandler {
  handleError(error: Error, context: ErrorContext): void {
    // Log error
    this.log(error, context);

    // Categorize error
    const category = this.categorize(error);

    // Route to appropriate handler
    switch (category) {
      case 'recoverable':
        return this.handleRecoverable(error, context);
      case 'transient':
        return this.retry(error, context);
      case 'fatal':
        return this.handleFatal(error, context);
      case 'user_action_required':
        return this.notifyUser(error, context);
    }
  }

  // Retry with exponential backoff for transient errors
  async retry(error: Error, context: ErrorContext): Promise<void> {
    const maxRetries = 3;
    const delay = Math.pow(2, context.attempt) * 1000; // exponential backoff

    if (context.attempt < maxRetries) {
      await this.sleep(delay);
      return context.retry();
    } else {
      this.handleFatal(error, context);
    }
  }

  // Graceful degradation for agent errors
  handleAgentError(error: AgentError): AgentResponse {
    return {
      agentType: error.agentType,
      response: {
        type: 'error',
        message: 'I encountered an issue. Let me try a different approach.',
        fallbackResponse: this.getFallbackResponse(error),
      },
    };
  }

  // User notification for action-required errors
  notifyUser(error: Error, context: ErrorContext): void {
    this.notificationService.sendAlert({
      userId: context.userId,
      type: 'error',
      message: this.getUserFriendlyMessage(error),
      actionRequired: true,
    });
  }
}
```

### Circuit Breaker Pattern

```typescript
// Prevent cascading failures
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private lastFailureTime?: Date;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.threshold) {
      this.state = 'open';
    }
  }
}
```

## Testing Strategy

### Unit Testing

- **Frameworks**: Vitest (fast, native ESM)
- **Target**: 80%+ code coverage
- **Focus**:
  - Agent logic and decision-making
  - Data normalization and validation
  - Data model transformations
  - Business logic in services

```typescript
// Example unit test
describe('DataScienceAgent', () => {
  it('should detect improving trend in step count', async () => {
    const agent = new DataScienceAgent();
    const metrics = generateMockMetrics({
      trend: 'increasing',
      metric: 'steps',
      days: 30
    });

    const trend = await agent.analyzeTrend('steps', 'month');

    expect(trend.direction).toBe('improving');
    expect(trend.confidence).toBeGreaterThan(0.7);
  });

  it('should handle sparse data gracefully', async () => {
    const agent = new DataScienceAgent();
    const metrics = generateSparseMetrics({ gapDays: 7 });

    const result = await agent.analyzeTrend('steps', 'week');

    expect(result.confidence).toBeLessThan(0.5);
    expect(result.summary).toContain('insufficient data');
  });
});
```

### Integration Testing

- **Focus**: Service interactions and data flows
- **Areas**:
  - OAuth authentication flows
  - Data ingestion from third-party APIs (using mocks)
  - Agent orchestration workflows
  - Database operations
  - API endpoints

```typescript
// Example integration test
describe('Data Pipeline Integration', () => {
  it('should ingest and store health data from Apple Health', async () => {
    const mockAppleHealthAPI = new MockAppleHealthAPI();
    const ingestor = new AppleHealthIngestor(mockAppleHealthAPI);
    const db = await createTestDatabase();

    const rawData = await mockAppleHealthAPI.fetchData(
      new Date('2024-01-01'),
      new Date('2024-01-07')
    );
    const normalized = await ingestor.normalize(rawData);
    await ingestor.store(normalized);

    const stored = await db.getMetrics(userId, {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-07')
    });

    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0]).toMatchObject({
      source: 'apple_health',
      steps: expect.any(Number)
    });
  });
});
```

### End-to-End Testing

- **Framework**: Playwright (web), Detox (React Native)
- **Scenarios**:
  - User onboarding flow
  - Connect health data source
  - Receive daily report
  - Set and track goals
  - Coach chat interaction (web, mobile, messaging platforms)
  - Calendar integration
  - WhatsApp bot conversation flow
  - Telegram bot interactive buttons
  - Discord bot embed messages

```typescript
// Example E2E test for messaging platform
test('WhatsApp conversation: proactive check-in and user response', async () => {
  const mockWhatsAppAPI = new MockWhatsAppAPI();

  // Simulate proactive check-in
  await mockWhatsAppAPI.simulateIncomingMessage({
    from: 'opencoach',
    to: 'user123',
    message: "Hey! Haven't seen you work out in 3 days. Everything okay? 🏃‍♂️"
  });

  // User responds
  await mockWhatsAppAPI.sendMessage({
    from: 'user123',
    to: 'opencoach',
    message: "Yeah, been super busy at work. Will try to go tomorrow."
  });

  // Verify agent response
  const lastMessage = await mockWhatsAppAPI.getLastMessage();
  expect(lastMessage.content).toContain('understand');
  expect(lastMessage.content).toMatch(/tomorrow|schedule|plan/);
});
```

### Agent Testing (LLM Output Validation)

- **Challenge**: Non-deterministic LLM outputs
- **Strategy**:
  - Use fixed test prompts
  - Validate output structure (not exact content)
  - Mock LLM responses for deterministic tests
  - Sample real responses for quality assurance

```typescript
// Example agent test
describe('DomainExpertAgent', () => {
  it('should return valid interpretation structure', async () => {
    const agent = new DomainExpertAgent(mockLLM);

    const interpretation = await agent.interpretMetric('bloodPressure', {
      systolic: 137,
      diastolic: 83
    });

    // Validate structure, not content
    expect(interpretation).toMatchObject({
      metric: 'bloodPressure',
      value: { systolic: 137, diastolic: 83 },
      status: expect.stringMatching(/optimal|normal|elevated|concerning/),
      explanation: expect.any(String)
    });
  });
});
```

### Performance Testing

- **Load Testing**: k6 or Artillery
- **Targets**:
  - 10,000 concurrent users
  - API response < 500ms (95th percentile)
  - Data sync < 2 minutes per user
  - Agent analysis < 30 seconds

```typescript
// Example load test (k6)
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 1000 }, // Ramp up
    { duration: '10m', target: 5000 }, // Sustained load
    { duration: '5m', target: 10000 }, // Peak load
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const response = http.post('https://api.opencoach.dev/agent/query', {
    query: 'How is my sleep this week?',
    userId: 'test-user',
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has insights': (r) => JSON.parse(r.body).insights !== undefined,
  });

  sleep(1);
}
```

### Security Testing

- **Tools**: OWASP ZAP, custom security tests
- **Areas**:
  - SQL injection prevention
  - XSS vulnerability testing
  - CSRF protection validation
  - OAuth security
  - Data encryption verification

```typescript
// Example security test
describe('Security: SQL Injection', () => {
  it('should sanitize user input in queries', async () => {
    const maliciousInput = "'; DROP TABLE users; --";

    const result = await agent.query(maliciousInput, userId);

    expect(result).not.toContain('error');
    // Verify users table still exists
    const users = await db.query('SELECT * FROM users');
    expect(users.length).toBeGreaterThan(0);
  });
});
```

### Testing Environments

1. **Local Development**
   - Unit tests run on every file change
   - Integration tests against local Docker stack
   - Mock third-party APIs

2. **CI/CD Pipeline**
   - All unit and integration tests must pass
   - Code coverage report generation
   - Security scanning (Snyk, Dependabot)
   - E2E tests on staging environment

3. **Staging Environment**
   - Full E2E test suite
   - Performance tests weekly
   - Pre-production smoke tests
