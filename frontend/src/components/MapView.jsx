import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Compass } from 'lucide-react';

// Custom Map Bounds & Step Focus Updater
function MapBoundsUpdater({ bounds, center, focusPoint }) {
  const map = useMap();

  useEffect(() => {
    if (focusPoint && focusPoint.length === 2 && !isNaN(focusPoint[0])) {
      try {
        map.flyTo(focusPoint, 15, { animate: true, duration: 1.2 });
      } catch (e) {
        console.warn('Map flyTo error:', e);
      }
    } else if (bounds && bounds.length >= 2) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } catch (e) {
        console.warn('Map fitBounds error:', e);
      }
    } else if (center && center.length === 2 && !isNaN(center[0])) {
      map.setView(center, 12);
    }
  }, [bounds, center, focusPoint, map]);

  return null;
}

// Custom Marker Icons using SVG
const createCustomIcon = (type, customLabel = null) => {
  let color = '#10B981';
  let label = 'A';

  if (type === 'end') {
    color = '#F43F5E';
    label = 'B';
  } else if (type === 'via') {
    color = '#8B5CF6';
    label = customLabel || 'Via';
  }

  const html = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    ">
      <span style="
        transform: rotate(45deg);
        color: #FFFFFF;
        font-weight: 800;
        font-size: 11px;
        font-family: sans-serif;
      ">${label}</span>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-route-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const startIcon = createCustomIcon('start', 'A');
const endIcon = createCustomIcon('end', 'B');

// Tile layers configurations (Free, open-access, zero API key required)
const TILE_PROVIDERS = {
  osm: {
    name: 'OpenStreetMap (Standard)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  esri: {
    name: 'Esri World Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, USGS, NGA & OpenStreetMap'
  },
  topo: {
    name: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap contributors'
  }
};

export default function MapView({ 
  source, 
  waypoints = [],
  destination, 
  routes = [], 
  selectedRouteIndex = 0, 
  focusPoint = null,
  onSelectRoute 
}) {
  const [activeTileKey, setActiveTileKey] = useState('osm');
  const [showTileMenu, setShowTileMenu] = useState(false);

  // Default center: India (Bengaluru)
  const defaultCenter = [12.9716, 77.5946];

  let center = defaultCenter;
  let bounds = null;

  const validPoints = [
    source?.lat && source?.lng ? [source.lat, source.lng] : null,
    ...(waypoints || []).map(w => w?.lat && w?.lng ? [w.lat, w.lng] : null),
    destination?.lat && destination?.lng ? [destination.lat, destination.lng] : null
  ].filter(Boolean);

  if (validPoints.length >= 2) {
    bounds = validPoints;
  } else if (validPoints.length === 1) {
    center = validPoints[0];
  }

  const activeTile = TILE_PROVIDERS[activeTileKey] || TILE_PROVIDERS.osm;

  return (
    <div className="w-full h-full min-h-[440px] rounded-2xl overflow-hidden border border-navy-700/80 bg-navy-900 shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution={activeTile.attribution}
          url={activeTile.url}
        />

        <MapBoundsUpdater bounds={bounds} center={center} focusPoint={focusPoint} />

        {/* Source Marker */}
        {source?.lat && source?.lng && (
          <Marker position={[source.lat, source.lng]} icon={startIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block">Origin (A)</span>
                <p className="text-slate-200 font-medium">{source.name || 'Start Point'}</p>
                <p className="text-slate-400 font-mono text-[10px]">{source.lat.toFixed(4)}, {source.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Intermediate Waypoint Markers */}
        {waypoints.map((wp, wIdx) => {
          if (!wp?.lat || !wp?.lng) return null;
          const viaIcon = createCustomIcon('via', `${wIdx + 1}`);
          return (
            <Marker key={`wp-marker-${wIdx}`} position={[wp.lat, wp.lng]} icon={viaIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-purple-400 uppercase tracking-wider block">Waypoint #{wIdx + 1}</span>
                  <p className="text-slate-200 font-medium">{wp.name || `Intermediate Stop ${wIdx + 1}`}</p>
                  <p className="text-slate-400 font-mono text-[10px]">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Destination Marker */}
        {destination?.lat && destination?.lng && (
          <Marker position={[destination.lat, destination.lng]} icon={endIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider block">Destination (B)</span>
                <p className="text-slate-200 font-medium">{destination.name || 'End Point'}</p>
                <p className="text-slate-400 font-mono text-[10px]">{destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render Route Polylines */}
        {routes.map((route, idx) => {
          if (!route.geometry || !route.geometry.coordinates) return null;

          // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
          const positions = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const isSelected = idx === selectedRouteIndex;

          return (
            <Polyline
              key={`route-polyline-${idx}`}
              positions={positions}
              pathOptions={{
                color: isSelected ? '#10B981' : '#64748B',
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 0.95 : 0.5,
                dashArray: isSelected ? null : '4, 8'
              }}
              eventHandlers={{
                click: () => {
                  if (onSelectRoute) onSelectRoute(idx);
                }
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">{route.routeName}</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Distance</span>
                      <span className="font-semibold text-emerald-400">{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Duration</span>
                      <span className="font-semibold text-indigo-400">{route.durationMins} mins</span>
                    </div>
                  </div>
                  <div className="pt-1 text-slate-300">
                    <span className="text-slate-400 block text-[10px]">Fuel & Carbon</span>
                    <span className="font-bold text-amber-400">₹{route.estimatedFuelCost}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({route.co2EmissionsKg || 0} kg CO₂)</span>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>

      {/* Floating Map Tile Switcher (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] pointer-events-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTileMenu(!showTileMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/95 backdrop-blur-md border border-navy-700 text-xs font-semibold text-slate-200 hover:text-white shadow-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Map Style</span>
          </button>

          {showTileMenu && (
            <div className="absolute right-0 top-full mt-1.5 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl p-1.5 space-y-1 w-36 z-50">
              {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTileKey(key);
                    setShowTileMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeTileKey === key
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'text-slate-300 hover:bg-navy-800'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-[400] bg-navy-900/90 backdrop-blur-md border border-navy-700/80 rounded-xl p-3 text-[11px] shadow-lg pointer-events-auto">
        <p className="font-bold text-slate-200 mb-1.5 uppercase tracking-wider text-[10px]">Map Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-500 rounded-full"></span>
            <span className="text-slate-300">Active Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 border-b border-dashed border-slate-400"></span>
            <span className="text-slate-400">Alternative Route</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            <span className="text-slate-300">Start [A]</span>
            {waypoints.length > 0 && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-white ml-1"></span>
                <span className="text-slate-300">Via</span>
              </>
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white ml-1"></span>
            <span className="text-slate-300">End [B]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
