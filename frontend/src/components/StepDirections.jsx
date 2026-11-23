import React from 'react';
import { 
  CornerUpLeft, 
  CornerUpRight, 
  ArrowUp, 
  RotateCcw, 
  RefreshCw, 
  GitFork, 
  GitMerge, 
  MapPin, 
  Flag, 
  Navigation,
  Clock,
  Compass
} from 'lucide-react';

export default function StepDirections({ 
  steps = [], 
  routeName = 'Primary Route',
  onSelectStep 
}) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-4 bg-navy-900 border border-navy-800 rounded-xl text-center text-xs text-slate-400">
        No step-by-step navigation instructions available for this route.
      </div>
    );
  }

  // Format meter distance into readable km or meters
  const formatDistance = (m) => {
    if (!m || m < 1000) {
      return `${Math.round(m || 0)} m`;
    }
    return `${(m / 1000).toFixed(1)} km`;
  };

  // Get matching icon based on maneuver
  const getManeuverIcon = (iconType) => {
    switch (iconType) {
      case 'turn-left':
        return <CornerUpLeft className="w-4 h-4 text-emerald-400" />;
      case 'turn-right':
        return <CornerUpRight className="w-4 h-4 text-emerald-400" />;
      case 'roundabout':
        return <RefreshCw className="w-4 h-4 text-sky-400" />;
      case 'uturn':
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
      case 'fork':
        return <GitFork className="w-4 h-4 text-indigo-400" />;
      case 'merge':
        return <GitMerge className="w-4 h-4 text-indigo-400" />;
      case 'depart':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'arrive':
        return <Flag className="w-4 h-4 text-rose-400" />;
      default:
        return <ArrowUp className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-4 sm:p-5 shadow-xl text-left space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Turn-by-Turn Navigation Instructions</h3>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              {routeName} • {steps.length} driving maneuvers
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700 hidden sm:inline">
          Click any step to inspect on map
        </span>
      </div>

      {/* Steps List */}
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {steps.map((st, idx) => (
          <div
            key={`step-${idx}`}
            onClick={() => onSelectStep && st.coordinates && onSelectStep(st.coordinates)}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-navy-950/70 border border-navy-800/80 hover:border-emerald-500/50 hover:bg-navy-850 cursor-pointer transition-all group"
          >
            {/* Step Number & Icon */}
            <div className="flex flex-col items-center shrink-0 w-8">
              <div className="w-7 h-7 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                {getManeuverIcon(st.icon)}
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 font-mono">{idx + 1}</span>
            </div>

            {/* Instruction & Road Name */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                {st.instruction}
              </p>
              {st.streetName && st.streetName !== 'Unnamed Road' && (
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Road: <span className="text-slate-300 font-medium">{st.streetName}</span>
                </p>
              )}
            </div>

            {/* Distance badge */}
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-slate-300 block">
                {formatDistance(st.distanceMeters)}
              </span>
              {st.durationSeconds > 0 && (
                <span className="text-[10px] text-slate-500">
                  ~{Math.round(st.durationSeconds / 60) || 1}m
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
