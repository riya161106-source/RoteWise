# RouteWise – University Viva Voce & Evaluation Q&A Guide

Use this comprehensive guide to prepare for your final capstone evaluation, external examiner questioning, and project defense.

---

## 🏛️ Subject 1: System Design & Architecture

### Q1: What software architecture does RouteWise follow?
**Answer:** RouteWise implements a **6-Tier Decoupled Layered Architecture**:
1. *Presentation Layer* (React 18 SPA + React Leaflet)
2. *Application Layer* (Express.js REST API with input validators and rate limiters)
3. *Business Logic Layer* (Multi-objective route optimizer, traffic multiplier, fuel & $CO_2$ calculator)
4. *Data Access Layer* (MySQL connection pool with parameterized query abstraction)
5. *External Services Layer* (Photon for geocoding & OSRM for real driving geometry)
6. *Cloud Infrastructure Layer* (Azure App Service, Static Web Apps, and Azure Database for MySQL)

### Q2: Why did you separate the Application Layer from the Business Logic Layer?
**Answer:** To maintain high cohesion and loose coupling (Single Responsibility Principle). The application controllers handle HTTP protocols, validation, and JSON formatting, while the business logic optimizer performs pure mathematical calculations (fuel consumption, carbon emissions, scoring). This makes the optimizer easily reusable in background workers or CLI scripts.

### Q3: How does the client communicate with the server and external APIs?
**Answer:** The frontend communicates with the backend via Axios REST API endpoints (`/api/*`). The backend proxies external requests to the Photon geocoding API and the OSRM driving engine to prevent exposing third-party endpoints directly to clients, implement caching, and apply rate limiting.

---

## 💾 Subject 2: Database Management Systems (DBMS)

### Q4: Explain the 3NF Normalization of your database.
**Answer:** RouteWise is normalized to Third Normal Form (3NF) across 4 tables:
- **1NF**: Every column holds atomic values (e.g. coordinates and road summaries are separated; no arrays or multi-valued attributes).
- **2NF**: In 1NF and all non-key attributes are fully functionally dependent on the entire primary key (`user_id`, `setting_id`, `search_id`, `route_id`).
- **3NF**: In 2NF and no transitive dependencies exist ($X \to Y \to Z$). For example, user vehicle preferences are kept in `fuel_settings` rather than being redundantly duplicated inside `users` or `search_history`.

### Q5: What is the purpose of `ON DELETE CASCADE` in your foreign keys?
**Answer:** To uphold referential integrity without creating orphaned child records:
- When a user is deleted from `users`, their `fuel_settings` and `search_history` are automatically deleted.
- When a search is deleted from `search_history`, all associated `routes` are automatically deleted.

### Q6: How do you defend against SQL Injection?
**Answer:** 100% of our SQL operations use **parameterized queries** with placeholder tokens (`?`). Values are passed in separate parameter arrays to `mysql2`, ensuring the database engine parses the SQL syntax first and treats all user input strictly as data literals.

### Q7: What SQL aggregate queries are implemented?
**Answer:** In `historyController.js` and the Live DBMS Query Inspector:
```sql
SELECT 
    COUNT(DISTINCT sh.search_id) AS total_searches,
    COUNT(r.route_id) AS total_routes_calculated,
    ROUND(SUM(r.distance), 2) AS total_distance_km,
    ROUND(SUM(r.estimated_fuel_cost), 2) AS total_fuel_cost_inr,
    ROUND(AVG(r.duration), 1) AS avg_trip_duration_mins
FROM search_history sh
LEFT JOIN routes r ON sh.search_id = r.search_id
WHERE sh.user_id = ?;
```

---

## ☁️ Subject 3: Azure Cloud Computing

### Q8: What Azure services are used and why?
**Answer:**
1. **Azure App Service (Linux)**: Hosts the Node.js Express backend with dynamic port binding (`process.env.PORT`) and automatic auto-scaling.
2. **Azure Static Web Apps**: Hosts the React frontend with global CDN edge delivery and client-side routing fallback via `staticwebapp.config.json`.
3. **Azure Database for MySQL Flexible Server**: Provides persistent cloud relational storage with TLS/SSL encryption.
4. **Azure Bicep / ARM Templates**: Enables automated Infrastructure as Code (IaC) deployment.

### Q9: What is the function of the `/api/health` endpoint?
**Answer:** It functions as an **Azure Liveness Probe and Load Balancer Health Probe**. Azure App Service pings this endpoint to determine whether the node container is healthy, returning uptime, memory usage (`rssMb`, `heapUsedMb`), and database connection status.

---

## 🛡️ Subject 4: Cyber Security

### Q10: How are user passwords stored securely?
**Answer:** Passwords are never stored in plain text. They are hashed using **`bcrypt`** with **10 salt rounds** ($2^{10} = 1024$ key expansion rounds). A unique random salt is generated per password, neutralizing rainbow table attacks.

### Q11: Explain your JWT implementation.
**Answer:** We use stateless **HMAC-SHA256 JSON Web Tokens (JWT)**. On successful login, the server signs a token containing `{ userId, email, name }` with a 24-hour expiration. The client sends this via the `Authorization: Bearer <token>` header, verified on protected routes by `authMiddleware.js`.

### Q12: What role does Helmet.js play in RouteWise?
**Answer:** `helmet()` hardens HTTP response headers:
- Sets **Content-Security-Policy (CSP)** allowing OpenStreetMap tiles and Leaflet markers while blocking unauthorized cross-origin scripts.
- Enforces `X-Frame-Options: DENY` to prevent clickjacking.
- Enforces `X-Content-Type-Options: nosniff` to prevent MIME-sniffing exploits.

---

## 🧠 Subject 5: AI & Machine Learning Optimization

### Q13: What makes RouteWise's fuel calculation an AI/ML model rather than a simple calculator?
**Answer:** A basic calculator uses $D / M$. RouteWise evaluates **road classification and turn densities** ($\delta$) from OSRM step geometries, classifying roads into stop-and-go city streets vs cruising highways. It applies a **time-of-day traffic congestion multiplier ($C_t$)** (morning rush hour $+18\%$, evening rush hour $+22\%$), and outputs IPCC-standard carbon emissions ($CO_2$ in kg) with tree offset equivalents.
