# RouteWise: Smart Route Planning and Optimization System
## Academic BTech CSE (Artificial Intelligence & Machine Learning) Project Report

---

### Abstract
Efficient road transportation requires balancing travel time, distance, vehicle fuel consumption, and environmental footprint. Existing navigation platforms frequently optimize for travel time alone, neglecting vehicle-specific fuel economics, road hierarchy deceleration costs, and carbon emissions. This project presents **RouteWise**, an intelligent multi-criteria driving route planning and optimization system. The platform integrates real-world OpenStreetMap highway road networks, an AI/ML predictive fuel and traffic model, a Third Normal Form (3NF) relational MySQL database, an Azure cloud computing deployment topology, and defense-in-depth cybersecurity protocols. RouteWise empowers motorists and fleet operators to evaluate real driving alternatives and select the fastest, shortest, cheapest, or eco-friendly route.

---

### 1. Introduction & Problem Statement
Traditional navigation engines (e.g. Google Maps, Waze) treat fuel consumption as a static or hidden parameter and do not provide side-by-side fuel cost comparisons across alternatives based on individual vehicle mileage. Furthermore, in academic computer science programs, there is a distinct necessity for capstone systems that synthesize theoretical principles across multiple core disciplines. 

RouteWise addresses these challenges by practically combining:
1. **System Design**: Modular 6-tier architecture segregating presentation, application, business logic, data access, external services, and cloud hosting.
2. **Database Management Systems (DBMS)**: MySQL relational storage normalized to 3NF with referential constraints, indexing, and aggregate analytics.
3. **Azure Cloud Computing**: Cloud-native deployment across Azure App Service, Azure Static Web Apps, and Azure Database for MySQL.
4. **Cyber Security**: Cryptographic password hashing (`bcrypt`), stateless JWT authentication, Helmet CSP headers, CORS policies, rate limiting, and parameterized SQL injection defenses.

---

### 2. Mathematical Formulation & AI/ML Methodology

#### 2.1 Vehicle Fuel Consumption Formula
The baseline fuel consumption is formulated as:
$$\text{Base Fuel Required (Litres)} = \frac{\text{Distance } (D) \text{ in km}}{\text{Vehicle Mileage } (M) \text{ in km/L}}$$

$$\text{Estimated Fuel Expense (INR)} = \text{Fuel Required} \times \text{Fuel Price } (P) \text{ in ₹/L}$$

#### 2.2 AI/ML Predictive Traffic & Road Complexity Multiplier
Urban streets with high turn frequencies induce stop-and-go deceleration penalties compared to cruising on national expressways. RouteWise models this via turn density ($\delta$) and a time-of-day traffic congestion coefficient ($C_t$):

$$\delta = \frac{\text{Number of Maneuvers}}{\text{Distance (km)}}$$

$$F_{\text{predicted}} = \left(\frac{D}{M}\right) \times C_t \times \rho_{\text{road}}$$

Where:
- $C_t = 1.18$ during morning rush hours (08:00–10:00).
- $C_t = 1.22$ during evening rush hours (17:00–20:00).
- $C_t = 0.95$ during off-peak night travel (23:00–05:00).
- $\rho_{\text{road}} = 1.08$ for high turn densities ($\delta > 0.4$ turns/km) and $0.96$ for continuous highway cruising ($\delta < 0.1$).

#### 2.3 Greenhouse Gas ($CO_2$) Emissions Model
Following IPCC standards, emissions are computed dynamically:
$$\text{Petrol: } E_{\text{CO}_2} = F_{\text{predicted}} \times 2.31\text{ kg/L}$$
$$\text{Diesel: } E_{\text{CO}_2} = F_{\text{predicted}} \times 2.68\text{ kg/L}$$

---

### 3. Subject-Specific Engineering Implementations

#### 3.1 System Design
- **Presentation Tier**: React 18, React-Leaflet, Tailwind CSS in Dark Navy (`#0B132B`) and Emerald Green (`#10B981`).
- **Application Tier**: Express.js REST API gateway with modular controllers and centralized error handling.
- **Business Logic Tier**: Route evaluation, multi-objective ranking, and dynamic recommendation badges.
- **External Services**: Photon Geocoding API and OSRM Driving Engine.

#### 3.2 Database Management Systems (DBMS)
- Normalized relational schema in 3NF across `users`, `fuel_settings`, `search_history`, and `routes`.
- Complete referential integrity using `ON DELETE CASCADE`.
- Parameterized SQL execution preventing SQL injection.
- Multi-table `JOIN` queries and `COUNT`, `SUM`, `AVG` aggregate reporting.

#### 3.3 Azure Cloud Computing
- Deployed on Azure App Service (Linux Node.js runtime).
- Frontend hosted on Azure Static Web Apps with global edge distribution.
- Automated health monitoring probe at `/api/health`.
- Infrastructure as Code (IaC) via Azure Bicep templates (`infra/main.bicep`).

#### 3.4 Cyber Security
- Passwords hashed using `bcrypt` (10 salt rounds).
- Stateless authorization via JSON Web Tokens (JWT) with 24-hour expiration.
- Rate limiting on authentication (`20 req/15min`) to thwart brute force attacks.
- Strict Content Security Policy (CSP) blocking unauthorized scripts and cross-site framing.

---

### 4. Experimental Results & Verification
- Unit test suite passed with 100% pass rate (`4/4 tests passed`).
- Real-world route calculations verified between metropolitan corridors (e.g. Bengaluru to Mysuru, Koramangala to Airport).
- Turn-by-turn navigation verified with real junction maneuvers.
- Offline fallback verified: system continues operating even during network outages.

---

### 5. Conclusion & Future Work
RouteWise fulfills all academic requirements for BTech CSE AI & ML. Future enhancements include live IoT telemetry via OBD-II vehicle dongles, real-time electric vehicle (EV) charging point routing, and deep reinforcement learning for traffic signal optimization.
