import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Trash2, 
  RotateCcw, 
  MapPin, 
  Calendar, 
  Clock, 
  Navigation, 
  IndianRupee, 
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import Toast from '../components/Toast';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/history');
      if (res.success && res.history) {
        setHistory(res.history);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to fetch search history from MySQL database'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (searchId) => {
    if (!window.confirm('Are you sure you want to delete this search history record from the database?')) {
      return;
    }

    try {
      setActionLoading(`del-${searchId}`);
      const res = await api.delete(`/history/${searchId}`);
      if (res.success) {
        setHistory(prev => prev.filter(item => item.search_id !== searchId));
        setNotification({
          type: 'success',
          message: 'Search record deleted successfully from MySQL.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete search record.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecalculate = (item) => {
    navigate(`/planner?source=${encodeURIComponent(item.source)}&destination=${encodeURIComponent(item.destination)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-emerald-400" />
            Saved Search History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Persisted in normalized MySQL relational database tables with foreign key cascades
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-navy-700 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading history from MySQL database...</p>
        </div>
      ) : history.length === 0 ? (
        /* Empty State */
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-navy-900/60 border border-navy-800 rounded-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-navy-800 text-slate-400 flex items-center justify-center mb-4">
            <Navigation className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Search Records Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6">
            When you calculate routes while logged in, your origins, destinations, and alternative route solutions are saved here.
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-md"
          >
            Plan Your First Route
          </button>
        </div>
      ) : (
        /* History Items List */
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.search_id}
              className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-lg space-y-4 text-left transition-all hover:border-navy-600"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>{item.source}</span>
                      <span className="text-emerald-400">→</span>
                      <span>{item.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(item.search_date).toLocaleString()}</span>
                      <span className="text-slate-600">•</span>
                      <span>Search ID #{item.search_id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleRecalculate(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Recalculate
                  </button>

                  <button
                    onClick={() => handleDelete(item.search_id)}
                    disabled={actionLoading === `del-${item.search_id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record from MySQL"
                  >
                    {actionLoading === `del-${item.search_id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Associated Routes List */}
              {item.routes && item.routes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Computed Route Options ({item.routes.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.routes.map((r, rIdx) => (
                      <div
                        key={r.route_id || rIdx}
                        className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 truncate">{r.route_name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {r.route_type}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-1 text-slate-400 text-[11px]">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Distance</span>
                            <span className="font-semibold text-slate-200">{r.distance} km</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Duration</span>
                            <span className="font-semibold text-slate-200">{r.duration}m</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Fuel Cost</span>
                            <span className="font-semibold text-amber-400">₹{r.estimated_fuel_cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

    </div>
  );
}
