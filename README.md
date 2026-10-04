# Patrimoxi

Personal Wealth Tracking Application built with SvelteKit, PocketBase, and WebAwesome.

## 🚀 Stack

- **Package Manager:** [PNPM](https://pnpm.io/)
- **Frontend / Framework:** [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Backend / Database:** [PocketBase](https://pocketbase.io/)
- **UI Components:** [WebAwesome](https://webawesome.com/)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose
- **Hosting / Deployment:** Ready for [Coolify](https://coolify.io/)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ or v24+)
- [PNPM](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for running PocketBase and containerized services)

### Install Dependencies

```bash
pnpm install
```

### Local Development

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Start PocketBase via Docker Compose:
   ```bash
   docker compose up -d pocketbase
   ```
   The PocketBase Admin UI will be available at: `http://localhost:8090/_/`

3. Start the SvelteKit development server:
   ```bash
   pnpm dev
   ```
   The application will be running at `http://localhost:5173`.

---

## 🐳 Docker & Coolify

The project is pre-configured for deployment on **Coolify** using Dockerfile or Docker Compose:

### Production with Docker Compose:
```bash
docker compose up -d --build
```

- **SvelteKit App:** Port `3000`
- **PocketBase:** Port `8090` (persisted via `pb_data` volume)

---

## 📋 System Overview & Plan

This application allows you to register your bank accounts and investments, track transactions, and obtain a daily history of your total net worth through automated snapshots. The system is designed to be simple to use, self-hosted on a VPS, and focused exclusively on tracking.

### 1. Main Components

#### 1.1 Database (PocketBase)
PocketBase functions as the single backend, hosted alongside the frontend application. It manages user authentication, data storage, and provides an automatic REST API.

| Collection | Function |
|---|---|
| `accounts` | Represents each account or broker holding assets |
| `transactions` | Records each individual movement |
| `holdings` | Current positions per asset in each account |
| `snapshots` | Daily history of total value |

### 2. Daily Data Flow

#### Step A: Price Collection (Automated Job)
Once per day, the system automatically executes a silent routine that:
1. Identifies all active positions across all accounts.
2. For each ticker found:
   - Checks if recent price cache exists for that ticker.
   - If not or older than 24h, calls the appropriate API.
   - Uses Yahoo Finance for most stocks and ETFs.
   - Uses Börse Frankfurt for assets listed on XETRA/FWG.
   - Uses OpenFIGI only for identifier mapping when needed.
   - Applies automatic fallback: if one API fails, tries the next in the list.
   - Records failures in an internal log for later manual verification.

#### Step B: Currency Conversion
If you have accounts in different currencies (e.g. USD and EUR):
1. Obtain the daily exchange rate (ECB API).
2. Calculate the value of each position in the chosen base currency.
3. Store the rate used in the snapshot for future auditability.

#### Step C: Snapshot Recording
For each active account:
1. Sum all holding values after applying prices and exchange rates.
2. Store this total value with exact timestamp.
3. Optionally store breakdowns as well (value by asset type).
4. If any price failed, mark the snapshot as "partial" for visual alert.

### 3. User Features

#### 3.1 Account Management
- Add new account (name, type, institution, currency)
- Edit existing information
- Deactivate account without deleting history

#### 3.2 Transaction Management
- Manual entries with essential fields

#### 3.3 Net Worth Visualization
Main dashboard with three elements:
- **Overall summary:** Current total value, monthly change, annual change, distribution by account
- **Temporal chart:** Evolution line of net worth over time (last 30 days, 6 months, full year)
- **Breakdowns:** Distribution by asset type (stocks, bonds, funds, crypto)

Available filters:
- Period selection
- Filter by specific accounts
- Filter by asset type
- Display currency

### 4. Technical Considerations & Limits

| Provider | Daily Limit | Mitigation |
|---|---|---|
| Yahoo Finance | ~16 req/day (500/month) | Aggressive local cache; only request if >24h without update |
| Börse Frankfurt | Variable | Use minimum 24h cache |
| OpenFIGI | 25 req/min (without key) | Mapping only, not for daily prices |

Maintain a `prices_cache` table in PocketBase storing the last obtained price per ticker.

### 5. Security & Infrastructure

- **Authentication:** Username/password with PocketBase auth
- **API Keys:** Encrypted before storing in DB
- **Single-user design:** Dedicated to your personal finances
- **Backups:** Automatic daily backups of SQLite file (`pb_data`)
- **Remote access:** HTTPS via Let's Encrypt / Coolify reverse proxy

---

## 📄 License

Distributed under the [MIT](LICENSE) License.
