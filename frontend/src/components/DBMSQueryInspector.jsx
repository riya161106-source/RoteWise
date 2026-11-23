import React, { useState, useEffect } from 'react';
import { Database, Play, CheckCircle, Clock, Code2, Table, Layers, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DBMSQueryInspector() {
  const { isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState('MULTI_TABLE_JOIN');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryOptions = [
    {
      id: 'MULTI_TABLE_JOIN',
      name: 'Multi-Table 3-Way JOIN',
      badge: 'Relational JOIN',
      desc: 'Joins search_history and routes tables via Foreign Key with chronological ordering.'
    },
    {
      id: 'SQL_AGGREGATES',
      name: 'SQL Aggregate Analytics',
      badge: 'COUNT / SUM / AVG',
      desc: 'Runs COUNT(DISTINCT), SUM(distance), and AVG(duration) in a single optimized pass.'
    },
    {
      id: '3NF_USER',
      name: '3NF User Profile Query',
      badge: 'Atomic Projection',
      desc: 'Extracts normalized atomic user data without transitive anomalies (3NF validated).'
    }
  ];

  const executeQuery = async (type = selectedType) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/history/query-inspector?type=${type}`);
      if (res.success) {
        setQueryResult(res);
      }
    } catch (err) {
      setError(err.message || 'Error executing SQL query');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      executeQuery(selectedType);
    }
  }, [selectedType, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-navy-900 border border-navy-800 rounded-2xl text-center space-y-2">
        <Database className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">Live DBMS Query Inspector</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Sign in to execute live relational SQL JOINs and aggregate queries against the MySQL database.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-5 sm:p-6 shadow-xl text-left space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              Live DBMS Relational Query Inspector
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Academic Evaluation Tool
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute parameterized SQL statements live against the MySQL database and inspect returned records
            </p>
          </div>
        </div>

        <button
          onClick={() => executeQuery(selectedType)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {loading ? 'Executing...' : 'Re-run Query'}
        </button>
      </div>

      {/* Query Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {queryOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelectedType(opt.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedType === opt.id
                ? 'bg-navy-800 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-navy-950/60 border-navy-800 hover:border-navy-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-100">{opt.name}</span>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-navy-900 border border-navy-700 text-emerald-400">
                {opt.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {opt.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Query Details & SQL View */}
      {queryResult && (
        <div className="space-y-4">
          {/* SQL Block */}
          <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                Parameterized SQL Statement
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                <Clock className="w-3 h-3 text-emerald-400" />
                Execution time: <strong className="text-emerald-400">{queryResult.executionTimeMs} ms</strong>
              </span>
            </div>
            <pre className="font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed bg-navy-900/80 p-3 rounded-lg border border-navy-800">
              {queryResult.sql}
            </pre>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-mono">
              <span>Binding Parameters:</span>
              <span className="text-amber-300 font-bold">[{queryResult.parameters.join(', ')}]</span>
              <span className="text-slate-500 text-[10px] ml-auto">Protection: Parameterized Query (SQL Injection Safe)</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Table className="w-4 h-4 text-emerald-400" />
                Relational Result Set ({queryResult.rowCount} record{queryResult.rowCount !== 1 ? 's' : ''})
              </span>
            </div>

            {queryResult.rows && queryResult.rows.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-navy-800 bg-navy-950">
                <table className="w-full text-left text-xs divide-y divide-navy-800">
                  <thead className="bg-navy-900/90 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      {Object.keys(queryResult.rows[0]).map((col) => (
                        <th key={col} className="px-3.5 py-2.5 font-bold truncate">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 font-mono text-slate-200">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={`row-${rIdx}`} className="hover:bg-navy-850 transition-colors">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={`cell-${rIdx}-${cIdx}`} className="px-3.5 py-2 whitespace-nowrap text-[11px]">
                            {typeof val === 'number' ? (
                              <span className="text-amber-400">{val}</span>
                            ) : val === null || val === undefined ? (
                              <span className="text-slate-500 italic">NULL</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800 text-center text-xs text-slate-400">
                No matching rows returned for current user. Plan a route to generate records.
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
