# ROUTEWISE: OFFICIAL PRACTICAL EVALUATION DOSSIER
## Master 7-Point Evaluation Defense & Demonstration Cheatsheet

**Candidate Name:** Riya  
**Degree:** Bachelor of Technology in Computer Science & Engineering (AI & ML)  
**Academic Year:** 2026 – 2027  
**Repository:** [https://github.com/riya161106-source/RoteWise](https://github.com/riya161106-source/RoteWise)  

---

> [!IMPORTANT]
> This master dossier directly maps your project to the **exact 7 evaluation criteria** specified by the university examination board. Keep this open or review it right before your viva!

---

## ⓵ PROJECT IDEA (Problem Statement & Proposed Solution)

### The Problem
* **Single-Variable Blindness:** Commercial navigation systems (Google Maps, Waze) optimize almost exclusively for **travel time (ETA)**.
* **Opaque Fuel Costs:** They treat fuel consumption as a static or hidden parameter, giving commuters zero visibility into how much money (in Rupees ₹) they spend across alternative paths based on their specific car, bike, or SUV mileage (km/L).
* **Ignored Road Deceleration:** Standard distance calculations ignore the extreme energy waste caused by stop-and-go city traffic, multiple traffic signals, and frequent turns compared to smooth highway cruising.
* **No Environmental Accountability:** Commuters lack visibility into the exact carbon footprint ($CO_2$ in kg) produced per trip.

### The RouteWise Solution
* An intelligent multi-criteria route planning and optimization system.
* Combines **OpenStreetMap topological road graphs** (via OSRM) with a feature-engineered **AI/ML predictive fuel and traffic model**.
* Computes exact fuel cost in **Rupees (₹)**, quantitative greenhouse gas output ($CO_2$ in kg), and environmental **Tree Offset equivalents**.
* Dynamically classifies and compares routes using multi-objective badges: **`FASTEST`**, **`ECO-FRIENDLY`**, **`SHORTEST`**, and **`RECOMMENDED`**.

---

## ⓶ DESIGN (Architecture, Data Flow, UI/UX & Approach)

### System Architecture
RouteWise implements a **Decoupled 6-Tier Architecture**:
1. **Tier 1 (Presentation):** React 18 SPA + React-Leaflet + Tailwind CSS.
2. **Tier 2 (Application Gateway):** Express.js REST API with Helmet CSP, CORS whitelisting, and Rate Limiters.
3. **Tier 3 (Business & AI/ML Services):** `optimizerService.js` and `routingService.js` implementing turn density, time-of-day traffic, and IPCC carbon models.
4. **Tier 4 (Data Persistence):** MySQL 8.0 normalized to 3NF with connection pooling and automated JSON relational fallback.
5. **Tier 5 (External Geospatial):** OSRM routing engine (Contraction Hierarchies) and Photon Geocoder.
6. **Tier 6 (Cloud Infrastructure):** Microsoft Azure App Service, Azure Static Web Apps, and Azure Bicep IaC.

### UI/UX Design Approach
- **Cyberpunk Navy Aesthetic:** Deep Navy background (`#0B132B`) reducing eye fatigue during day/night driving.
- **Emerald Green (`#10B981`):** Denotes eco-friendly choices and active paths.
- **Zero-Key Map Layer:** Standard OpenStreetMap tiles (100% free, open access, zero API key popups).
- **Interactive Fly-To:** Clicking any turn maneuver smoothly animates and zooms the camera to that exact junction.

---

## ⓷ IMPLEMENTATION (Technologies & Development Stack)

| Component | Technologies Used | Rationale / Why Used |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, Vite 5 | Fast Single Page Application (SPA) rendering with Hot Module Replacement (HMR). |
| **Map Engine** | Leaflet, React-Leaflet | Open-source, lightweight interactive mapping with zero paid API keys. |
| **Styling** | Tailwind CSS, Lucide Icons | Utility-first responsive design with clean dark-mode typography. |
| **Backend API** | Node.js, Express.js | Asynchronous event-driven I/O, modular routing, and lightweight execution. |
| **Relational Database** | MySQL 8.0 (`mysql2`) | 3NF normalized persistence with ACID transactions and foreign key constraints. |
| **Geospatial Engine** | OSRM, Photon | High-speed shortest-path road graph calculations (Contraction Hierarchies). |
| **Cloud & IaC** | Microsoft Azure, Azure Bicep | Production-ready cloud topology with declarative Infrastructure as Code. |
| **Security Packages** | `bcrypt`, `jsonwebtoken`, `helmet`, `cors`, `express-rate-limit` | Industry-standard OWASP Top 10 web application defenses. |

---

## ⓸ FUNCTIONALITY (Step-by-Step Live Demonstration Checklist)

During your live demonstration, perform this **5-minute sequential walkthrough**:

1. **Step 1: Vehicle Fuel Settings Configuration**
   - Click **Fuel Settings** in navbar.
   - Show how changing Mileage (`15 km/L`), Fuel Price (`₹102.50`), and Fuel Type (`Petrol` vs `Diesel`) updates the mathematical calculation model.
2. **Step 2: Multi-Stop Route Discovery**
   - In Planner, enter Source (e.g., `Bengaluru`) and Destination (e.g., `Mysuru`).
   - Demonstrate the debounced **autocomplete dropdown** as you type.
   - Click **`+ Add Waypoint`** and insert an intermediate stop (e.g., `Mandya`).
3. **Step 3: Route Comparison & Badges**
   - Click **"Find Optimized Routes"**.
   - Show the evaluator how RouteWise presents alternative paths side-by-side.
   - Point out the **`FASTEST`** badge (expressway) vs the **`ECO-FRIENDLY`** badge (less fuel/carbon).
   - Explain the **Tree Offset Metric** (how many tree-days absorb the trip's $CO_2$).
4. **Step 4: Turn-by-Turn Guidance & Camera Fly-To**
   - Click **"View Turn-by-Turn Directions"**.
   - Click any maneuver step in the list $\to$ observe the map smoothly **flying to that junction** with high zoom!
   - Click **Map Style** to show real-time switching between OpenStreetMap, Esri World Street, and OpenTopoMap.
5. **Step 5: Live Evaluator DBMS Query Inspector**
   - Go to **Dashboard** or **About** page.
   - Click **"Run Relational Analytics Query"** $\to$ Show live execution of multi-table `JOIN` and aggregate calculations (`COUNT`, `SUM`, `AVG`).
   - Show the `/api/health` diagnostics telemetry probe.

---

## ⓹ CODE QUALITY (Source Code, Logic & Best Practices)

* **Separation of Concerns (SoC):** Controllers handle HTTP protocol (`controllers/`), while pure business logic services (`services/optimizerService.js`) handle math.
* **Input Sanitization & Validation:** All numerical inputs (`mileage`, `fuelPrice`, coordinates) are validated against `NaN` and negative bounds.
* **Asynchronous Error Handling:** All async/await functions are protected by structured `try...catch` blocks with graceful fallbacks.
* **100% Parameterized SQL:** Zero SQL concatenation; prepared statements with `?` tokens completely neutralize SQL injection.
* **Graceful Degradation:**
  - If OSRM is offline $\to$ triggers internal **Haversine Geodesic Algorithm**.
  - If MySQL is offline $\to$ activates internal **relational JSON persistence store**.
* **Automated Test Coverage:** Native Node test runner (`node:test`) verifies health, auth, and optimizer logic with 100% pass rate (`4/4 passed`).

---

## ⓺ DOCUMENTATION (Comprehensive Artifact Index)

All official documents are saved in the project repository and on your Desktop:

| Document | File Name & Location | Content Overview |
| :--- | :--- | :--- |
| **Capstone Project Report** | `docs/project-report.md` | Formal 10-chapter IEEE academic report with Certificate, Abstract, Math, 3NF Proof, and References. |
| **User Operating Manual** | `docs/user-manual.md` | Step-by-step user guide, hardware/software specs, feature guides, and troubleshooting FAQ. |
| **Technical Documentation** | `docs/technical-documentation.md` | Complete REST API schemas, MySQL data dictionary, algorithmic complexities, and security matrix. |
| **Project Synopsis** | `docs/synopsis.md` | 2-page academic executive summary for formal university submission. |
| **Presentation Slides (PPTX)** | `docs/RouteWise_Presentation.pptx` | 15-slide widescreen presentation deck with professional white-background styling. |
| **Web Presentation Deck** | `docs/presentation.html` | Interactive HTML slide deck viewable in any browser and printable to PDF (`Ctrl + P`). |
| **Viva Voce Master Guide** | `docs/viva-qa.md` | 30 comprehensive questions with winning responses and examiner trap answers. |
| **Evaluation Kit on Desktop** | `Desktop/RouteWise_Evaluation_Kit/` | Consolidated desktop bundle with one-click access to all documents. |

---

## ⓻ VIVA VOCE (Top 5 High-Impact Questions & Winning Answers)

### Q1: What makes your fuel calculation an AI/ML model rather than a simple calculator?
> **Winning Answer:** *"A basic calculator simply computes Distance divided by Mileage. RouteWise extracts road topology features from OSRM to calculate **Turn Density ($\delta$)**, penalizing urban stop-and-go streets ($+8\%$) and rewarding highway cruising ($-4\%$). It additionally applies a dynamic **Time-of-Day Traffic Congestion Coefficient ($C_t$)** based on empirical rush-hour traffic data, and performs multi-objective Pareto ranking across time, cost, and carbon."*

### Q2: How does your database satisfy Third Normal Form (3NF)?
> **Winning Answer:** *"Our database is split into 4 normalized tables: `users`, `fuel_settings`, `search_history`, and `routes`. It satisfies 1NF because all attributes are atomic (lat/lng split). It satisfies 2NF because non-key attributes depend on whole primary keys. It satisfies 3NF because there are zero transitive dependencies—vehicle fuel preferences reside in `fuel_settings` rather than being redundantly duplicated across trip history logs."*

### Q3: Why did you use OpenStreetMap instead of Google Maps API?
> **Winning Answer:** *"Google Maps API requires mandatory credit card billing, enforces restrictive rate caps, and operates as a closed black-box where underlying turn geometries cannot be inspected. OpenStreetMap and OSRM provide complete topological graph transparency, open-source compliance, zero vendor lock-in, and zero operational API cost for academic and production deployment."*

### Q4: How is security handled in RouteWise?
> **Winning Answer:** *"We implement defense-in-depth mapped to OWASP Top 10 standards: passwords are encrypted using `bcrypt` with 10 salt rounds ($1024$ iterations), authorization is stateless via HMAC-SHA256 JWT tokens, Express rate limiters protect against brute force and DDoS attacks, Helmet.js hardens CSP headers, and 100% of SQL queries use parameterized prepared statements."*

### Q5: What is your cloud deployment topology?
> **Winning Answer:** *"RouteWise is architected for Microsoft Azure. The React frontend is deployed on Azure Static Web Apps with global edge CDN distribution, the Express API runs containerized on Azure App Service Linux, the database uses Azure Database for MySQL Flexible Server, and all infrastructure is automated via declarative Azure Bicep templates (`infra/main.bicep`)."*
