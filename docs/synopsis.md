# ACADEMIC PROJECT SYNOPSIS
## ROUTEWISE: Smart Route Planning and Multi-Criteria Fuel Optimization System

**Degree:** Bachelor of Technology (B.Tech) in Computer Science and Engineering  
**Specialization:** Artificial Intelligence & Machine Learning (AI & ML)  
**Academic Year:** 2026 – 2027  
**Candidate Name:** Riya  
**Project Track:** Capstone Synthesis (System Design, DBMS, Cloud Computing, Cyber Security, AI & ML)  
**Repository:** [https://github.com/riya161106-source/RoteWise](https://github.com/riya161106-source/RoteWise)  

---

### 1. Title of the Project
**RouteWise: Smart Route Planning & Multi-Criteria Fuel Optimization System**

### 2. Area of the Project
- Applied Artificial Intelligence & Heuristic Optimization
- Distributed Multi-Tier Software Architecture (System Design)
- Relational Database Management Systems (MySQL Normalized to 3NF)
- Cloud Infrastructure Engineering (Microsoft Azure App Service & Static Web Apps)
- Enterprise Web Application Cyber Security (OWASP Top 10 Defenses)

### 3. Abstract / Executive Summary
Modern GPS navigation applications prioritize transit time as the solitary optimization criterion, frequently directing vehicles through circuitous urban bottlenecks or aggressive highway stretches without accounting for vehicular fuel efficiency, deceleration penalties, or carbon footprints. 

**RouteWise** is an intelligent, multi-criteria route planning and fuel optimization platform. By combining real OpenStreetMap topological road graphs with an AI/ML predictive fuel model, RouteWise empowers drivers to evaluate routes across three distinct dimensions: **Fastest** (least duration), **Shortest** (least distance), and **Eco-Friendly** (lowest monetary fuel cost and carbon footprint). The platform features an end-to-end 6-tier architecture, an interactive Leaflet map interface with zero API key dependencies, a Third Normal Form (3NF) relational database, declarative Azure Bicep cloud infrastructure, and defense-in-depth cybersecurity controls.

---

### 4. Problem Definition
Conventional navigation platforms exhibit three primary deficiencies:
1. **Lack of Personalized Fuel Costing:** Drivers cannot input their specific vehicle fuel mileage (km/L) and fuel price (₹/L) to calculate exact rupees spent across alternative routes.
2. **Ignored Road Deceleration Dynamics:** Simple $D/M$ calculations fail to capture urban stop-and-go energy losses caused by high turn densities and junction signals.
3. **Absence of Carbon Transparency:** Commuters lack visibility into vehicular $CO_2$ emissions and actionable environmental offset metrics.

---

### 5. Objectives & Scope of Work
- **Multi-Stop Route Planning:** Dynamic start, destination, and intermediate waypoints with instant geocoding autocomplete.
- **Turn Density Feature Engineering ($\delta$):** Calculate maneuver counts per kilometer to apply road complexity penalties.
- **Time-of-Day Traffic Multiplier ($C_t$):** Dynamically penalize rush-hour trips ($+18\%$ to $+22\%$) and reward off-peak transit ($-5\%$).
- **IPCC Carbon Footprint Accounting:** Compute $CO_2$ emissions in kilograms and translate into tree-days required for neutralization.
- **3NF Relational Database:** Store users, vehicle settings, search queries, and route alternatives with cascading integrity.
- **Evaluator Query Inspector:** Live on-screen SQL query console executing multi-table `JOIN` and aggregate analytics.
- **Azure Cloud Architecture:** Production-ready topology on Azure App Service, Azure Static Web Apps, and Azure Bicep IaC.

---

### 6. Hardware & Software Requirements

#### Hardware Requirements
- **Processor:** Intel Core i5 / AMD Ryzen 5 or higher
- **RAM:** 8 GB minimum (16 GB recommended)
- **Storage:** 20 GB free disk space
- **Display:** $1920 \times 1080$ Full HD resolution

#### Software Requirements
- **Operating System:** Windows 10/11 / Linux (Ubuntu 22.04 LTS) / macOS
- **Runtime Environment:** Node.js v18.x or v20.x LTS
- **Frontend Framework:** React 18, Vite 5, React-Leaflet, Tailwind CSS
- **Backend Framework:** Express.js 4.x
- **Database:** MySQL 8.0 (with local relational fallback store)
- **Cloud Provider:** Microsoft Azure (App Service, Static Web Apps, Azure Bicep)
- **Version Control:** Git & GitHub

---

### 7. Core Functional Modules

```
                        ROUTEWISE ARCHITECTURE
   ┌─────────────────────────────────────────────────────────────┐
   │                     PRESENTATION TIER                       │
   │  React 18 SPA | Leaflet OpenStreetMap | Tailwind Navy/Green │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ HTTPS / REST
   ┌──────────────────────────────▼──────────────────────────────┐
   │                    APPLICATION GATEWAY                      │
   │   Express.js (Port 5000) | Helmet | CORS | Rate Limiting    │
   └──────────────┬───────────────────────────────┬──────────────┘
                  │                               │
   ┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
   │   BUSINESS & AI/ML TIER     │ │     DATA PERSISTENCE TIER   │
   │  • Turn Density Model       │ │  • MySQL 3NF Normalization  │
   │  • Time-of-Day Multiplier   │ │  • Cascading Foreign Keys   │
   │  • IPCC CO2 Calculator      │ │  • Evaluator Query Engine   │
   │  • Pareto Route Ranking     │ │  • Relational Fallback Store│
   └──────────────┬──────────────┘ └─────────────────────────────┘
                  │
   ┌──────────────▼──────────────────────────────────────────────┐
   │                 EXTERNAL GEOSPATIAL SERVICES                │
   │    OSRM Driving Geometry Engine | Photon Geocoding Service   │
   └─────────────────────────────────────────────────────────────┘
```

1. **User Authentication & Vehicle Profiles:** Secure user registration, password hashing via `bcrypt`, and JWT token issuance.
2. **Geospatial Route Discovery:** Reverse geocoding and real driving trajectory generation via the OSRM engine.
3. **Multi-Criteria Optimization Engine:** Applies traffic models, computes fuel cost in rupees, and assigns ranking badges.
4. **Interactive Leaflet Map:** High-contrast visualization with turn-by-turn maneuver highlights and camera fly-to animations.
5. **DBMS Query Inspector:** Live evaluator tool showcasing SQL execution against normalized database tables.

---

### 8. Expected Outcomes & Deliverables
1. **Fully Functional Web System:** End-to-end operational platform accessible locally and cloud-ready for Microsoft Azure.
2. **Zero Third-Party Cost:** Uses open-access OpenStreetMap tiles and self-contained routing algorithms without paid API keys.
3. **Comprehensive Documentation:** Full IEEE project report, ER diagrams, cloud Bicep templates, and Viva preparation guide.

---

**Signature of Candidate:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Date:** November 23, 2026
