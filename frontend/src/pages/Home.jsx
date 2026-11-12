import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Navigation, 
  Zap, 
  IndianRupee, 
  MapPin, 
  ShieldCheck, 
  Database, 
  Cloud, 
  Cpu, 
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* Academic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BTech CSE AI & ML Academic Capstone Project</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Smart Route Planning & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Fuel-Cost Optimization
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compare real driving routes between cities and landmarks. Automatically evaluate the <strong className="text-emerald-400">Fastest</strong>, <strong className="text-sky-400">Shortest</strong>, and <strong className="text-amber-400">Cheapest</strong> path with vehicle-tailored fuel economics and interactive map visualization.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/planner"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
          >
            <Navigation className="w-4 h-4" />
            Launch Route Planner
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-all"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            View System Architecture
          </Link>
        </div>

      </section>

      {/* Feature Pillars: 3 Primary Optimizations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Multi-Objective Route Recommendation
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real OpenStreetMap & OSRM driving engine analysis powered by actual road distances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Fastest */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-navy-800 to-navy-900 border border-navy-700/80 shadow-xl relative group hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-2">
              Fastest Route
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Time-Minimized Path</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes driving segment speeds and highway networks (expressways, multi-lane bypasses) to deliver the lowest estimated travel duration.
            </p>
          </div>

          {/* Shortest */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-navy-800 to-navy-900 border border-navy-700/80 shadow-xl relative group hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Navigation className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider mb-2">
              Shortest Route
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Distance-Minimized Path</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Computes the exact geographical road length in kilometres between source and destination markers, minimizing total odometer travel.
            </p>
          </div>

          {/* Cheapest */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-navy-800 to-navy-900 border border-navy-700/80 shadow-xl relative group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-2">
              Cheapest Route
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fuel-Expense Minimized</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates dynamic fuel consumption in litres and total expense in ₹ based on your vehicle's specific mileage (km/L) and local fuel rates.
            </p>
          </div>

        </div>
      </section>

      {/* University Subject Integration Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900/80 border border-navy-700/80 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Practical University Subject Integration
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every feature runs through genuine backend logic, relational database operations, cloud deployment readiness, and defense-in-depth security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-left">
              <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">1. System Design</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                6-tier modular architecture cleanly segregating Presentation, Application, Business Logic, Data Access, External APIs, and Cloud layers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-left">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">2. DBMS (MySQL)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Relational 3NF normalized tables (<code className="text-emerald-400">users</code>, <code className="text-emerald-400">fuel_settings</code>, <code className="text-emerald-400">search_history</code>, <code className="text-emerald-400">routes</code>) with foreign keys and cascades.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-left">
              <div className="p-2 w-fit rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                <Cloud className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">3. Azure Cloud</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configured for Azure App Service (Express), Azure Static Web Apps (React), and Azure Database for MySQL with health telemetry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-800 text-left">
              <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">4. Cyber Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bcrypt password hashing, stateless JWT authorization, Helmet CSP headers, CORS whitelist, Express rate-limiting, and parameterized SQL.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
