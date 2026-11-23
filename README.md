# 🧭 RouteWise – Smart Route Planning & Optimization System

> **Academic BTech CSE (Artificial Intelligence & Machine Learning) Capstone Project**  
> Practical integration of **System Design**, **Database Management Systems (DBMS)**, **Azure Cloud Computing**, and **Cyber Security**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Azure](https://img.shields.io/badge/Azure-Cloud_Ready-0078D4?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Security](https://img.shields.io/badge/Cyber_Security-OWASP_Hardened-10B981)](#-4-cyber-security-subject-integration)

---

## 📖 Project Overview

**RouteWise** is a full-stack smart navigation and vehicle fuel optimization platform. It compares driving routes between real geographical locations, calculating real highway distances, turn-by-turn travel durations, and vehicle fuel expenses.

### Key Capabilities
- **Real Driving Routes**: Powered by OpenStreetMap and OSRM (Open Source Routing Machine) driving engine.
- **Multi-Route Alternatives**: Automatically fetches alternative routes without fabrication.
- **AI/ML Predictive Fuel & Traffic Engine**: Evaluates road hierarchy, turn densities, and time-of-day traffic congestion ($C_t$) peak multipliers (+18% morning, +22% evening).
- **Carbon Footprint (CO₂) & Eco-Routing**: Computes greenhouse emissions (IPCC factors: 2.31 kg CO₂/L Petrol, 2.68 kg CO₂/L Diesel) with equivalent tree offset absorption metrics.
- **Multi-Criteria Recommendations**:
  - ⚡ **Fastest Route** – Minimized travel time.
  - 📏 **Shortest Route** – Minimized driving distance.
  - 💰 **Cheapest Route** – Minimized estimated fuel expense.
  - 🌿 **Eco-Friendly Route** – Minimized carbon footprint (lowest CO₂ emissions).
  - 🏆 **Recommended Route** – Optimal multi-criteria balance.
- **Turn-by-Turn Step Navigation**: Interactive maneuver drawer with direction icons (turns, roundabouts, forks) and click-to-focus on the Leaflet map.
- **Multi-Stop Waypoints**: Support for intermediate via points (Origin $\to$ Stop 1 $\to$ Destination).
- **Interactive Leaflet Map**: Custom SVG markers, map tile style switcher (CartoDB Dark Matter, OSM Standard, Esri Street), and auto-fitBounds.
- **Live DBMS Query Inspector**: In-app SQL runner allowing university evaluators to execute live 3NF queries, 3-way JOINs, and aggregates with real-time execution telemetry.
- **Printable Trip Itinerary**: Formatted one-click print/export view for travelers.
- **Persistent MySQL Storage**: User authentication, search history logging, route recalculation, and travel dashboard analytics.

---

## 🏛️ Academic Subject Integrations

### 1. System Design
- **6-Tier Modular Architecture**:
  1. *Presentation Layer*: React 18 SPA, Tailwind CSS (Navy `#0B132B` and Emerald `#10B981` palette), React Leaflet.
  2. *Application Layer*: Express.js REST API with modular routers, controllers, and error handlers.
  3. *Business Logic Layer*: Route optimization, fuel calculation, and multi-objective scoring.
  4. *Data Access Layer*: MySQL connection pool (`mysql2/promise`) with resilient failover.
  5. *External Services Layer*: Photon Geocoding API and OSRM Driving Engine.
  6. *Cloud Infrastructure Layer*: Microsoft Azure deployment specifications.
- **Documentation**: Detailed system flow and architectural models in [`docs/architecture.md`](docs/architecture.md).

### 2. Database Management Systems (DBMS)
- **Relational Schema (Normalized to 3NF)**:
  - `users`: Primary key `user_id`, unique email, bcrypt hash.
  - `fuel_settings`: `setting_id`, foreign key `user_id` with `ON DELETE CASCADE`.
  - `search_history`: `search_id`, foreign key `user_id` with `ON DELETE CASCADE`.
  - `routes`: `route_id`, foreign key `search_id` with `ON DELETE CASCADE`.
- **Database Features**: Parameterized SQL queries, multi-table `JOIN` operations, aggregate queries (`COUNT`, `SUM`, `AVG`), B-tree indexes, and complete DDL/seed files in [`database/schema.sql`](database/schema.sql) and [`database/seed.sql`](database/seed.sql).
- **Documentation**: ER diagrams and normalization breakdown in [`docs/database-design.md`](docs/database-design.md).

### 3. Azure Cloud Computing
- **Azure App Service**: Production-ready deployment for Express backend with dynamic port binding (`process.env.PORT`).
- **Azure Static Web Apps**: Production-ready frontend hosting with client-side routing rewrites via `staticwebapp.config.json`.
- **Azure Database for MySQL Flexible Server**: Cloud database connectivity with SSL encryption.
- **Health Probe**: Liveness monitoring at `GET /api/health`.
- **Documentation**: Full cloud guide and budget safety instructions in [`docs/azure-deployment.md`](docs/azure-deployment.md).

### 4. Cyber Security
- **Bcrypt Password Hashing**: Passwords stored as salted hashes (10 rounds). Plain text passwords or hashes are never exposed.
- **Stateless JWT Authentication**: Signed Bearer tokens with 24-hour expiration for secure, session-less authorization.
- **Input Sanitization & Validation**: Handled via `express-validator` and `escape()`.
- **Protection Against SQL Injection**: 100% parameterized queries (`?` placeholders).
- **Hardening Headers**: `helmet()` with strict Content Security Policy (CSP).
- **Rate Limiting**: `express-rate-limit` prevents brute-force attempts.
- **Documentation**: Threat model and OWASP Top 10 audit in [`docs/security-audit.md`](docs/security-audit.md).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, Leaflet, React-Leaflet, Lucide React, Axios |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MySQL 8.0, mysql2 connection pool |
| **Routing & Maps** | Photon API (Geocoding), OSRM API (Driving paths), OpenStreetMap (Map tiles) |
| **Security** | Helmet.js, CORS, Express-Rate-Limit, Express-Validator, BcryptJS, JSONWebToken |
| **Cloud** | Microsoft Azure (App Service, Static Web Apps, MySQL Flexible Server, Health Probes) |

---

## 📁 Project Structure

```
RouteWise/
├── backend/
│   ├── config/db.js              # MySQL pool + dual driver persistent engine
│   ├── controllers/              # Auth, Route, History, Fuel controllers
│   ├── middleware/               # JWT auth, rate limiter, input validation
│   ├── routes/                   # REST API route definitions
│   ├── services/                 # Photon, OSRM, & Optimizer services
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server & health endpoint
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, MapView, RouteCard, FuelCalculator
│   │   ├── context/              # AuthContext (state & tokens)
│   │   ├── pages/                # Home, Planner, History, Dashboard, Settings, About, Login, Register
│   │   ├── services/api.js       # Axios client with interceptors
│   │   ├── App.jsx               # Routes definition
│   │   └── main.jsx
│   ├── staticwebapp.config.json  # Azure Static Web Apps config
│   ├── vite.config.js
│   └── package.json
│
├── database/
│   ├── schema.sql                # MySQL 3NF schema DDL
│   └── seed.sql                  # Realistic sample data
│
├── docs/
│   ├── architecture.md           # System design & Mermaid diagrams
│   ├── database-design.md        # DBMS schema, ERD, queries
│   ├── azure-deployment.md       # Step-by-step Azure guide
│   └── security-audit.md         # Threat model & OWASP mitigations
│
├── .github/workflows/
│   └── azure-deploy.yml          # CI/CD deployment pipeline
├── .gitignore
├── README.md
└── .env.example
```

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [Git](https://git-scm.com/)
- [MySQL 8.0](https://dev.mysql.com/downloads/installer/) (Optional for testing; RouteWise includes an automatic dual-driver store that runs out-of-the-box).

---

### Step 1: Clone Repository
```bash
git clone https://github.com/riya161106-source/RoteWise.git RouteWise
cd RouteWise
```

---

### Step 2: Configure & Start Backend
```bash
cd backend
npm install

# Copy environment variables template
cp .env.example .env

# Start Backend Server (runs on http://localhost:5000)
npm start
```

*Note: Verify backend health by visiting `http://localhost:5000/api/health`.*

---

### Step 3: Configure & Start Frontend
In a new terminal window:
```bash
cd frontend
npm install

# Start Vite Development Server
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 🔑 Evaluator Demo Credentials

For quick evaluation and grading, pre-seeded accounts are provided:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo User** | `aditya.sharma@example.com` | `password123` |
| **Secondary User**| `priya.patel@example.com` | `password123` |

*(A one-click **"Auto Fill"** button is also available on the Login page).*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime, database status, memory telemetry |
| `POST` | `/api/auth/register` | Public | Register new user with bcrypt password hashing |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile & fuel settings |
| `GET` | `/api/routes/search-location?q=...` | Public | Geocoding autocomplete suggestions via Photon |
| `POST` | `/api/routes/calculate` | Public/Auth | Calculate driving routes via OSRM, optimize fuel, persist history |
| `POST` | `/api/routes/recalculate-fuel` | Public | In-memory recalculation when fuel sliders change |
| `GET` | `/api/history` | Protected | Fetch user's saved search history with routes (JOIN query) |
| `POST` | `/api/history/:searchId/recalculate` | Protected | Recalculate route for a past search query |
| `DELETE`| `/api/history/:searchId` | Protected | Delete search history record (Cascade delete) |
| `GET` | `/api/history/analytics/stats` | Protected | Aggregate travel metrics (SQL COUNT, SUM, AVG) |
| `GET` | `/api/fuel/settings` | Protected | Retrieve saved vehicle fuel preferences |
| `PUT` | `/api/fuel/settings` | Protected | Update vehicle mileage and fuel price in MySQL |

---

## 📄 Academic Evaluation Verification Checklist

- [x] **System Design**: Modular 6-tier architecture, clean separation of concerns, sequence documentation in `docs/architecture.md`.
- [x] **DBMS**: 3NF normalized schema in `database/schema.sql`, realistic seed data in `database/seed.sql`, parameterized SQL queries, foreign key cascades, and SQL aggregate calculations.
- [x] **Azure Cloud**: App Service and Static Web Apps configuration, environment variable protection, health probes (`/api/health`), and deployment manual in `docs/azure-deployment.md`.
- [x] **Cyber Security**: Bcrypt password hashing, stateless JWT authorization, Helmet CSP headers, CORS whitelist, Express rate-limiting, and OWASP audit in `docs/security-audit.md`.
- [x] **Interactive UI**: Dark navy & emerald green theme, responsive Leaflet map, multi-criteria recommendation cards, and dynamic fuel recalculation.
