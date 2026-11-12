import React from 'react';
import { 
  Cpu, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  Server, 
  Lock, 
  Code,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-left">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          Academic Subject Integration Report
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          RouteWise Architecture & Engineering
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          A comprehensive demonstration of System Design, DBMS, Azure Cloud Computing, and Cyber Security principles in a real full-stack web application.
        </p>
      </div>

      {/* Subject 1: System Design */}
      <section className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Subject 1: System Design Integration</h2>
            <p className="text-xs text-slate-400">Modular 6-Tier Layered Architecture with Clean Separation of Concerns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">1. Presentation Layer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              React 18 Single Page Application (SPA) styled with Tailwind CSS in Dark Navy & Emerald Green. Uses Leaflet & React-Leaflet for interactive map tile and polyline rendering.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">2. Application Layer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Node.js Express REST API controllers routing HTTP requests, running rate limiters, token authorization, input validation, and global error handling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">3. Business Logic Layer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Route optimization engine applying vehicle mileage formulas, fuel cost equations, multi-objective scoring, and awarding recommendation badges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">4. Data Access Layer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              MySQL connection pool with connection pooling, parameterized query abstractions, transaction management, and automatic resilience.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">5. External Services Layer</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Photon Geocoding API for coordinate resolution and OSRM (Open Source Routing Machine) API for real driving routes, step summaries, and GeoJSON lines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">6. Cloud Infrastructure</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Azure App Service container deployment, Azure Static Web Apps frontend hosting, and Azure Database for MySQL Flexible Server integration.
            </p>
          </div>
        </div>
      </section>

      {/* Subject 2: DBMS */}
      <section className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Subject 2: DBMS Subject Integration (MySQL)</h2>
            <p className="text-xs text-slate-400">Normalized 3NF Relational Database Schema with Referential Integrity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <h4 className="font-bold text-sm text-emerald-400">Database Tables & Constraints</h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li><strong className="text-white">users:</strong> <code className="text-emerald-400">user_id (PK)</code>, name, email (UNIQUE), password_hash, created_at.</li>
              <li><strong className="text-white">fuel_settings:</strong> <code className="text-emerald-400">setting_id (PK)</code>, user_id (FK), fuel_type, mileage, fuel_price.</li>
              <li><strong className="text-white">search_history:</strong> <code className="text-emerald-400">search_id (PK)</code>, user_id (FK), source, destination, lat/lng, search_date.</li>
              <li><strong className="text-white">routes:</strong> <code className="text-emerald-400">route_id (PK)</code>, search_id (FK), route_name, distance, duration, fuel_cost, route_type.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <h4 className="font-bold text-sm text-emerald-400">SQL Operations Implemented</h4>
            <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <li>• <strong>Referential Integrity:</strong> <code className="text-emerald-400">ON DELETE CASCADE</code> deletes associated routes and searches automatically.</li>
              <li>• <strong>JOIN Queries:</strong> Multi-table queries linking users, search histories, and routes in chronological sequences.</li>
              <li>• <strong>Aggregate Functions:</strong> <code className="text-emerald-400">COUNT</code>, <code className="text-emerald-400">SUM</code>, and <code className="text-emerald-400">AVG</code> power the Travel Dashboard analytics.</li>
              <li>• <strong>Index Strategy:</strong> B-Tree indexes on <code className="text-emerald-400">users(email)</code> and <code className="text-emerald-400">search_history(user_id, search_date)</code>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Subject 3: Azure Cloud */}
      <section className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Subject 3: Azure Cloud Computing Integration</h2>
            <p className="text-xs text-slate-400">Cloud Architecture, Containerization, Health Probes & SWA Hosting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="font-bold text-sky-400 block text-sm">Azure App Service</span>
            <p>Hosts the Express REST API backend with automated scaling, dynamic PORT binding (<code className="text-sky-300">process.env.PORT</code>), and process monitoring.</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="font-bold text-sky-400 block text-sm">Azure Static Web Apps</span>
            <p>Hosts the React frontend with global CDN distribution, SSL/TLS certificates, and client routing rewrites via <code className="text-sky-300">staticwebapp.config.json</code>.</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2">
            <span className="font-bold text-sky-400 block text-sm">Azure Health Probe</span>
            <p>Provides a production health endpoint (<code className="text-sky-300">/api/health</code>) verifying database uptime, memory allocation, and system liveness.</p>
          </div>
        </div>
      </section>

      {/* Subject 4: Cyber Security */}
      <section className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-navy-800">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Subject 4: Cyber Security Subject Integration</h2>
            <p className="text-xs text-slate-400">Defense-in-Depth: Authentication, Authorization, Hardening, and OWASP Mitigations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
            <strong className="text-amber-400 block">Bcrypt Password Hashing</strong>
            <p>Passwords hashed with 10 salt rounds. Plain text credentials and hashes are never exposed in API responses or logs.</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
            <strong className="text-amber-400 block">Stateless JWT Auth</strong>
            <p>Signed Bearer tokens with 24-hour expiration verify user identity on protected routes without session bloat.</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
            <strong className="text-amber-400 block">Rate Limiting & CORS</strong>
            <p>Express rate limiting on auth & route calculations prevents brute-force. CORS origin whitelist blocks cross-site tampering.</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 space-y-1.5">
            <strong className="text-amber-400 block">SQL Injection Defense</strong>
            <p>100% of database interactions use parameterized SQL placeholders (<code className="text-amber-300">?</code>) and input sanitization.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
