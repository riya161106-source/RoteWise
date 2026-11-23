# ROUTEWISE – FINAL CAPSTONE PROJECT PRESENTATION
## 15-Slide Presentation Deck for Project Defense & Evaluation

**Project Title:** RouteWise – Smart Route Planning & Multi-Criteria Fuel Optimization System  
**Candidate Name:** Riya  
**Degree:** B.Tech Computer Science & Engineering (Specialization: AI & ML)  
**Academic Year:** 2026 – 2027  
**Repository:** [https://github.com/riya161106-source/RoteWise](https://github.com/riya161106-source/RoteWise)  

---

### SLIDE 1: Title & Introduction
- **Slide Title:** RouteWise – Smart Route Planning and Multi-Criteria Fuel Optimization System
- **Subtitle:** An Intelligent Geospatial Platform Integrating AI/ML, System Design, 3NF DBMS, Azure Cloud, and Cyber Security
- **Presenter:** Riya (B.Tech CSE - Artificial Intelligence & Machine Learning)
- **Evaluation Track:** Final B.Tech Capstone Project Defense
- **Speaker Talking Points:**
  > "Good morning respected evaluators. Today I am presenting RouteWise, an intelligent navigation and multi-criteria fuel optimization system. Unlike conventional navigation apps that only look at travel time, RouteWise empowers drivers to evaluate routes based on real vehicle fuel efficiency, traffic congestion patterns, monetary fuel costs in Rupees, and environmental carbon footprints."

---

### SLIDE 2: Problem Statement & Motivation
- **Slide Title:** Why Do We Need RouteWise?
- **Key Challenges in Current GPS Navigation:**
  1. **Single-Variable Blindness:** Google Maps and Waze predominantly optimize only for travel time (ETA), neglecting fuel economy and carbon emissions.
  2. **No Vehicle-Specific Fuel Modeling:** Users cannot enter their specific vehicle mileage (km/L) and fuel rates (₹/L) to calculate exact rupees spent across alternatives.
  3. **Stop-and-Go Energy Losses Ignored:** Standard distance calculations ignore the severe fuel penalties caused by frequent city turns and traffic signals.
  4. **No Environmental Visibility:** Modern climate sustainability requires transparent vehicular $CO_2$ emission tracking per trip.
- **Speaker Talking Points:**
  > "A driver traveling 10 kilometers through heavy stop-and-go city traffic consumes significantly more fuel than traveling 10 kilometers on an open expressway. Current apps hide these economics. RouteWise solves this by quantifying monetary fuel expenditure and carbon footprint for every route alternative."

---

### SLIDE 3: Project Objectives & Core Academic Synthesis
- **Slide Title:** Project Scope & Academic Synthesis
- **5-Subject Integration Matrix:**
  - 🏛️ **System Design:** 6-tier decoupled modular architecture with high cohesion and loose coupling.
  - 💾 **DBMS:** Normalized 3NF MySQL relational database with cascading foreign keys and aggregate analytics.
  - ☁️ **Azure Cloud Computing:** Enterprise cloud topology across Azure App Service, Azure Static Web Apps, and Azure Bicep IaC.
  - 🛡️ **Cyber Security:** Defense-in-depth model with bcrypt password hashing, stateless JWT authorization, Helmet CSP headers, and parameterized SQL.
  - 🧠 **AI & Machine Learning:** Turn-density feature engineering ($\delta$), time-of-day traffic model ($C_t$), and IPCC greenhouse gas modeling.
- **Speaker Talking Points:**
  > "Rather than building a simple prototype, RouteWise serves as a comprehensive capstone synthesizing our five core engineering subjects into a single cohesive platform."

---

### SLIDE 4: High-Level System Architecture
- **Slide Title:** Decoupled 6-Tier Architecture
- **Visual Diagram:**
  - **Tier 1 (Presentation):** React 18, React-Leaflet, Tailwind CSS Dark Theme
  - **Tier 2 (Gateway):** Express.js REST API on Port 5000 with Helmet, CORS, and Rate Limiters
  - **Tier 3 (AI/ML & Optimizer):** Multi-objective scoring, turn-density analysis, and carbon calculation
  - **Tier 4 (Data Persistence):** MySQL Connection Pool (`mysql2`) with resilient local fallback
  - **Tier 5 (External Geospatial):** OSRM Driving Engine and Photon Geocoding API
  - **Tier 6 (Cloud Infrastructure):** Azure App Service, Azure Static Web Apps, and Azure Bicep
- **Speaker Talking Points:**
  > "The architecture follows the Single Responsibility Principle. The presentation tier interacts with the Express application gateway, which delegates mathematical optimization to pure business logic services and persistence to our relational layer."

---

### SLIDE 5: Mathematical Modeling & AI/ML Formulation
- **Slide Title:** Predictive Fuel & Traffic Multiplier Model
- **Key Equations:**
  1. **Base Volumetric Consumption:**
     $$\text{Base Fuel (Litres)} = \frac{\text{Distance } (D)}{\text{Vehicle Mileage } (M)}$$
  2. **Turn Density Metric ($\delta$):**
     $$\delta = \frac{\text{Number of Maneuvers}}{\text{Distance (km)}}$$
  3. **Time-of-Day Traffic Congestion Coefficient ($C_t$):**
     - Morning Peak (08:00–10:00): $C_t = 1.18$ ($+18\%$ penalty)
     - Evening Peak (17:00–20:00): $C_t = 1.22$ ($+22\%$ penalty)
     - Off-Peak Night (23:00–05:00): $C_t = 0.95$ ($-5\%$ bonus)
  4. **Final Predicted Equation:**
     $$F_{\text{predicted}} = \left(\frac{D}{M}\right) \times C_t \times \rho_{\text{road}}$$
- **Speaker Talking Points:**
  > "Notice how our model dynamically penalizes routes with heavy junction maneuvers and peak rush hours, providing realistic fuel estimates rather than simplistic theoretical numbers."

---

### SLIDE 6: Environmental Carbon Footprint Model
- **Slide Title:** IPCC Greenhouse Gas ($CO_2$) Modeling
- **Scientific Foundation:**
  - **Petrol Vehicles:** Produces $2.31\text{ kg } CO_2$ per litre of fuel combusted.
  - **Diesel Vehicles:** Produces $2.68\text{ kg } CO_2$ per litre of fuel combusted.
  - **Trip Emissions:**
    $$\text{Trip } CO_2 \text{ (kg)} = F_{\text{predicted}} \times \text{Emission Factor}$$
  - **Tree Offset Equivalency:**
    $$\text{Tree Days Offset} = \frac{\text{Trip } CO_2 \text{ (kg)}}{0.0596\text{ kg/day}}$$
- **Key Outcome:**
  - Every route alternative is labeled: `ECO-FRIENDLY`, `FASTEST`, or `BALANCED`.
- **Speaker Talking Points:**
  > "We adhere strictly to international IPCC guidelines. In addition to rupees saved, the user immediately sees their carbon emission in kilograms and how many tree-days are required to neutralize their trip."

---

### SLIDE 7: Relational Database Architecture (3NF)
- **Slide Title:** MySQL Relational Schema & 3NF Normalization
- **Database Schema (4 Tables):**
  1. `users` (Primary Key: `user_id`, unique email, bcrypt hash)
  2. `fuel_settings` (Foreign Key: `user_id` $\to$ `users.user_id`)
  3. `search_history` (Foreign Key: `user_id` $\to$ `users.user_id`)
  4. `routes` (Foreign Key: `search_id` $\to$ `search_history.search_id`)
- **Third Normal Form (3NF) Compliance:**
  - **1NF:** Atomic attributes (coordinates stored as discrete lat/lng columns).
  - **2NF:** No partial dependencies; non-key attributes depend on whole primary keys.
  - **3NF:** No transitive dependencies ($A \to B \to C$ eliminated).
- **Referential Integrity:** Enforced with `ON DELETE CASCADE` preventing orphaned child rows.
- **Speaker Talking Points:**
  > "Our database design strictly follows Third Normal Form. Deleting a user cleanly cascades to delete their settings and trip history, ensuring 100% referential integrity."

---

### SLIDE 8: Live Evaluator DBMS Query Inspector
- **Slide Title:** Multi-Table Relational JOIN & Analytics
- **Live SQL Query Demo:**
  ```sql
  SELECT 
      u.name,
      COUNT(DISTINCT sh.search_id) AS trips_planned,
      COUNT(r.route_id) AS routes_evaluated,
      ROUND(SUM(r.distance), 2) AS total_distance_km,
      ROUND(SUM(r.estimated_fuel_cost), 2) AS total_fuel_cost_inr,
      ROUND(AVG(r.duration), 1) AS avg_duration_mins
  FROM users u
  JOIN search_history sh ON u.user_id = sh.user_id
  JOIN routes r ON sh.search_id = r.search_id
  GROUP BY u.user_id, u.name;
  ```
- **Feature:** Evaluators can inspect and execute real-time SQL queries directly in the application UI on the Dashboard page!
- **Speaker Talking Points:**
  > "To provide complete academic transparency, we built an embedded SQL Query Inspector right inside the application, allowing evaluators to verify our multi-table JOINs and aggregate queries live."

---

### SLIDE 9: Azure Cloud Architecture & IaC
- **Slide Title:** Enterprise Microsoft Azure Topology
- **Cloud Components:**
  - **Azure Static Web Apps:** Global CDN edge distribution with automated SSL termination for React 18 frontend.
  - **Azure App Service (Linux B1):** Containerized Node.js API hosting with auto-scaling.
  - **Azure Database for MySQL Flexible Server:** Zone-redundant relational persistence.
  - **Infrastructure as Code (IaC):** 100% automated provisioning via **Azure Bicep** (`infra/main.bicep`).
  - **Liveness Telemetry Probe:** Active health endpoint at `/api/health` monitoring memory and connection status.
- **Speaker Talking Points:**
  > "The system is architected for cloud-native elasticity on Microsoft Azure, with full Infrastructure as Code scripts allowing zero-touch deployment."

---

### SLIDE 10: Cyber Security & Defense-in-Depth
- **Slide Title:** OWASP Top 10 Security Architecture
- **Multi-Layer Defensive Controls:**
  - 🔒 **Cryptographic Hashing:** `bcrypt` with 10 salt rounds ($2^{10} = 1024$ key expansion rounds).
  - 🛡️ **Stateless Authentication:** HMAC-SHA256 JSON Web Tokens (JWT) with 24-hour expiration.
  - 🛑 **Rate Limiting:** Protects against credential brute force (`20 req/15min`) and API flooding (`100 req/15min`).
  - 💉 **SQL Injection Defense:** 100% parameterized queries using prepared placeholder statements (`?`).
  - 🌐 **HTTP Hardening:** Helmet CSP headers, `X-Frame-Options: DENY`, and strict CORS origin whitelisting.
- **Speaker Talking Points:**
  > "Security is embedded by design. From cryptographic password salts to strict Content Security Policies and parameterized queries, every tier adheres to OWASP Top 10 standards."

---

### SLIDE 11: Interactive User Interface & Map Experience
- **Slide Title:** UI/UX & Geospatial Navigation
- **Key Features:**
  - **Zero-Key OpenStreetMap Layer:** Standard high-contrast map tiles requiring zero third-party API keys or paid accounts.
  - **Multi-Style Switcher:** Easily toggle between OpenStreetMap, Esri World Street, and OpenTopoMap.
  - **Multi-Stop Waypoints:** Add dynamic intermediate stops between origin and destination.
  - **Turn-by-Turn Maneuver Guidance:** Click any maneuver to trigger smooth camera fly-to animations to the exact junction.
  - **Responsive Cyberpunk Navy Aesthetic:** High contrast (`#0B132B` and `#10B981`) optimized for day and night commuting.
- **Speaker Talking Points:**
  > "The frontend is built with React 18 and Leaflet. Notice how the map provides fluid turn-by-turn guidance, waypoint additions, and immediate route comparison badges."

---

### SLIDE 12: Experimental Results & Benchmarking
- **Slide Title:** Verification & Real-World Corridor Results
- **Bengaluru $\to$ Mysuru Corridor Analysis:**
  - **Route 1 (NH 275 Expressway):** $143.5\text{ km}$ | $135\text{ mins}$ | ₹1,028.40 | $25.1\text{ kg } CO_2$ (`FASTEST`)
  - **Route 2 (Via Kanakapura Road):** $138.2\text{ km}$ | $165\text{ mins}$ | ₹972.50 | $23.7\text{ kg } CO_2$ (`ECO-FRIENDLY`)
- **Key Finding:**
  - Kanakapura Road saves **₹55.90 in fuel** and **$1.4\text{ kg } CO_2$**, but takes 30 minutes longer.
  - RouteWise empowers the driver to make this informed economic and environmental choice!
- **Automated Testing:** 100% unit test pass rate using Node.js native test runner (`node:test`).
- **Speaker Talking Points:**
  > "Our empirical test on the Bengaluru-Mysuru corridor demonstrated that an eco-route saves ₹55.90 in fuel and 1.4 kg of CO2. Traditional apps would simply push the expressway without giving the commuter this choice."

---

### SLIDE 13: Fault Tolerance & Resilient Architecture
- **Slide Title:** High Availability & Failover Mechanisms
- **Resilient Fallback Engineering:**
  1. **Geospatial Failover:** If external routing servers experience network latency, RouteWise triggers an internal **Haversine Geodesic Algorithm** maintaining system availability.
  2. **Database Fallback:** If local or cloud MySQL experiences connectivity drops, the system seamlessly activates an internal relational JSON persistence store, ensuring **zero presentation crashes**.
  3. **One-Click Windows Launcher:** Custom `start-routewise.bat` initiates backend, frontend, and browser orchestration with a single click.
- **Speaker Talking Points:**
  > "We engineered RouteWise with enterprise fault tolerance. Even under total network isolation or database interruption, the application gracefully falls back without throwing unhandled exceptions."

---

### SLIDE 14: Conclusion & Societal Impact
- **Slide Title:** Conclusion & Environmental Impact
- **Summary of Achievements:**
  - Successfully designed, implemented, and verified an end-to-end intelligent navigation and fuel optimization system.
  - Fully synthesized 5 core B.Tech disciplines into an IEEE-compliant engineering implementation.
  - Promotes United Nations Sustainable Development Goal 11 (Sustainable Cities) and Goal 13 (Climate Action) by encouraging eco-driving.
- **Speaker Talking Points:**
  > "RouteWise proves that computational intelligence can directly reduce personal transportation costs while helping combat urban vehicular carbon emissions."

---

### SLIDE 15: Future Scope & Q&A
- **Slide Title:** Future Roadmap & Thank You
- **Future Enhancements:**
  - 🚗 **IoT OBD-II Telemetry:** Live Bluetooth engine integration for real-time fuel flow ($L/h$) and RPM reading.
  - ⚡ **Electric Vehicle (EV) State-of-Charge:** Dynamic battery depletion modeling based on road elevation contours and charging stop insertion.
  - 🚦 **Deep Reinforcement Learning (Q-Learning):** Traffic signal phase anticipation for optimal green-wave driving speeds.
- **Questions & Discussion:**
  - Thank you! I welcome your questions and feedback.
- **Speaker Talking Points:**
  > "In the future, we plan to connect live OBD-II vehicle dongles and incorporate EV charging stations. Thank you very much for your time. I am now open to your questions."
