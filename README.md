#Detailed Plan: Personal Wealth Tracking Application

##System Overview
This application will allow you to register your bank accounts and investments, track transactions manually or via import, and obtain a daily history of your total net worth through automated snapshots. The system must be simple to use, self-hosted on your VPS, and focused exclusively on tracking—not complex budgeting or advanced financial planning.

##1. Main Components
###1.1 Database (PocketBase)
PocketBase will function as the single backend, hosted on the same server as the front-end application. It will manage user authentication, data storage, and provide an automatic REST API. The main collections will be:

Collection	Function	Key Fields
accounts	Represents each account or broker where you hold assets	Account name, type (bank/investment/crypto), base currency, financial institution, active/inactive status
transactions	Records each individual movement	Associated account, date, description, amount, category (buy/sell/dividend/deposit), asset type, symbol/ticker, quantity, price at transaction, fees, notes
holdings	Current positions per asset in each account	Associated account, ticker, asset type, quantity held, average acquisition cost, last known price, last update date
snapshots	Daily history of total value	Associated account, date/time, total value in base currency, exchange rate applied if necessary
api_keys	Stored external credentials	Provider (Yahoo/Treasury/Frankfurt/FIGI), encrypted key, active status
Relationships between tables:

Each account can have many transactions
Each account can have multiple holdings
Each snapshot is linked to a single account and specific date
##2. Daily Data Flow
Step A: Price Collection (Automated Job)
Once per day, the system automatically executes a silent routine that does the following:

Identifies all active positions across all accounts
For each ticker found:
Checks if recent price cache exists for that ticker
If not or older than 24h, calls the appropriate API
Uses Yahoo Finance for most stocks and ETFs
Uses Börse Frankfurt for assets listed on XETRA/FWG
Uses US Treasury for American government bonds
Uses OpenFIGI only for identifier mapping when needed
Applies automatic fallback: if one API fails, tries the next in the list
Records failures in an internal log for later manual verification
Step B: Currency Conversion
If you have accounts in different currencies (e.g., USD account and another in EUR):

Obtain the daily exchange rate (ECB API is a free and reliable option)
Calculate the value of each position in the chosen base currency
Store the rate used in the snapshot for future auditability
Step C: Snapshot Recording
For each active account:

Sum all holding values after applying prices and exchange rates
Store this total value with exact timestamp
Optionally store breakdowns as well (value by asset type, for example)
If any price failed, mark the snapshot as "partial" for visual alert
##3. User Features
###3.1 Account Management
Simple interface where you can:

Add new account (name, type, institution, currency)
Edit existing information
Deactivate account without deleting history (for closed brokers, for example)
View current estimated balance vs. historical
###3.2 Transaction Management
Each purchase, sale, deposit, or dividend is recorded as a transaction:

Manual entries: simple form with essential fields
Partial import: CSV from bank statement or BROKER (optional, future phase)
Automatic categorization rules: e.g., transactions from bank "XX" with description "Dividends" classify automatically as "dividend" category
###3.3 Net Worth Visualization
Main dashboard with three elements:

Element	Content
Overall summary	Current total value, monthly change, annual change, distribution by account
Temporal chart	Evolution line of net worth over time (last 30 days, 6 months, full year)
Breakdowns	Pie or bars showing distribution by asset type (stocks, bonds, funds, crypto)
Available filters:

Period selection (customizable)
Select only certain accounts
Filter by asset type (only stocks, only bonds, etc.)
Display currency (convert everything to EUR, USD, or show separately)
##4. Architecture Decisions
###4.1 Frontend: SvelteKit
Why?

Extremely fast and lightweight (ideal for internal dashboards)
Simple synchronization with local stores
Static compilation for simple deployment
Mature ecosystem of visual components
Key components to build:

Main dashboard (overview)
Account list (full CRUD)
Transaction form
Transaction list with filter and search
Details page per account
Settings (API keys, base currency, snapshot time)
###4.2 Backend: PocketBase
Advantages:

Zero initial configuration required
Admin panel already built (you can manage data directly if desired)
Integrated authentication without writing extra code
Webhooks and hooks for automation
Simple backup (just a SQLite file + uploads)
Limitations to consider:

Vertical scaling only (not horizontal)
Limited to ~10k requests/second maximum
For your use case (one user, several hundred requests/day), it's more than enough
##5. Important Technical Considerations
###5.1 Free API Limitations
Provider	Daily Limit	Mitigation
Yahoo Finance	~16 requests/day (500/month)	Aggressive local cache; only request if >24h without update
US Treasury	No explicit limit	Can request directly daily
Börse Frankfurt	Variable (delayed data)	Use minimum 24h cache
OpenFIGI	25 requests/min (without key)	Use only for mapping, not for daily prices
Recommended strategy: Maintain a prices_cache table in PocketBase storing the last obtained price per ticker. Before calling the API, check if the cache is less than 24h old. Only then make the external call.

###5.2 Error Handling
If an API fails during the snapshot:

Record the error with ticker and message
Mark the snapshot as "partial" or "delayed"
Continue with other assets that worked
In the dashboard, show discreet warning "some prices not updated"
Retry attempt on the next cycle
Should not block the entire system if a single price fails.

###5.3 Security
Aspect	Measure
Authentication	Username/password with optional 2FA
API Keys	Encrypted before storing in DB
Financial data	Only you are the user (single-user)
Backups	Automatic daily backups of SQLite file to external storage
Remote access	HTTPS mandatory (Let's Encrypt certificate via Coolify)
Important note: As it's self-hosted, physical and network security depends on your VPS. Ensure firewall configured, SSH with key only, and regular OS updates.

##6. Implementation Timeline by Phases
Phase 1: Foundation (Week 1)
Set up PocketBase on Coolify
Create all collections according to schema
Configure basic authentication
Test SvelteKit ↔ PocketBase connection
Create basic admin panel for manual data entry
Phase 2: API Integration (Week 2)
Implement Yahoo Finance client (via yfinance or direct API)
Implement US Treasury client (public API direct)
Implement Börse Frankfurt client (via bf4py library or careful scraping)
Create local price caching system
Test each API individually with real data
Phase 3: Snapshot Engine (Week 3)
Create scheduled job running daily
Implement aggregation logic per account
Implement currency conversion (ECB API)
Create execution log for debugging
Test with simulated historical data
Phase 4: Frontend (Week 4)
Main dashboard with net worth evolution chart
Account listing with visual status
New transactions form
Transaction history per account
Interactive filters on chart
Phase 5: Refinement (Week 5)
Robust error handling
Visual notifications for problems
Data export (CSV/JSON)
Backup automation configured
Internal documentation
Phase 6: Launch (Week 6)
Final deployment on VPS
Test with real data for 7 days
Final UX adjustments
Monitoring setup (uptime, logs)
Backup tested and validated
##7. Required Resources
Infrastructure
Resource	Minimum Specification	Justification
VPS	2 vCPU, 4GB RAM	Run SvelteKit + PB + daily job
Storage	20GB SSD	Data + historical backups
Traffic	50GB/month	Peak views + API calls
Domain	Own subdomain	HTTPS with Let's Encrypt
Estimated budget: €5-10/month depending on VPS provider (Hetzner, DigitalOcean, OVH).

Suggested External Libraries
Function	Library	Reason
Charts	Apache ECharts	Powerful, free, good filter support
Scheduling	node-cron	Simple, reliable for daily jobs
HTTP Client	ky or got	SvelteKit friendly, robust error handling
UI Components	svelte-headlessui	Accessible, customizable, lightweight
##8. Success Metrics
The system will be considered functional when:

Daily snapshots occur without failures for 14 consecutive days
Dashboard loading time < 2 seconds on home network
Data accuracy: periodic manual comparison with official sources confirms < 1% difference margin
Zero data loss: restored backup test confirms integrity
User experience: adding new transaction in < 30 seconds
##9. Future Maintenance (Optional)
Once stable, you could consider:

Push notifications: alerts when a snapshot fails
External comparisons: benchmarks with indices (S&P 500, Euro Stoxx)
Bank integration: OFX/QFX automatic import (more complex)
Mobile: Progressive Web App for checking on phone
Multiple users: if you want to share view with partner/family member
10. Conclusion
This plan allows you to build a personal tool, controlled, and adapted exactly to your needs without the weight and complexity of ready-made solutions like Ghostfolio. The chosen technology (SvelteKit + PocketBase) is mature, well-documented, and suitable for self-hosting on a common VPS.

The biggest technical challenge will be keeping API calls within free limits while ensuring consistent data. The aggressive caching strategy solves most of this problem.

Immediate next step: Set up PocketBase on your VPS and create the first collections. After that, we can detail the complete JSON schema or help with integration of a specific API.
