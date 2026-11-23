# ROUTEWISE – MASTER VIVA VOCE & EVALUATION GUIDE
## Complete Questions & Answers for B.Tech Capstone Examination

This master guide prepares you for any question an external or internal examiner can ask about **RouteWise**. It covers theoretical foundations, code implementation details, mathematical formulas, and smart answers to common examiner "trap" questions.

---

## 📑 Quick Navigation
1. [General & High-Level Project Questions (Q1 - Q5)](#1-general--high-level-project-questions)
2. [Subject 1: System Design & Architecture (Q6 - Q10)](#2-subject-1-system-design--architecture)
3. [Subject 2: Database Management Systems - DBMS (Q11 - Q15)](#3-subject-2-database-management-systems---dbms)
4. [Subject 3: Azure Cloud Computing (Q16 - Q20)](#4-subject-3-azure-cloud-computing)
5. [Subject 4: Cyber Security (Q21 - Q25)](#5-subject-4-cyber-security)
6. [Subject 5: AI & Machine Learning Optimization (Q26 - Q30)](#6-subject-5-ai--machine-learning-optimization)
7. [Examiner "Trap" Questions & Winning Responses](#7-examiner-trap-questions--winning-responses)

---

## 1. General & High-Level Project Questions

### Q1: What is RouteWise in one sentence?
**Answer:** RouteWise is an intelligent, multi-criteria route planning and optimization system that evaluates real-world road networks to provide motorists with the fastest, shortest, and most eco-friendly route based on vehicle fuel consumption, time-of-day traffic patterns, and carbon emissions.

### Q2: Why did you build RouteWise instead of using Google Maps?
**Answer:** Google Maps optimizes primarily for a single parameter: **estimated travel time (ETA)**. It does not allow users to input their specific vehicle fuel mileage (km/L) or current fuel prices (₹/L) to calculate the exact monetary cost of a trip in Rupees. Furthermore, commercial apps do not quantify $CO_2$ greenhouse gas emissions or model urban stop-and-go deceleration penalties. RouteWise provides multi-criteria transparency across time, money, and ecology.

### Q3: What are the main technologies used in this project?
**Answer:**
- **Frontend:** React 18, Vite, React-Leaflet, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js REST API.
- **Database:** MySQL 8.0 normalized to 3NF with connection pooling (`mysql2`).
- **Geospatial & Maps:** OpenStreetMap, Leaflet Engine, OSRM (Open Source Routing Machine), Photon Geocoder.
- **Cloud Infrastructure:** Microsoft Azure App Service, Azure Static Web Apps, Azure Bicep (IaC).
- **Security:** `bcrypt` (10 rounds), JSON Web Tokens (JWT), Helmet.js, CORS, Express Rate Limiters.

### Q4: Does RouteWise require any paid API keys (like Google Maps API)?
**Answer:** **No, absolutely zero paid API keys.** RouteWise uses open-access OpenStreetMap tiles and the open-source OSRM routing engine. This guarantees zero operational subscription cost and zero vendor lock-in.

### Q5: What are the primary user features available in the system?
**Answer:**
1. Multi-stop route planning with dynamic waypoints.
2. Real-time geocoding autocomplete.
3. Multi-objective route scoring (`FASTEST`, `ECO-FRIENDLY`, `BALANCED`).
4. Turn-by-turn navigation instructions with interactive map fly-to focus.
5. Personalized fuel efficiency settings (Petrol / Diesel, Mileage, Fuel Price).
6. Live DBMS SQL Query Inspector on the Dashboard for evaluators.
7. System health telemetry monitoring (`/api/health`).

---

## 2. Subject 1: System Design & Architecture

### Q6: What architectural pattern does RouteWise follow?
**Answer:** RouteWise implements a **Decoupled 6-Tier Architecture**:
1. *Presentation Tier* (React 18 SPA + React Leaflet)
2. *Application Gateway Tier* (Express.js REST API with security middleware)
3. *Business Logic & AI/ML Tier* (Optimization algorithms, traffic model, carbon calculation)
4. *Data Persistence Tier* (MySQL connection pool with relational fallback store)
5. *External Geospatial Tier* (OSRM driving engine and Photon geocoder)
6. *Cloud Infrastructure Tier* (Azure Static Web Apps, App Service, and Bicep IaC)

### Q7: Why did you separate the Application Tier from the Business Logic Tier?
**Answer:** To enforce the **Single Responsibility Principle (SRP)** and ensure high cohesion and loose coupling. The application controllers (`controllers/`) handle HTTP requests, input validation, and JSON formatting. The optimizer services (`services/optimizerService.js`) are pure mathematical functions that take inputs (distance, maneuvers, time, mileage) and return computed metrics (fuel, cost, $CO_2$, badges). This allows the optimizer to be tested independently in unit tests without needing an HTTP server.

### Q8: How does the client communicate with external APIs?
**Answer:** The client **never communicates directly with third-party external APIs**. All requests pass through our Express backend proxy endpoints (`/api/routes/calculate`, `/api/routes/geocode`). This architecture:
- Prevents exposing external API structures to the client.
- Enables server-side caching of frequent routes.
- Enforces rate limiting and input validation before forwarding requests.

### Q9: How does RouteWise handle server failure or network disconnection?
**Answer:** Through **Graceful Degradation and Resilient Fallbacks**:
- If the OSRM routing server is unreachable, the system activates the internal **Haversine Geodesic Algorithm** to compute great-circle distance bounds and fallback routes.
- If the MySQL database is unreachable, the database wrapper seamlessly activates an internal **relational JSON persistence store**, ensuring the application continues serving without crashing.

### Q10: How would you scale RouteWise to handle 100,000 concurrent users?
**Answer:**
1. **Frontend:** Already hosted on Azure Static Web Apps / CDN edge nodes with zero compute load on the server.
2. **Backend API:** Azure App Service can scale out horizontally by adding multiple worker instances behind an Azure Load Balancer.
3. **Caching:** Deploy a **Redis cache** in front of OSRM to cache popular origin-destination geometries (e.g. Airport to City Center).
4. **Database:** Implement MySQL read-replicas for `GET /api/history` queries and keep the primary database for `POST /api/routes` writes.

---

## 3. Subject 2: Database Management Systems (DBMS)

### Q11: Explain the Third Normal Form (3NF) normalization of RouteWise.
**Answer:** The database is structured into 4 normalized tables: `users`, `fuel_settings`, `search_history`, and `routes`:
- **1NF (Atomicity):** Every attribute holds indivisible values. Coordinates are stored in separate `source_lat`, `source_lng`, `dest_lat`, `dest_lng` columns instead of concatenated strings.
- **2NF (No Partial Dependencies):** Every non-key attribute is fully functionally dependent on the primary key of its table (`user_id`, `setting_id`, `search_id`, `route_id`).
- **3NF (No Transitive Dependencies):** No non-key attribute depends on another non-key attribute ($A \to B \to C$). For example, user vehicle mileage is stored in `fuel_settings`, not duplicated inside `search_history` or `routes`.

### Q12: What is the purpose of `ON DELETE CASCADE` in your database?
**Answer:** It enforces **referential integrity**. 
- When a user is deleted from `users`, their associated `fuel_settings` and `search_history` are deleted automatically by the database engine.
- When a search is deleted from `search_history`, all corresponding route options in `routes` are deleted automatically. This guarantees that no orphaned records remain in the database.

### Q13: How does RouteWise defend against SQL Injection attacks?
**Answer:** 100% of SQL queries in RouteWise use **parameterized queries** with placeholder tokens (`?`) using the `mysql2/promise` library. The database engine pre-compiles the SQL syntax before binding user values. Therefore, even if a user enters malicious SQL payloads (like `' OR '1'='1`), the database treats the input strictly as literal string data, completely neutralizing SQL injection.

### Q14: Explain the multi-table JOIN query used in the DBMS Query Inspector.
**Answer:**
```sql
SELECT 
    u.name,
    COUNT(DISTINCT sh.search_id) AS trips_planned,
    COUNT(r.route_id) AS routes_evaluated,
    ROUND(SUM(r.distance), 2) AS total_distance_km,
    ROUND(SUM(r.estimated_fuel_cost), 2) AS total_fuel_cost_inr,
    ROUND(AVG(r.duration), 1) AS avg_duration_mins
FROM users u
INNER JOIN search_history sh ON u.user_id = sh.user_id
INNER JOIN routes r ON sh.search_id = r.search_id
GROUP BY u.user_id, u.name;
```
This query performs an `INNER JOIN` across three relational tiers, linking the user identity to their search events and then to the computed route options, calculating aggregate sums and averages per user.

### Q15: What indexing strategy did you implement for performance?
**Answer:** We indexed foreign key columns:
- `INDEX idx_fuel_user (user_id)` on `fuel_settings`
- `INDEX idx_search_user (user_id)` on `search_history`
- `INDEX idx_route_search (search_id)` on `routes`
- `INDEX idx_search_time (search_timestamp)` on `search_history`
This transforms search history retrieval queries from $O(N)$ full-table scans to $O(\log N)$ B-tree index lookups.

---

## 4. Subject 3: Azure Cloud Computing

### Q16: What Microsoft Azure cloud services are utilized?
**Answer:**
1. **Azure Static Web Apps:** Hosts the pre-compiled React 18 production bundle with global CDN edge delivery and automated HTTPS.
2. **Azure App Service (Linux B1):** Runs the containerized Node.js Express backend with automated health monitoring.
3. **Azure Database for MySQL Flexible Server:** Provides managed relational persistence with automated backups and TLS 1.3 encryption.
4. **Azure Bicep / ARM:** Provides declarative Infrastructure as Code (IaC) templates for one-command deployment.

### Q17: What is Infrastructure as Code (IaC) and how is it used in RouteWise?
**Answer:** Infrastructure as Code is the practice of provisioning and managing cloud infrastructure using code files rather than manual clicks in a cloud portal. RouteWise provides an **Azure Bicep** template (`infra/main.bicep`). Running our deployment script (`infra/deploy.ps1`) automatically provisions the App Service Plan, Linux Web App, and environment configuration in a single step.

### Q18: What is the purpose of the `/api/health` endpoint?
**Answer:** It serves as an **Azure Liveness and Readiness Probe**. Azure App Service and cloud load balancers periodically ping this endpoint. If the server is healthy, it returns HTTP 200 with uptime, heap memory usage, and database connection state. If memory leaks occur or the database crashes, the load balancer detects the failure and restarts the container automatically.

### Q19: How are environment secrets managed in the cloud?
**Answer:** Secrets such as `JWT_SECRET`, `DB_HOST`, and `DB_PASSWORD` are never hardcoded into Git. In local development, they reside in `.env`. On Microsoft Azure, they are securely stored in **Azure App Service Application Settings** or injected from **Azure Key Vault**.

### Q20: How does client-side routing work when deployed on Azure Static Web Apps?
**Answer:** SPAs using React Router rely on HTML5 History API. When a user refreshes `http://myapp.azurestaticapps.net/planner`, the cloud server must not return 404. We configured `staticwebapp.config.json` with a navigation fallback rule routing all unhandled requests back to `/index.html`.

---

## 5. Subject 4: Cyber Security

### Q21: How are passwords secured in RouteWise?
**Answer:** Passwords are never stored in plaintext. We use **`bcrypt`** with **10 salt rounds** ($2^{10} = 1024$ key expansion rounds). A unique cryptographically random salt is generated for each user, completely neutralizing rainbow table attacks and pre-computed hash lookup tables.

### Q22: Explain your stateless JWT authentication mechanism.
**Answer:** We use JSON Web Tokens (JWT) signed with the **HMAC-SHA256** algorithm.
1. When a user logs in with valid credentials, the server signs a payload containing `{ userId, email, name }` with a 24-hour expiration (`expiresIn: '24h'`).
2. The client stores the token and includes it in the `Authorization: Bearer <token>` header for subsequent requests.
3. Protected endpoints pass through `authMiddleware.js`, which cryptographically verifies the token signature without querying the database, enabling stateless horizontal scaling.

### Q23: What security headers does Helmet.js configure in RouteWise?
**Answer:**
- **Content-Security-Policy (CSP):** Restricts script, style, and image sources to prevent Cross-Site Scripting (XSS). Specifically allows OpenStreetMap tile domains (`*.tile.openstreetmap.org`).
- **X-Frame-Options: DENY:** Prevents the app from being embedded inside external iframes, blocking Clickjacking attacks.
- **X-Content-Type-Options: nosniff:** Disables MIME-type sniffing, forcing browsers to respect declared Content-Types.
- **X-XSS-Protection:** Enables legacy browser XSS filters.

### Q24: How does RouteWise prevent Denial of Service (DoS) and Brute-Force attacks?
**Answer:** We implement **Express Rate Limiting** with distinct thresholds:
- **Authentication Endpoints (`/api/auth/*`):** Restricted to **20 requests per 15 minutes** per IP address to thwart dictionary and brute-force password cracking attempts.
- **General API Endpoints (`/api/*`):** Restricted to **100 requests per 15 minutes** per IP address to prevent resource exhaustion and OSRM proxy flooding.

### Q25: How does CORS protection work in RouteWise?
**Answer:** Cross-Origin Resource Sharing (CORS) is explicitly configured using the `cors` middleware. The backend allows requests only from authorized frontend origins (e.g., `http://localhost:5173` in development, or the production Azure domain), preventing rogue third-party websites from making cross-origin requests to our backend.

---

## 6. Subject 5: AI & Machine Learning Optimization

### Q26: What makes RouteWise's fuel model an AI/ML algorithm rather than a basic calculator?
**Answer:** A basic calculator simply evaluates $\text{Distance} / \text{Mileage}$. RouteWise models real driving dynamics through **feature engineering and temporal regression**:
1. It extracts OSRM turn geometries to compute **Turn Density ($\delta$)**.
2. It classifies the road topology into highway cruising vs dense urban stop-and-go streets ($\rho_{\text{road}}$).
3. It detects the departure hour and applies a **time-of-day traffic congestion coefficient ($C_t$)**.
4. It dynamically assigns route categories (`FASTEST`, `ECO-FRIENDLY`, `BALANCED`) using multi-objective Pareto ranking.

### Q27: State the complete mathematical formula for predicted fuel consumption.
**Answer:**
$$F_{\text{predicted}} = \left(\frac{D}{M}\right) \times C_t \times \rho_{\text{road}}$$
$$\text{Fuel Cost (₹)} = F_{\text{predicted}} \times P$$
Where:
- $D$ = Route Distance in km.
- $M$ = Vehicle Mileage in km/L.
- $P$ = Fuel Price in ₹/L.
- $C_t$ = Time-of-day congestion factor ($1.18$ for morning peak, $1.22$ for evening peak, $0.95$ for off-peak night).
- $\rho_{\text{road}}$ = Road complexity penalty ($1.08$ for high turn densities $\delta \ge 0.4$, $0.96$ for highway cruising $\delta < 0.1$).

### Q28: How are carbon emissions ($CO_2$) calculated?
**Answer:** Following **IPCC (Intergovernmental Panel on Climate Change)** standards:
- Petrol combustion produces **$2.31\text{ kg } CO_2$** per litre.
- Diesel combustion produces **$2.68\text{ kg } CO_2$** per litre.
$$\text{Trip } CO_2 \text{ (kg)} = F_{\text{predicted}} \times \text{Emission Factor}$$

### Q29: How does the system compute Tree Offset equivalents?
**Answer:** A mature urban tree absorbs approximately $21.77\text{ kg}$ of $CO_2$ annually, which equals $0.0596\text{ kg}$ of $CO_2$ per day. RouteWise calculates:
$$\text{Tree Days Required} = \frac{\text{Trip } CO_2 \text{ (kg)}}{0.0596\text{ kg/day}}$$
This converts abstract carbon numbers into an intuitive environmental metric for the user.

### Q30: What algorithm does OSRM use internally to find routes so quickly?
**Answer:** OSRM uses **Contraction Hierarchies (CH)** on OpenStreetMap road network graphs. While standard Dijkstra's algorithm requires $O(|E| + |V| \log |V|)$ and is too slow for continental maps, Contraction Hierarchies pre-process the graph into hierarchical shortcuts, allowing shortest path queries across millions of nodes to execute in just **a few milliseconds**.

---

## 7. Examiner "Trap" Questions & Winning Responses

### Trap 1: *"Why are you using OpenStreetMap instead of Google Maps API?"*
- **Weak Answer:** *"Because Google Maps is paid."*
- **Winning Answer:** *"Google Maps API requires mandatory credit card billing, enforces rate caps, and functions as a black box where underlying road hierarchy and turn geometry cannot be inspected. OpenStreetMap and OSRM provide complete topological graph transparency, open-source compliance, zero vendor lock-in, and zero operational API cost for academic and production deployment."*

### Trap 2: *"Is your traffic model really AI or just hardcoded if-else statements?"*
- **Weak Answer:** *"It's just formulas."*
- **Winning Answer:** *"The traffic model represents a **Heuristic Feature-Engineered Predictive Model**. In industrial AI/ML systems, before training deep neural networks, domain experts engineer regression coefficients based on empirical traffic congestion data (such as the Highway Capacity Manual). Our model extracts dynamic spatial features ($\delta$) and temporal features ($t$) to predict energy dissipation. In our future scope, this baseline feeds a reinforcement learning Q-agent for adaptive signal anticipation."*

### Trap 3: *"What happens if MySQL goes down during presentation?"*
- **Winning Answer:** *"We engineered RouteWise with enterprise fault tolerance. If MySQL becomes unreachable due to network drops, our data access wrapper immediately activates an internal relational JSON persistence store (`local_store.json`), allowing the user to continue planning routes, calculating fuel, and saving history without a single crash or error."*

### Trap 4: *"Why do you store coordinates as numbers instead of a GeoJSON string in MySQL?"*
- **Winning Answer:** *"To adhere strictly to First Normal Form (1NF) and optimize query performance. Storing latitude and longitude in separate decimal columns allows MySQL to execute bounding-box range queries (`WHERE lat BETWEEN ... AND ...`) and leverage spatial indexing (`SPATIAL INDEX`), whereas storing a string would require slow substring parsing."*
