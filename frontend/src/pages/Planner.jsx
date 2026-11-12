import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Search, 
  Fuel, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Share2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import RouteCard from '../components/RouteCard';
import FuelCalculator from '../components/FuelCalculator';
import Toast from '../components/Toast';

export default function Planner() {
  const [searchParams] = useSearchParams();
  const { fuelSettings, updateSettings, isAuthenticated } = useAuth();

  // Form states
  const [source, setSource] = useState(searchParams.get('source') || 'Bengaluru, Karnataka');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Mysuru, Karnataka');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  // Autocomplete states
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Fuel configuration
  const [currentFuel, setCurrentFuel] = useState({
    fuel_type: fuelSettings?.fuel_type || 'Petrol',
    mileage: fuelSettings?.mileage || 15.0,
    fuel_price: fuelSettings?.fuel_price || 102.5
  });

  // Results & route states
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [resolvedSource, setResolvedSource] = useState(null);
  const [resolvedDest, setResolvedDest] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');
  const [notification, setNotification] = useState(null);

  // Sync initial fuel preferences
  useEffect(() => {
    if (fuelSettings) {
      setCurrentFuel({
        fuel_type: fuelSettings.fuel_type || 'Petrol',
        mileage: fuelSettings.mileage || 15.0,
        fuel_price: fuelSettings.fuel_price || 102.5
      });
    }
  }, [fuelSettings]);

  // Autocomplete debouncing for Source
  useEffect(() => {
    if (!source || source.length < 2) {
      setSourceSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/routes/search-location?q=${encodeURIComponent(source)}`);
        if (res.success && res.locations) {
          setSourceSuggestions(res.locations);
        }
      } catch (err) {
        console.warn('Geocoding autocomplete failed:', err.message);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [source]);

  // Autocomplete debouncing for Destination
  useEffect(() => {
    if (!destination || destination.length < 2) {
      setDestSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/routes/search-location?q=${encodeURIComponent(destination)}`);
        if (res.success && res.locations) {
          setDestSuggestions(res.locations);
        }
      } catch (err) {
        console.warn('Geocoding autocomplete failed:', err.message);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destination]);

  // Swap locations helper
  const handleSwapLocations = () => {
    const tempSrc = source;
    const tempCoords = sourceCoords;
    setSource(destination);
    setSourceCoords(destCoords);
    setDestination(tempSrc);
    setDestCoords(tempCoords);
  };

  // Calculate Routes Trigger
  const handleCalculate = async (e) => {
    if (e) e.preventDefault();

    if (!source.trim() || !destination.trim()) {
      setNotification({ type: 'error', message: 'Please enter both source and destination locations.' });
      return;
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setNotification({ type: 'error', message: 'Source and destination cannot be identical.' });
      return;
    }

    setLoading(true);
    setShowSourceSuggestions(false);
    setShowDestSuggestions(false);

    try {
      const payload = {
        source: source.trim(),
        destination: destination.trim(),
        sourceCoords,
        destCoords,
        fuelSettings: {
          fuelType: currentFuel.fuel_type,
          mileage: currentFuel.mileage,
          fuelPrice: currentFuel.fuel_price
        },
        saveToHistory: isAuthenticated
      };

      const res = await api.post('/routes/calculate', payload);

      if (res.success && res.routes && res.routes.length > 0) {
        setRoutes(res.routes);
        setSelectedRouteIndex(0);
        setResolvedSource(res.source);
        setResolvedDest(res.destination);
        setDisclaimer(res.disclaimer);

        setNotification({
          type: 'success',
          message: `Calculated ${res.routes.length} driving route(s) via real OSRM driving engine!`
        });
      } else {
        throw new Error(res.message || 'No driving routes found between these locations.');
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to calculate driving routes. Please verify location names.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Recalculate fuel locally when fuel parameters change
  const handleFuelSettingsChange = async (newFuel) => {
    setCurrentFuel(newFuel);

    if (routes.length > 0) {
      try {
        const res = await api.post('/routes/recalculate-fuel', {
          routes,
          fuelSettings: {
            fuelType: newFuel.fuel_type,
            mileage: newFuel.mileage,
            fuelPrice: newFuel.fuel_price
          }
        });
        if (res.success && res.routes) {
          setRoutes(res.routes);
        }
      } catch (err) {
        console.warn('Fuel recalculation error:', err.message);
      }
    }
  };

  // Auto-run search if coming from query params
  useEffect(() => {
    if (searchParams.get('source') && searchParams.get('destination')) {
      handleCalculate();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            Route Planner & Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real OpenStreetMap coordinates, OSRM driving paths, and dynamic fuel calculations
          </p>
        </div>

        {isAuthenticated && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Search history auto-persists to MySQL
          </div>
        )}
      </div>

      {/* Main Grid: Inputs + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Location Input Form */}
          <form onSubmit={handleCalculate} className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4 text-left">
            
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Trip Coordinates</span>
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-navy-800 transition-colors flex items-center gap-1 text-[11px] font-normal"
                title="Swap source and destination"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            </h3>

            {/* Source Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Origin (Source Location)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setSourceCoords(null);
                    setShowSourceSuggestions(true);
                  }}
                  onFocus={() => setShowSourceSuggestions(true)}
                  placeholder="e.g. Bengaluru, Karnataka or Koramangala"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Autocomplete Dropdown for Source */}
              {showSourceSuggestions && sourceSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-navy-800">
                  {sourceSuggestions.map((loc, idx) => (
                    <button
                      key={`src-sug-${idx}`}
                      type="button"
                      onClick={() => {
                        setSource(loc.displayName);
                        setSourceCoords(loc);
                        setShowSourceSuggestions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-navy-800 transition-colors flex items-start gap-2"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-200 truncate">{loc.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{loc.displayName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Destination (End Point)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setDestCoords(null);
                    setShowDestSuggestions(true);
                  }}
                  onFocus={() => setShowDestSuggestions(true)}
                  placeholder="e.g. Mysuru, Karnataka or Airport"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Autocomplete Dropdown for Destination */}
              {showDestSuggestions && destSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-navy-800">
                  {destSuggestions.map((loc, idx) => (
                    <button
                      key={`dest-sug-${idx}`}
                      type="button"
                      onClick={() => {
                        setDestination(loc.displayName);
                        setDestCoords(loc);
                        setShowDestSuggestions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-navy-800 transition-colors flex items-start gap-2"
                    >
                      <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-200 truncate">{loc.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{loc.displayName}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Driving Routes...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Calculate & Optimize Routes
                </>
              )}
            </button>

          </form>

          {/* Vehicle Fuel Economics Panel */}
          <FuelCalculator
            fuelSettings={currentFuel}
            onSettingsChange={handleFuelSettingsChange}
            onSaveServer={updateSettings}
            disabled={loading}
          />

        </div>

        {/* Right Map Column (7 cols) */}
        <div className="lg:col-span-7 h-[480px] lg:h-[560px]">
          <MapView
            source={resolvedSource}
            destination={resolvedDest}
            routes={routes}
            selectedRouteIndex={selectedRouteIndex}
            onSelectRoute={(idx) => setSelectedRouteIndex(idx)}
          />
        </div>

      </div>

      {/* Route Comparison Section */}
      {routes.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-navy-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Available Driving Route Alternatives ({routes.length})
              </h2>
              <p className="text-xs text-slate-400">
                Select any card to highlight and review route path on the Leaflet map
              </p>
            </div>

            {disclaimer && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                {disclaimer}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route, idx) => (
              <RouteCard
                key={`route-card-${idx}`}
                route={route}
                index={idx}
                isSelected={idx === selectedRouteIndex}
                onSelect={() => setSelectedRouteIndex(idx)}
              />
            ))}
          </div>

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
