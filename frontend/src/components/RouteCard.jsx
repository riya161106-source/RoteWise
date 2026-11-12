import React from 'react';
import { Clock, Navigation, Fuel, IndianRupee, Zap, Award, CheckCircle2 } from 'lucide-react';

export default function RouteCard({ 
  route, 
  index, 
  isSelected = false, 
  onSelect 
}) {
  const formatDuration = (mins) => {
    const totalMinutes = Math.round(mins);
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const remainingMins = totalMinutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'RECOMMENDED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'FASTEST':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SHORTEST':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'CHEAPEST':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl p-4 transition-all cursor-pointer border relative text-left ${
        isSelected
          ? 'bg-navy-800/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
          : 'bg-navy-900/70 border-navy-700/60 hover:border-navy-600 hover:bg-navy-850'
      }`}
    >
      {/* Top Header: Route Title & Badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              isSelected ? 'bg-emerald-500 text-navy-950' : 'bg-navy-700 text-slate-300'
            }`}>
              {index + 1}
            </span>
            <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400">
              {route.routeName}
            </h4>
          </div>
          {route.summary && (
            <p className="text-[11px] text-slate-400 mt-0.5 ml-7">
              {route.summary}
            </p>
          )}
        </div>

        {isSelected && (
          <span className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Selected</span>
          </span>
        )}
      </div>

      {/* Badges Ribbon */}
      {route.badges && route.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {route.badges.map((b) => (
            <span
              key={b}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${getBadgeStyle(b)}`}
            >
              {b === 'RECOMMENDED' && <Award className="w-3 h-3" />}
              {b === 'FASTEST' && <Zap className="w-3 h-3" />}
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-navy-700/40">
        
        {/* Duration */}
        <div className="p-2 rounded-lg bg-navy-900/60 border border-navy-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" />
            Est. Time
          </span>
          <p className="text-sm font-bold text-slate-100 mt-0.5">
            {formatDuration(route.durationMins)}
          </p>
        </div>

        {/* Distance */}
        <div className="p-2 rounded-lg bg-navy-900/60 border border-navy-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-emerald-400" />
            Distance
          </span>
          <p className="text-sm font-bold text-slate-100 mt-0.5">
            {route.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
          </p>
        </div>

        {/* Fuel Required */}
        <div className="p-2 rounded-lg bg-navy-900/60 border border-navy-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Fuel className="w-3 h-3 text-sky-400" />
            Fuel Needed
          </span>
          <p className="text-sm font-bold text-slate-100 mt-0.5">
            {route.fuelRequiredLitres} <span className="text-xs font-normal text-slate-400">L</span>
          </p>
        </div>

        {/* Fuel Cost */}
        <div className="p-2 rounded-lg bg-navy-900/60 border border-navy-800">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <IndianRupee className="w-3 h-3 text-amber-400" />
            Fuel Cost
          </span>
          <p className="text-sm font-bold text-amber-400 mt-0.5">
            ₹{route.estimatedFuelCost}
          </p>
        </div>

      </div>

      {/* Select button footer */}
      <div className="mt-3 text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
            isSelected
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-navy-700 hover:bg-emerald-600 hover:text-navy-950 text-slate-300'
          }`}
        >
          {isSelected ? 'Viewing on Map' : 'Select This Route'}
        </button>
      </div>

    </div>
  );
}
