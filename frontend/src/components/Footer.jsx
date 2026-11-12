import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Database, Cloud, Shield, Cpu, Activity } from 'lucide-react';
import api from '../services/api';

export default function Footer() {
  const [healthStatus, setHealthStatus] = useState('checking');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await api.get('/health');
        if (res.status === 'healthy') {
          setHealthStatus('healthy');
        } else {
          setHealthStatus('degraded');
        }
      } catch {
        setHealthStatus('offline');
      }
    }
    checkHealth();
  }, []);

  return (
    <footer className="bg-navy-950 border-t border-navy-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Subjects Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-navy-800/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">1. System Design</p>
              <p className="text-[11px] text-slate-400">Modular 6-Tier Architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">2. DBMS (MySQL)</p>
              <p className="text-[11px] text-slate-400">Normalized 3NF & Cascades</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">3. Azure Cloud</p>
              <p className="text-[11px] text-slate-400">App Service & SWA Hosting</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">4. Cyber Security</p>
              <p className="text-[11px] text-slate-400">JWT, bcrypt & Rate Limiting</p>
            </div>
          </div>
        </div>

        {/* Middle Footer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-navy-800/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-navy-950 font-bold">
                <Navigation className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Route<span className="text-emerald-400">Wise</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Smart Route Planning and Optimization System. Generates multi-criteria driving alternatives, calculates fuel costs, and persists navigation history in normalized MySQL storage.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Fast Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li><Link to="/planner" className="hover:text-emerald-400 transition-colors">Route Planner & Map</Link></li>
              <li><Link to="/history" className="hover:text-emerald-400 transition-colors">Search History & Re-route</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Travel Economics Dashboard</Link></li>
              <li><Link to="/settings" className="hover:text-emerald-400 transition-colors">Vehicle Mileage & Fuel Rates</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Architecture & Subject Report</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              System Health & Cloud Telemetry
            </p>
            <div className="p-3 rounded-lg bg-navy-900 border border-navy-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  API Status
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                  healthStatus === 'healthy' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : healthStatus === 'degraded'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${healthStatus === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {healthStatus.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Backend runtime: Express.js | OpenStreetMap Leaflet | Photon Geocoding | OSRM Driving Engine
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 RouteWise. Academic BTech CSE AI & ML University Capstone Project.</p>
          <p className="text-slate-400">Developed with System Design, DBMS, Azure & Security standards.</p>
        </div>

      </div>
    </footer>
  );
}
