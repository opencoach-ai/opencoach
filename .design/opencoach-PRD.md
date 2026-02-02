# OpenCoach

The first open-source forward-agent to support personal health.

## Principal

- GOAL: Acquired by OpenAI. Intergrate into ChatGPT Health to .
- What is [[forward-agent-PRD]]: 
	- Monster for eating data and tokens. 
	- OpenClawd/ClawdBot/Ralph. 24/7. Autonomous. Proactive. Lifelong. Full-self. Relentless. 
	- Self-host event. Lead, supervise, manage, and spur humans to complete tasks. 
	- Only ask for permission from those who own options. 
	- The next step of physical AI is not humanoid. It is the virtual AI (forward-agent) drives human movement in the physical world.
	- Anchor to daily life. Feeling-less. Know everything. Only act when needed. 
	- Observation event → ReAct.
	- LLM > Algorithm for making any decisions. Trust model.
- win-win
	- Service potential buyer: Insurance Company (e.g. Kaiser Permanente). The story is that health behavior will extend the lifespan and life expectancy and benifit to early disease prevention, which can decrease the cost of reimbursement for insurance companies.
	- Tech company wins: They want Data -> Training Model -> Scaling -> Valuation.
	- Insurance company wins: They want to decrease reimbursement costs & extend service -> increase insurance premiums.
	- Government wins: Decrease public healthcare costs.
	- User wins: Just pay for ChatGPT's subscription. Maybe ChatGPT will accquire insurance company or push some insurance product if ChatGPT's health features contiously growing up. Who knows?

## Requirements

- AI-native app: - Build based on [Agent-native Architectures: How to Build Apps After Code Ends](https://every.to/guides/agent-native)
- Fully access data and operating system permissions from users:
  - Auto-extract all health data (daily physical activity, fitness, sleep) from users (Apple Health, Google Health, Function, MyFitnessPal, other apps, and wearables) to the file system from users' local device (GitHub open source version) or the OpenCoach's database (subscribed membership).
- Analyze data and generate professional, personal insights:
  - Record and analyze personal health data by a data science sub-agent.
  - Compare results with current scientific evidence and authentic statements.
  - Generate professional and clean personal daily reports.
- Deliver results:
  - Deliver clean personal reports through email and explain insights to users.
- Transfer to action:
  - Set achievable goals (e.g. physical activity and sleep time) to the users' edge (Apple activity) and personal portal.
  - Put exercise training session options that allow the user to choose and schedule them on the Omail calendar and auto-update to the calendar (Apple Calendar for iOS, Google Calendar for Android, Outlook Calendar for Windows).
- Irreteration and transformation:
  - Book motivational interviewing for health behavior improvement or maintenance.
  - Connect electronic medical records through ChatGPT Health API for further specific personal health support and clinical consultation.

## Agent Framework
### Sub-agents
- The Data Science Agent (DS Agent) analyzes the user’s personal health data from wearables (e.g., Fitbit) alongside population-level time-series data to derive numerical insights, such as estimating changes in running speed from workout logs (e.g., “Has my running gotten faster since last month?”).
- The Domain Expert Agent (DE Agent) draws on personal health records and wearable data to provide domain-specific and contextualized interpretations, such as explaining specific biomarkers or general health conditions (e.g., “Is a blood pressure of 137 over 83 fine?”) or comparing a user’s data to general population statistics.
- Finally, the Health Coach Agent (HC Agent) applies evidence-based psychological strategies, like motivational interviewing, to help users set appropriate goals, identify barriers, and develop personalized plans to foster lasting behavior change.

### Inital Idea

OpenCoach, facing ChatGPT Health. Agent-host/lead/supervised/managed with Human Index (Create a Benchmark, Extend Health Span. Refer real-world practical
Benchmark: Remote Labor Index, RLI): Real-World (add a social map to build social community) Personal Health/GP Agent/Coach Agent (based wearables including Apple Watch、WHOOP、Orau ring，Luna ring, etc) fetch data (e.g. mainly activity, sleep, sedentary) from Apple Health and create web-based dashboard to analysis and parse, then through email to book meeting/conversation with customer like a personal health consultant/GP/coach to discussing using the dashboard/canva to visualise data, schedule self-care/daily exercise plan (excalidraw style) and set the goal on to the calendar (omail, third-party api) and continue monitoring the metrics.

### Other Features (out of scope)

- [ ] Tokenize personal health metrics (e.g. SkinMicroCoin). Let the public people self-drivenlly improve their own health, and also can make money. Who pays for it? Government? Learn from the Singapore government. Insurance company? Maybe not, the traditional insurance company is not willing if the government does not pay for it.
- [ ] Continuously track location through GPS for daily route?
- [ ] It’s a human movement campaign, so the user could invite families and friends join their program. Agents manage humans. Use can giving gift card during the holiday, like an OpenCoach membership, to fully support their health.

### Other Idea


### Related Works 

- Heydari et al., 2025. The Anatomy of a Personal Health Agent
- Khasentino et al., 2025. A personal health large language model for sleep and fitness coaching
- Merrill et al., 2025. Transforming Wearable Data into Personal Health Insights using Large Language Model Agents
- Srinivas et al., 2025. Substance over Style: Evaluating Proactive Conversational Coaching Agents
- 


