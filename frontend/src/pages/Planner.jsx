import React, { useState, useEffect } from 'react';
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
  Clock, 
  Sparkles, 
  Info,
  Plus,
  Trash2,
  Printer,
  ListOrdered,
  Leaf
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import RouteCard from '../components/RouteCard';
import FuelCalculator from '../components/FuelCalculator';
import StepDirections from '../components/StepDirections';
import Toast from '../components/Toast';

export default function Planner() {
  const [searchParams] = useSearchParams();
  const { fuelSettings, updateSettings, isAuthenticated } = useAuth();

  // Form locations
  const [source, setSource] = useState(searchParams.get('source') || 'Bengaluru, Karnataka');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Mysuru, Karnataka');
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  // Multi-stop intermediate waypoints [{ id, value, coords }]
  const [waypoints, setWaypoints] = useState([]);

  // Autocomplete states
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // Departure hour for AI traffic model
  const [departureHour, setDepartureHour] = useState(new Date().getHours());

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
  const [resolvedWaypoints, setResolvedWaypoints] = useState([]);
  const [resolvedDest, setResolvedDest] = useState(null);
  const [focusPoint, setFocusPoint] = useState(null);
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState(false);
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
        if (res.success && res.locations) setSourceSuggestions(res.locations);
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
        if (res.success && res.locations) setDestSuggestions(res.locations);
      } catch (err) {
        console.warn('Geocoding autocomplete failed:', err.message);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [destination]);

  // Add intermediate waypoint
  const handleAddWaypoint = () => {
    if (waypoints.length >= 3) {
      setNotification({ type: 'info', message: 'Maximum 3 intermediate stops allowed.' });
      return;
    }
    setWaypoints([...waypoints, { id: Date.now(), value: '', coords: null }]);
  };

  // Remove intermediate waypoint
  const handleRemoveWaypoint = (id) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  // Update waypoint value
  const handleWaypointChange = (id, val) => {
    setWaypoints(waypoints.map(w => w.id === id ? { ...w, value: val, coords: null } : w));
  };

  // Swap source & destination
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
      setNotification({ type: 'error', message: 'Please enter both origin and destination locations.' });
      return;
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setNotification({ type: 'error', message: 'Origin and destination cannot be identical.' });
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
        waypoints: waypoints.map(w => w.coords ? { ...w.coords, name: w.value } : w.value).filter(Boolean),
        fuelSettings: {
          fuelType: currentFuel.fuel_type,
          mileage: currentFuel.mileage,
          fuelPrice: currentFuel.fuel_price
        },
        departureHour: parseInt(departureHour, 10),
        saveToHistory: isAuthenticated
      };

      const res = await api.post('/routes/calculate', payload);

      if (res.success && res.routes && res.routes.length > 0) {
        setRoutes(res.routes);
        setSelectedRouteIndex(0);
        setResolvedSource(res.source);
        setResolvedWaypoints(res.waypoints || []);
        setResolvedDest(res.destination);
        setDisclaimer(res.disclaimer);
        setFocusPoint(null);

        setNotification({
          type: 'success',
          message: `Calculated ${res.routes.length} driving route(s) with AI fuel & emission predictions!`
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
          },
          departureHour: parseInt(departureHour, 10)
        });
        if (res.success && res.routes) {
          setRoutes(res.routes);
        }
      } catch (err) {
        console.warn('Fuel recalculation error:', err.message);
      }
    }
  };

  // Handle focusing a turn-by-turn maneuver on map
  const handleStepFocus = (coords) => {
    if (coords && coords.length === 2) {
      // OSRM returns [lng, lat], Leaflet takes [lat, lng]
      setFocusPoint([coords[1], coords[0]]);
    }
  };

  // Print Trip Itinerary
  const handlePrintItinerary = () => {
    window.print();
  };

  // Auto-run if coming from query params
  useEffect(() => {
    if (searchParams.get('source') && searchParams.get('destination')) {
      handleCalculate();
    }
  }, []);

  const activeRoute = routes[selectedRouteIndex] || routes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            Route Planner & Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real OSRM highway coordinates, multi-stop waypoints, AI predictive traffic models, and carbon emissions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {routes.length > 0 && (
            <button
              type="button"
              onClick={handlePrintItinerary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-semibold border border-navy-700 transition-colors shadow-sm"
              title="Print or save PDF of route itinerary"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Itinerary</span>
            </button>
          )}

          {isAuthenticated && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>MySQL Auto-Save Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Inputs + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Location Input Form */}
          <form onSubmit={handleCalculate} className="bg-navy-900 border border-navy-700/80 rounded-2xl p-5 shadow-xl space-y-4 text-left">
            
            <div className="flex items-center justify-between pb-1 border-b border-navy-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Trip Waypoints
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddWaypoint}
                  className="p-1 px-2 rounded-lg text-emerald-400 hover:bg-navy-800 border border-emerald-500/20 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                  title="Add intermediate stop"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Stop</span>
                </button>

                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="p-1 px-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-navy-800 transition-colors flex items-center gap-1 text-[11px]"
                  title="Swap source and destination"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Swap</span>
                </button>
              </div>
            </div>

            {/* Source Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Origin [A]
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
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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

            {/* Intermediate Waypoints (Via points) */}
            {waypoints.map((wp, index) => (
              <div key={wp.id} className="relative animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    Intermediate Stop #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWaypoint(wp.id)}
                    className="text-slate-400 hover:text-rose-400 text-[10px] flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </label>
                <input
                  type="text"
                  value={wp.value}
                  onChange={(e) => handleWaypointChange(wp.id, e.target.value)}
                  placeholder="e.g. Mandya or Highway Rest Stop"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            ))}

            {/* Destination Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Destination [B]
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
                  placeholder="e.g. Mysuru, Karnataka"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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

            {/* Time of Day (AI Traffic Congestion Factor) */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Departure Time (AI Traffic Congestion Multiplier)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {departureHour}:00 hrs
                </span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-navy-950 rounded-xl border border-navy-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDepartureHour(9)}
                  className={`py-1 rounded-lg font-medium transition-all ${
                    departureHour >= 8 && departureHour <= 10
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Peak Morning
                </button>
                <button
                  type="button"
                  onClick={() => setDepartureHour(14)}
                  className={`py-1 rounded-lg font-medium transition-all ${
                    departureHour >= 11 && departureHour <= 16
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Normal Day
                </button>
                <button
                  type="button"
                  onClick={() => setDepartureHour(18)}
                  className={`py-1 rounded-lg font-medium transition-all ${
                    departureHour >= 17 && departureHour <= 20
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Peak Evening
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-navy-950 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Predicting & Calculating Driving Routes...
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
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[480px] lg:h-[540px]">
            <MapView
              source={resolvedSource}
              waypoints={resolvedWaypoints}
              destination={resolvedDest}
              routes={routes}
              selectedRouteIndex={selectedRouteIndex}
              focusPoint={focusPoint}
              onSelectRoute={(idx) => setSelectedRouteIndex(idx)}
            />
          </div>

          {/* Collapsible Turn-by-Turn Maneuvers Drawer */}
          {activeRoute && activeRoute.steps && activeRoute.steps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDirectionsDrawer(!showDirectionsDrawer)}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1"
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>{showDirectionsDrawer ? 'Hide' : 'Show'} Step-by-Step Maneuver Directions ({activeRoute.steps.length} turns)</span>
                </button>

                <span className="text-[11px] text-slate-400 font-mono">
                  Active: {activeRoute.routeName}
                </span>
              </div>

              {showDirectionsDrawer && (
                <StepDirections
                  steps={activeRoute.steps}
                  routeName={activeRoute.routeName}
                  onSelectStep={handleStepFocus}
                />
              )}
            </div>
          )}
        </div>

      </div>

      {/* Route Comparison Section */}
      {routes.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-navy-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Evaluated Driving Routes ({routes.length})
              </h2>
              <p className="text-xs text-slate-400">
                Click any card to select, view detailed path, and review carbon emissions (CO₂)
              </p>
            </div>

            {disclaimer && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{disclaimer}</span>
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
                showSteps={showDirectionsDrawer && idx === selectedRouteIndex}
                onSelect={() => setSelectedRouteIndex(idx)}
                onToggleSteps={() => {
                  setSelectedRouteIndex(idx);
                  setShowDirectionsDrawer(!showDirectionsDrawer);
                }}
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
