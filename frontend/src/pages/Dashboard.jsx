import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Navigation, 
  IndianRupee, 
  Clock, 
  Fuel, 
  TrendingUp, 
  ArrowRight,
  Database,
  Loader2,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, fuelSettings } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        // Load aggregate statistics from MySQL
        const statsRes = await api.get('/history/analytics/stats');
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }

        // Load recent searches
        const histRes = await api.get('/history');
        if (histRes.success && histRes.history) {
          setRecentSearches(histRes.history.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard loading error:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Travel Intelligence Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Explorer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Here is your live route planning analytics, database telemetry, and vehicle fuel economics profile.
          </p>
        </div>

        <Link
          to="/planner"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
        >
          <Search className="w-4 h-4" />
          Plan New Route
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {/* Aggregate Statistics Cards (DBMS Aggregate Queries) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Relational Aggregate Metrics (SQL COUNT, SUM, AVG)
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Live DBMS Query</span>
        </div>

        {loading ? (
          <div className="min-h-[140px] flex items-center justify-center bg-navy-900/60 rounded-xl border border-navy-800">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Total Searches */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-md text-left">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <Search className="w-4 h-4 text-emerald-400" />
                Total Searches
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.totalSearches || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Queries recorded</p>
            </div>

            {/* Total Distance */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-md text-left">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <Navigation className="w-4 h-4 text-sky-400" />
                Distance Computed
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.totalDistanceKm || 0} <span className="text-sm font-normal text-slate-400">km</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Total route span</p>
            </div>

            {/* Total Estimated Fuel Cost */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-md text-left">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                Est. Fuel Budget
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                ₹{stats?.totalFuelCostInr || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Across all solutions</p>
            </div>

            {/* Average Duration */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-700/80 shadow-md text-left">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Avg. Trip Time
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.avgTripDurationMins || 0} <span className="text-sm font-normal text-slate-400">min</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Mean driving duration</p>
            </div>

          </div>
        )}
      </div>

      {/* Two Columns: Recent Searches + Vehicle Economics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Searches (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-700/80 rounded-2xl p-6 shadow-xl space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h3 className="font-bold text-sm text-white">Recent Planned Routes</h3>
            <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentSearches.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent route searches recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSearches.map((s) => (
                <div
                  key={s.search_id}
                  className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-200">
                      {s.source} <span className="text-emerald-400 font-bold">→</span> {s.destination}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(s.search_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/planner?source=${encodeURIComponent(s.source)}&destination=${encodeURIComponent(s.destination)}`}
                    className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-emerald-600 hover:text-navy-950 text-slate-300 font-semibold text-[11px] transition-colors"
                  >
                    Re-run
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Economics Status (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-700/80 rounded-2xl p-6 shadow-xl space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Vehicle Profile</h3>
            </div>
            <Link to="/settings" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
              Edit
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <span className="text-slate-400">Primary Fuel</span>
              <span className="font-bold text-slate-200 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {fuelSettings?.fuel_type || 'Petrol'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <span className="text-slate-400">Configured Mileage</span>
              <span className="font-mono font-bold text-slate-200">
                {fuelSettings?.mileage || 15.0} km/L
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs">
              <span className="text-slate-400">Current Fuel Price</span>
              <span className="font-mono font-bold text-amber-400">
                ₹{fuelSettings?.fuel_price || 102.5} / Litre
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
