# OpenCoach - AI Personal Health Agent - Task List

## Implementation Tasks

### Phase 0: Project Setup & Infrastructure (Foundation)

- [x] 0.1. **Initialize Project Structure** (COMPLETED: 2026-02-02)
    - *Goal*: Set up monorepo with proper TypeScript configuration
    - *Details*:
      - Create `apps/` (gateway, web, cli, whatsapp) and `packages/` (shared) structure
      - Configure Turborepo for monorepo management
      - Set up TypeScript strict mode, ESLint, Prettier
      - Configure Husky for pre-commit hooks
      - Create GitHub templates (PR, issues)
      - Push to opencoach-ai organization
    - *Requirements*: Technical requirements (code quality, maintainability)

- [x] 0.2. **Set Up Development Environment** (COMPLETED: 2026-02-05)
    - *Goal*: Docker Compose for local development
    - *Details*:
      - Create `docker-compose.yml` with PostgreSQL, Redis, and local development services
      - Configure database migrations with Drizzle ORM
      - Set up Redis for BullMQ message queue
      - Create environment variable templates (.env.example)
    - *Requirements*: Infrastructure (Docker + Docker Compose)

- [x] 0.3. **Database Schema Implementation** (COMPLETED: 2026-02-07)
    - *Goal*: Implement complete database schema with Drizzle ORM
    - *Details*:
      - Create all tables: users, oauth_connections, health_metrics, workouts, goals, coaching_sessions, agent_events, health_literature, messaging_connections, conversations, messages, proactive_messages
      - Set up indexes for time-series queries (health_metrics timestamp + 22 total indexes)
      - Configure pgvector extension for embeddings (schema ready, extension TBD)
      - Create migration scripts (drizzle-kit configured)
      - Seed health literature database with initial research papers (TBD)
    - *Requirements*: Data models section

- [x] 0.4. **CLI Tool Setup** (COMPLETED: 2026-02-06)
    - *Goal*: Create `opencoach` CLI with basic commands
    - *Details*:
      - Set up Commander.js or similar CLI framework
      - Implement: `opencoach doctor`, `opencoach --version`
      - Add configuration file management (`~/.opencoach/`)
      - Implement logging (basic console)
    - *Requirements*: Gateway CLI surface

---

### Phase 1: Gateway & WebSocket Control Plane (Core Infrastructure)

- [ ] 1.1. **WebSocket Server Implementation**
    - *Goal*: Build WebSocket gateway at `ws://127.0.0.1:18789`
    - *Details*:
      - Use ws library for WebSocket server
      - Implement RPC-style protocol (request/response over WS)
      - Add connection authentication (token-based)
      - Handle reconnection logic and heartbeat
      - Implement TypeBox schemas for message validation
    - *Requirements*: Gateway WebSocket control plane

- [ ] 1.2. **Session Management**
    - *Goal*: Implement session model with multi-agent routing
    - *Details*:
      - Create `Session` class with `main`, group sessions
      - Implement session isolation (different channels/accounts)
      - Add session activation modes, queue modes
      - Implement session pruning/cleanup
      - Store session state in Redis for persistence
    - *Requirements*: Session model with multi-agent routing

- [ ] 1.3. **Event System**
    - *Goal*: Event pub/sub for real-time updates
    - *Details*:
      - Implement event types: message, presence, typing, health_data, agent_event
      - Create event subscription API
      - Add presence tracking (online/offline status)
      - Implement typing indicators
    - *Requirements*: Gateway WebSocket events

---

### Phase 2: Agent Framework (Mastra + Vercel AI SDK)

- [ ] 2.1. **Agent Orchestrator Setup**
    - *Goal*: Set up Mastra framework with multi-agent routing
    - *Details*:
      - Configure Mastra with Vercel AI SDK
      - Create agent registry (DS, DE, HC agents)
      - Implement agent invocation via `agent.invoke`
      - Add tool streaming and block streaming support
      - Create agent lifecycle management (start, stop, restart)
    - *Requirements*: Agent Framework (Mastra + Vercel AI SDK)

- [ ] 2.2. **Data Science Agent Implementation**
    - *Goal*: Build DS Agent for health data analysis
    - *Details*:
      - Implement trend analysis (compare periods)
      - Build pattern detection (correlations)
      - Create numerical insight generation
      - Add tools: `analyzeTrend`, `comparePeriods`, `detectPatterns`
      - Integrate with user health data from database
    - *Requirements*: Data Science Agent capabilities

- [ ] 2.3. **Domain Expert Agent Implementation**
    - *Goal*: Build DE Agent for health interpretation
    - *Details*:
      - Implement metric interpretation (blood pressure, HRV, etc.)
      - Create population comparison logic
      - Build biomarker explanation system
      - Add semantic search over health literature (pgvector)
      - Create tools: `interpretMetric`, `compareWithPopulation`, `searchLiterature`
    - *Requirements*: Domain Expert Agent capabilities

- [ ] 2.4. **Health Coach Agent Implementation**
    - *Goal*: Build HC Agent for motivational interviewing
    - *Details*:
      - Implement motivational interviewing techniques
      - Create goal suggestion and validation logic
      - Build behavior change plan generation
      - Add barrier identification algorithms
      - Create tools: `suggestGoals`, `validateGoal`, `createPlan`, `identifyBarriers`
    - *Requirements*: Health Coach Agent capabilities

- [ ] 2.5. **Agent Tool Registry**
    - *Goal*: Implement tool system for agent capabilities
    - *Details*:
      - Create tool interface: execute, validate, describe
      - Implement built-in tools: browser, canvas, sessions, cron, calendar
      - Add permission checks for sensitive operations
      - Create tool discovery API for agents
    - *Requirements*: Agent tool system

---

### Phase 3: Channel Adapters (Messaging Platforms)

- [ ] 3.1. **Channel Adapter Interface**
    - *Goal*: Create unified channel adapter interface
    - *Details*:
      - Define `ChannelAdapter` interface (start, stop, send, onMessage, isConnected)
      - Implement `ChannelManager` for multi-channel orchestration
      - Add message format conversion (channel ↔ gateway format)
      - Create channel health monitoring
    - *Requirements*: Messaging Platform Channels

- [ ] 3.2. **WhatsApp Channel (Baileys)**
    - *Goal*: Implement WhatsApp integration
    - *Details*:
      - Set up Baileys library with authentication state
      - Handle QR code generation for pairing
      - Implement message sending (text, media, interactive buttons)
      - Add group message handling
      - Implement DM pairing security
    - *Requirements*: WhatsApp channel

- [ ] 3.3. **Telegram Channel (grammY)**
    - *Goal*: Implement Telegram integration
    - *Details*:
      - Set up grammY bot with bot token
      - Implement webhook or polling mode
      - Add inline button support
      - Handle group messages with mention gating
      - Implement file/document sending
    - *Requirements*: Telegram channel

- [ ] 3.4. **Discord Channel (discord.js)**
    - *Goal*: Implement Discord integration
    - *Details*:
      - Set up discord.js bot with token
      - Implement slash commands (/status, /new, etc.)
      - Add embed support for rich messages
      - Handle DM and guild messages
      - Implement DM pairing security
    - *Requirements*: Discord channel

- [ ] 3.5. **Additional Channels (Optional)**
    - *Goal*: Add Slack, Signal, iMessage as needed
    - *Details*:
      - Slack: Bolt framework
      - Signal: signal-cli integration
      - iMessage: imsg (macOS only)
    - *Requirements*: Additional messaging platforms

---

### Phase 4: Data Pipeline (Health Data Ingestion)

- [ ] 4.1. **OAuth Service Implementation**
    - *Goal*: OAuth integration with health platforms
    - *Details*:
      - Implement OAuth flows for Apple HealthKit, Google Health Connect, Fitbit, WHOOP, Oura
      - Store access/refresh tokens securely (encrypted at rest)
      - Handle token refresh automatically
      - Create OAuth connection management UI
    - *Requirements*: Auth Service + OAuth

- [ ] 4.2. **Health Data Ingestors**
    - *Goal*: Build data extractors for each platform
    - *Details*:
      - Create `AppleHealthIngestor` using HealthKit API
      - Create `GoogleHealthIngestor` using Google Fit API
      - Create `FitbitIngestor` using Fitbit Web API
      - Create `WhoopIngestor` using WHOOP API
      - Create `OuraIngestor` using Oura API
      - Implement common `DataIngestor` interface (fetch, normalize, validate, store)
    - *Requirements*: Data Pipeline Service

- [ ] 4.3. **Data Normalization & Validation**
    - *Goal*: Standardize data from different sources
    - *Details*:
      - Create normalization layer (all sources → common schema)
      - Implement data validation rules
      - Handle missing/invalid data gracefully
      - Create data quality metrics
    - *Requirements*: Data normalization

- [ ] 4.4. **Automated Sync Scheduler**
    - *Goal*: Schedule periodic data syncs
    - *Details*:
      - Use BullMQ for job scheduling (every 24 hours or on-demand)
      - Implement job retry logic with exponential backoff
      - Add rate limiting for third-party APIs
      - Create sync status tracking
    - *Requirements*: Automated data collection

---

### Phase 5: Web Dashboard (Next.js Frontend)

- [ ] 5.1. **Next.js App Setup**
    - *Goal*: Initialize Next.js with App Router
    - *Details*:
      - Set up Next.js 14 with App Router
      - Configure TailwindCSS + shadcn/ui components
      - Set up tRPC for type-safe API calls
      - Implement authentication with NextAuth.js
    - *Requirements*: Frontend (Next.js + TailwindCSS + shadcn/ui)

- [ ] 5.2. **Dashboard Overview Page**
    - *Goal*: Build main dashboard with health summary
    - *Details*:
      - Display today's key metrics (steps, sleep, heart rate)
      - Show weekly trend charts (Recharts or Chart.js)
      - Display goal progress cards
      - Add quick action buttons
    - *Requirements*: Dashboard Overview component

- [ ] 5.3. **Health Analytics Page**
    - *Goal*: Deep dive into health metrics
    - *Details*:
      - Metric selector (activity, sleep, heart rate)
      - Time range selector (day, week, month, quarter)
      - Interactive charts with zoom/pan
      - Agent-generated insights cards
      - Population comparison view
    - *Requirements*: Analytics View component

- [ ] 5.4. **Goals & Planning Page**
    - *Goal*: Goal management interface
    - *Details*:
      - List active goals with progress bars
      - Display agent-suggested goals
      - Goal creation form (target, deadline, milestones)
      - Calendar integration widget
      - Action plan visualization
    - *Requirements*: Goals View component

- [ ] 5.5. **Coach Chat Interface**
    - *Goal*: Real-time chat with HC Agent
    - *Details*:
      - Chat UI with message history
      - Agent indicator (shows DS/DE/HC agent)
      - Suggested questions chips
      - Typing indicators
      - Support for rich media (charts, reports)
    - *Requirements*: Coach Chat component

- [ ] 5.6. **Data Sources Management**
    - *Goal*: Manage connected health platforms
    - *Details*:
      - Display connected sources with sync status
      - Add/remove data source UI
      - Trigger manual sync button
      - Show last sync time
    - *Requirements*: Data Sources View component

---

### Phase 6: Mobile App (React Native)

- [ ] 6.1. **React Native Project Setup**
    - *Goal*: Initialize cross-platform mobile app
    - *Details*:
      - Set up React Native with Expo
      - Configure TypeScript
      - Set up React Navigation
      - Integrate with WebSocket gateway
    - *Requirements*: Mobile (React Native)

- [ ] 6.2. **Native Health Integration**
    - *Goal*: Direct integration with device health APIs
    - *Details*:
      - iOS: Integrate Apple HealthKit using react-native-health
      - Android: Integrate Google Health Connect
      - Request permissions for health data access
      - Background sync support
    - *Requirements*: Mobile health data sync

- [ ] 6.3. **Mobile Dashboard**
    - *Goal*: Core screens for mobile experience
    - *Details*:
      - Home screen with today's summary
      - Analytics screen with charts
      - Goals screen with progress
      - Coach chat screen
      - Settings screen
    - *Requirements*: Mobile Screens component

- [ ] 6.4. **Push Notifications**
    - *Goal*: Proactive check-ins and reminders
    - *Details*:
      - Set up Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs)
      - Handle notification tap to open app
      - Schedule local notifications for reminders
      - Deep link to relevant screens
    - *Requirements*: Mobile push notifications

---

### Phase 7: Knowledge Base & Intelligence

- [ ] 7.1. **Vector Database Setup**
    - *Goal*: Configure pgvector for health literature search
    - *Details*:
      - Install pgvector extension
      - Create embedding function (OpenAI embeddings or local)
      - Build embedding pipeline for research papers
      - Seed database with initial health literature
    - *Requirements*: Vector DB (pgvector)

- [ ] 7.2. **Health Literature Scraper**
    - *Goal*: Populate literature database
    - *Details*:
      - Script to fetch papers from PubMed/NASA
      - Parse PDF/text and extract metadata
      - Generate embeddings for abstracts
      - Store in database
    - *Requirements*: Health literature knowledge base

- [ ] 7.3. **Semantic Search API**
    - *Goal*: Search health literature by meaning
    - *Details*:
      - Implement vector similarity search
      - Add ranking by relevance
      - Return formatted results with citations
      - Integrate with DE Agent
    - *Requirements*: Semantic search capability

---

### Phase 8: Calendar & Goal Integration

- [ ] 8.1. **Calendar Service Implementation**
    - *Goal*: Sync goals to user calendars
    - *Details*:
      - Detect user's calendar platform (Apple, Google, Outlook)
      - Implement Apple Calendar integration (EventKit on macOS/iOS)
      - Implement Google Calendar API
      - Implement Outlook Calendar API
      - Create calendar event from workout session
    - *Requirements*: Calendar Integration Service

- [ ] 8.2. **Wearable Goal Sync**
    - *Goal*: Sync goals to Apple Watch/Google Fit activity rings
    - *Details*:
      - Apple: Write goals to HealthKit
      - Google: Update Google Fit goals
      - Handle goal conflicts and overwrites
      - Track goal completion status
    - *Requirements**: Goal sync to wearables

- [ ] 8.3. **Workout Session Scheduling**
    - *Goal*: Schedule and manage workout sessions
    - *Details*:
      - Generate workout session options based on user goals
      - Check calendar for conflicts
      - Present options to user (chat or UI)
      - Create calendar event on user selection
    - *Requirements*: Workout session scheduling

---

### Phase 9: Notification Service

- [ ] 9.1. **Email Service**
    - *Goal*: Send daily/weekly health reports via email
    - *Details*:
      - Integrate SendGrid or Resend
      - Create email templates (HTML/text)
      - Generate PDF reports (optional)
      - Schedule daily/weekly emails
    - *Requirements*: Email reports

- [ ] 9.2. **Proactive Messaging System**
    - *Goal*: Trigger check-ins and reminders
    - *Details*:
      - Define trigger conditions (user inactive, goal deadline, etc.)
      - Schedule messages via BullMQ
      - Route to user's preferred channel (WhatsApp, Telegram, etc.)
      - Handle user responses and follow-ups
    - *Requirements*: Proactive check-ins

---

### Phase 10: Testing & Quality Assurance

- [ ] 10.1. **Unit Testing**
    - *Goal*: Achieve 80%+ code coverage
    - *Details*:
      - Set up Vitest for unit tests
      - Test agent logic (trend analysis, interpretation, etc.)
      - Test data normalization
      - Test business logic
    - *Requirements*: Testing strategy (unit tests)

- [ ] 10.2. **Integration Testing**
    - *Goal*: Test service interactions
    - *Details*:
      - Test OAuth flows (with mocks)
      - Test data ingestion pipeline
      - Test agent orchestration
      - Test database operations
      - Test WebSocket protocol
    - *Requirements*: Testing strategy (integration tests)

- [ ] 10.3. **End-to-End Testing**
    - *Goal*: Test complete user flows
    - *Details*:
      - Set up Playwright for web E2E
      - Test: onboarding → connect data → receive insights
      - Test: goal setting → calendar sync
      - Test: coach chat interaction
      - Test: WhatsApp conversation flow
    - *Requirements*: Testing strategy (E2E tests)

- [ ] 10.4. **Load & Performance Testing**
    - *Goal*: Validate performance requirements
    - *Details*:
      - Use k6 for load testing
      - Test: 10,000 concurrent users
      - Verify API response < 500ms (95th percentile)
      - Verify data sync < 2 minutes
      - Verify agent analysis < 30 seconds
    - *Requirements*: Performance requirements

---

### Phase 11: Deployment & Operations

- [ ] 11.1. **Docker Packaging**
    - *Goal*: Containerize all services
    - *Details*:
      - Create Dockerfiles for gateway, web, mobile API
      - Set up multi-stage builds for optimization
      - Configure docker-compose for local dev
      - Test container orchestration
    - *Requirements*: Infrastructure (Docker)

- [ ] 11.2. **CI/CD Pipeline**
    - *Goal*: Automated testing and deployment
    - *Details*:
      - Set up GitHub Actions or similar
      - Run tests on every PR
      - Auto-build Docker images
      - Deploy to staging on merge to main
      - Manual promotion to production
    - *Requirements*: Maintainability (CI/CD)

- [ ] 11.3. **Monitoring & Logging**
    - *Goal*: Production observability
    - *Details*:
      - Set up application performance monitoring (APM)
      - Configure structured logging with correlation IDs
      - Add health check endpoints
      - Set up alerts for critical failures
      - Dashboard for system health
    - *Requirements*: Reliability (monitoring)

---

### Phase 12: Documentation & Onboarding

- [ ] 12.1. **API Documentation**
    - *Goal*: Document all APIs and WebSocket protocol
    - *Details*:
      - Use OpenAPI/Swagger for REST APIs
      - Document WebSocket protocol methods
      - Document channel adapter interface
      - Document agent tools
    - *Requirements*: Documentation (API docs)

- [ ] 12.2. **User Documentation**
    - *Goal*: Help users get started
    - *Details*:
      - Getting started guide
      - Setup wizard documentation
      - Feature guides
      - FAQ
    - *Requirements*: Usability (user docs)

- [ ] 12.3. **Developer Documentation**
    - *Goal*: Help contributors understand the codebase
    - *Details*:
      - Architecture overview
      - Contribution guide
      - Development setup
      - Agent development guide
    - *Requirements*: Maintainability (developer docs)

---

## Task Dependencies

### Critical Path (Must be sequential)
1. **Phase 0** (Project Setup) → Everything else
2. **Phase 1** (Gateway) → Phase 2 (Agents), Phase 3 (Channels)
3. **Phase 2** (Agents) → Phase 5 (Web Dashboard), Phase 6 (Mobile), Phase 9 (Notifications)
4. **Phase 3** (Channels) → Phase 9 (Notifications)
5. **Phase 4** (Data Pipeline) → Phase 2 (Agents need data)

### Can Run in Parallel
- **Phase 3** (Channels) can be developed independently after Phase 1
- **Phase 5** (Web Dashboard) and **Phase 6** (Mobile App) can run in parallel
- **Phase 7** (Knowledge Base) can be developed anytime after Phase 0
- **Phase 8** (Calendar) can run in parallel with other phases
- **Phase 10.1** (Unit Tests) can be done alongside development
- **Phase 12** (Documentation) can be done alongside development

### Recommended Execution Order
1. **MVP Foundation**: Phase 0 → Phase 1 → Phase 2 → Phase 3 (single channel, e.g., Telegram)
2. **Data Pipeline**: Phase 4 → Populate with test data
3. **Web Interface**: Phase 5 (core pages only)
4. **MVP Testing**: Phase 10 (basic tests) → Phase 11 (basic deployment)
5. **Enhancement**: Add more channels (Phase 3.5), Mobile app (Phase 6), Calendar (Phase 8)
6. **Polish**: Phase 7, Phase 9, Phase 10 (full testing), Phase 12

---

## Estimated Timeline

### By Phase
| Phase | Description | Estimate |
|-------|-------------|----------|
| 0 | Project Setup & Infrastructure | 40 hours |
| 1 | Gateway & WebSocket | 60 hours |
| 2 | Agent Framework | 80 hours |
| 3 | Channel Adapters (per channel) | 20-40 hours each |
| 4 | Data Pipeline (per platform) | 16-24 hours each |
| 5 | Web Dashboard | 100 hours |
| 6 | Mobile App | 120 hours |
| 7 | Knowledge Base | 40 hours |
| 8 | Calendar Integration | 32 hours |
| 9 | Notification Service | 24 hours |
| 10 | Testing | 60 hours |
| 11 | Deployment & Ops | 32 hours |
| 12 | Documentation | 40 hours |

### MVP Scope (Minimum Viable Product)
- **Phase 0**: Complete setup
- **Phase 1**: Full gateway implementation
- **Phase 2**: All 3 agents (DS, DE, HC)
- **Phase 3**: 1-2 channels (Telegram + WhatsApp)
- **Phase 4**: 2-3 data sources (Apple Health + Google Health + Fitbit)
- **Phase 5**: Core web dashboard (overview, analytics, chat)
- **Phase 10**: Basic testing
- **Phase 11**: Basic deployment

**MVP Total**: ~500-600 hours (~3-4 months for 1 developer, 6-8 weeks for small team)

### Full Product
- **All Phases**: ~800-1000 hours (~6-8 months for 1 developer, 3-4 months for small team)

### Team Recommendations
- **Solo Developer**: Focus on MVP, expect 6-8 months
- **2 Developers** (Frontend + Backend): MVP in 3-4 months
- **3 Developers** (Frontend + Backend + Mobile): Full product in 4-6 months
- **Small Team** (5+): Include QA, DevOps, Designer - MVP in 2-3 months
