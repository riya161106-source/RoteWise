# ROUTEWISE: COMPREHENSIVE USER MANUAL
## Official User Operating Guide & Operational Handbook
**Project Title:** RouteWise – Smart Route Planning & Multi-Criteria Fuel Optimization System  
**Academic Year:** 2026 – 2027  
**Candidate Name:** Riya  
**Repository:** [https://github.com/riya161106-source/RoteWise](https://github.com/riya161106-source/RoteWise)  

---

## 1. System Overview & Introduction

**RouteWise** is a web-based geospatial route planning and multi-criteria fuel optimization platform. Unlike standard navigation tools that prioritize transit time alone, RouteWise empowers motorists, commuters, and fleet managers to evaluate routes across three key dimensions:
1. **Travel Time (Minutes)** – Identifies the fastest corridor.
2. **Fuel Expenditure (₹ in Rupees)** – Calculates exact fuel consumed based on vehicle mileage, stop-and-go turn density, and time-of-day traffic congestion.
3. **Greenhouse Gas Emissions ($CO_2$ in Kilograms)** – Calculates environmental carbon impact using IPCC standards and displays tree-offset requirements.

---

## 2. System Requirements & Getting Started

### 2.1 Hardware Requirements
- **Device:** Laptop or Desktop PC
- **Processor:** Intel Core i3 / AMD Ryzen 3 or higher
- **RAM:** 4 GB minimum (8 GB recommended)
- **Display Resolution:** $1366 \times 768$ minimum ($1920 \times 1080$ Full HD recommended)
- **Network:** Active internet connection (for OpenStreetMap tile loading and geocoding)

### 2.2 Software Prerequisites
- **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari (Modern Evergreen Browser with JavaScript enabled)
- **Local Runtime (if hosting on machine):** Node.js v18.x or v20.x LTS

### 2.3 Starting the Application (One-Click Launch)
1. Navigate to your computer's **Desktop**.
2. Locate the icon titled **`Start RouteWise`** (with gear icons ⚙️).
3. **Double-click** the icon.
4. The launcher script will automatically:
   - Start the Backend Server on `http://localhost:5000`.
   - Start the Frontend Web App on `http://localhost:5173`.
   - Automatically launch your default web browser to the application home screen.

---

## 3. Step-by-Step User Workflow

```
[1. Launch Application] 
       │
[2. Configure Vehicle Fuel Settings] (Mileage km/L, Fuel Type, Fuel Price ₹/L)
       │
[3. Input Route Locations] (Origin, Destination, & Optional Intermediate Waypoints)
       │
[4. Select Departure Hour] (AI/ML Rush-Hour Traffic Factor)
       │
[5. Execute Route Optimization] (Click "Find Optimized Routes")
       │
[6. Analyze Route Alternatives] (Fastest vs Eco-Friendly vs Shortest)
       │
[7. Review Turn-by-Turn Guidance] (Step Directions with Junction Fly-To)
       │
[8. Inspect DBMS Query Console] (Live SQL Verification on Dashboard)
```

---

## 4. Feature-by-Feature Operational Guide

### 4.1 Home Screen & Navigation Bar
Upon loading `http://localhost:5173`, the top navigation bar gives instant access to:
- **Route Planner (`/planner`)** – The primary map and route discovery console.
- **Trip History (`/history`)** – View and reload past planned journeys.
- **Dashboard (`/dashboard`)** – Aggregate personal analytics and live DBMS SQL Query Inspector.
- **Fuel Settings Modal** – Set and persist your personalized vehicle mileage.
- **About System (`/about`)** – Architecture breakdown and system diagnostics.
- **User Profile / Authentication** – Login, registration, and session status.

---

### 4.2 Configuring Vehicle Fuel Preferences
To ensure route fuel cost and carbon calculations reflect your actual vehicle:
1. Click the **Fuel Settings** button in the navigation bar (or configure inside the Planner sidebar).
2. Enter the following parameters:
   - **Vehicle Mileage (km/L):** Enter your car or motorcycle's fuel economy (e.g., `15.0` for mid-size car, `45.0` for motorcycle, `11.0` for SUV).
   - **Fuel Price (₹/L):** Enter current local fuel rate (e.g., `102.50` for Petrol, `89.00` for Diesel).
   - **Fuel Type:** Select either `Petrol` or `Diesel` (this adjusts the IPCC $CO_2$ emission multiplier: $2.31\text{ kg/L}$ for Petrol vs $2.68\text{ kg/L}$ for Diesel).
3. Click **Save Settings**. Preferences are persisted in the database and applied to all calculations.

---

### 4.3 Multi-Stop Route Discovery & Planning
1. Navigate to the **Route Planner** tab.
2. In the **Origin (A)** input field, begin typing your starting location (e.g., *"Delhi"*, *"Koramangala, Bengaluru"*).
   - *Autocomplete Suggestions:* A dropdown list will automatically appear with matching geocoded addresses. Click your desired location.
3. In the **Destination (B)** field, type and select your arrival destination.
4. **Adding Intermediate Waypoints (Optional):**
   - Click the **`+ Add Waypoint`** button.
   - An intermediate stop field will appear labeled **`Via (1)`**.
   - You can add multiple intermediate waypoints (e.g., Delhi $\to$ Mathura $\to$ Agra).
   - To remove a waypoint, click the trash can icon next to it.
5. **Setting Departure Time (AI Traffic Model):**
   - Select your departure hour from the dropdown (e.g., `09:00 AM`, `02:00 PM`, `11:00 PM`).
   - The system dynamically applies traffic coefficients:
     - *Morning Rush (08:00–10:00):* $+18\%$ congestion penalty.
     - *Evening Rush (17:00–20:00):* $+22\%$ congestion penalty.
     - *Night (23:00–05:00):* $-5\%$ free-flow cruising efficiency.
6. Click the green **"Find Optimized Routes"** button.

---

### 4.4 Interpreting Route Cards & Recommendation Badges
Once calculated, the sidebar displays side-by-side alternative routes with metric comparison badges:

| Badge | Meaning & Criteria | Recommended Scenario |
| :--- | :--- | :--- |
| 🟢 **`ECO-FRIENDLY`** | Route with the **lowest monetary fuel expenditure (₹)** and **minimal $CO_2$ carbon footprint**. | Daily commuting, budget-conscious drivers, and green mobility. |
| ⚡ **`FASTEST`** | Route with the **least total transit duration (minutes)**. | Emergencies, time-sensitive business trips. |
| 📏 **`SHORTEST`** | Route covering the **minimum physical road distance (kilometers)**. | Mileage-capped rental vehicles. |
| ⭐ **`RECOMMENDED`** | Multi-objective Pareto optimal route balancing $50\%$ Time, $30\%$ Fuel Cost, and $20\%$ Carbon. | Best overall balance for standard travel. |

Each route card clearly highlights:
- **Total Distance:** in kilometers (e.g., `143.5 km`).
- **Estimated Travel Time:** in hours and minutes.
- **Estimated Fuel Expense:** in Indian Rupees (e.g., `₹1,028.40`).
- **Carbon Footprint:** $CO_2$ in kilograms, accompanied by the **Tree Offset Metric** (how many tree-days are required to neutralize trip emissions).

---

### 4.5 Interactive Map Controls
- **Selecting an Active Route:** Click on any route card in the sidebar or directly click any route line on the map. The active route turns into a thick, glowing Emerald Green line, while alternative routes remain dashed slate lines.
- **Switching Map Style:** Click the **`Map Style`** floating button at the top-right corner of the map to select:
  - *OpenStreetMap (Standard)* – Default, clean, high-contrast, free map.
  - *Esri World Street* – High-definition global navigation cartography.
  - *OpenTopoMap* – Topographical contour view.
- **Zoom & Pan:** Use your mouse scroll wheel or on-screen `+` / `-` buttons to explore road networks.

---

### 4.6 Turn-by-Turn Guidance & Camera Fly-To
1. Click the **"View Turn-by-Turn Directions"** button on the active route.
2. A drawer panel displays step-by-step navigation maneuvers:
   - Maneuver icons: Turn Right, Turn Left, Roundabout, Merge, Fork, Straight.
   - Street names and step distances in meters.
3. **Interactive Junction Fly-To:** Click on any maneuver step in the list! The Leaflet camera will smoothly fly and zoom (level 15) straight to that exact junction coordinates on the map.

---

### 4.7 Live Evaluator DBMS Query Inspector
To verify the database architecture during academic evaluations:
1. Navigate to the **Dashboard** or **About** page.
2. Locate the **DBMS Query Inspector** panel.
3. Click **"Run Relational Analytics Query"**.
4. The system executes a live multi-table `JOIN` query linking `users`, `search_history`, and `routes` tables, displaying:
   - Total trips planned.
   - Total route alternatives evaluated.
   - Cumulative distance traveled (km).
   - Total fuel money spent (₹).
   - Total $CO_2$ produced (kg).
   - Execution latency in milliseconds.

---

## 5. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: The map shows blank gray tiles. What should I do?
* **Cause:** The computer is not connected to the internet, or the firewall is blocking OpenStreetMap tile servers.
* **Resolution:** Ensure Wi-Fi/Ethernet is connected. Refresh the page (`Ctrl + R`). RouteWise uses free OpenStreetMap tiles requiring zero API keys.

### Q2: I clicked "Start RouteWise" on my Desktop but the browser didn't open.
* **Resolution:** Open your browser (Chrome or Edge) manually and type:
  `http://localhost:5173`
  in the address bar and press Enter. Ensure the two black terminal windows launched by `Start RouteWise` remain open in the background.

### Q3: How do I show the project if MySQL is not installed on the evaluation machine?
* **Resolution:** RouteWise includes an automatic **Relational Fallback Store (`local_store.json`)**. The application will detect if MySQL is inactive and seamlessly run without throwing errors, preserving 100% of the demonstration capabilities.

### Q4: How do I export or print the planned route itinerary?
* **Resolution:** In the Planner drawer, click the **"Print / Export Itinerary"** button or press `Ctrl + P` in your browser to generate a clean, printable PDF route summary.
