import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Bounds Updater
function MapBoundsUpdater({ bounds, center }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length === 2) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {
        console.warn('Map fitBounds error:', e);
      }
    } else if (center && center.length === 2 && !isNaN(center[0])) {
      map.setView(center, 12);
    }
  }, [bounds, center, map]);

  return null;
}

// Custom Marker Icons using SVG
const createCustomIcon = (type) => {
  const isStart = type === 'start';
  const color = isStart ? '#10B981' : '#F43F5E';
  const label = isStart ? 'A' : 'B';

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
        font-size: 13px;
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

const startIcon = createCustomIcon('start');
const endIcon = createCustomIcon('end');

export default function MapView({ 
  source, 
  destination, 
  routes = [], 
  selectedRouteIndex = 0, 
  onSelectRoute 
}) {
  // Default center: India (Bengaluru)
  const defaultCenter = [12.9716, 77.5946];

  let center = defaultCenter;
  let bounds = null;

  if (source?.lat && destination?.lat) {
    bounds = [
      [source.lat, source.lng],
      [destination.lat, destination.lng]
    ];
  } else if (source?.lat) {
    center = [source.lat, source.lng];
  }

  return (
    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-navy-700/80 bg-navy-900 shadow-xl relative">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater bounds={bounds} center={center} />

        {/* Source Marker */}
        {source?.lat && source?.lng && (
          <Marker position={[source.lat, source.lng]} icon={startIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider block">Origin (Source)</span>
                <p className="text-slate-200 font-medium">{source.name || 'Start Point'}</p>
                <p className="text-slate-400 font-mono text-[10px]">{source.lat.toFixed(4)}, {source.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination?.lat && destination?.lng && (
          <Marker position={[destination.lat, destination.lng]} icon={endIcon}>
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-rose-400 uppercase tracking-wider block">Destination</span>
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
                opacity: isSelected ? 0.95 : 0.6,
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
                    <span className="text-slate-400 block text-[10px]">Estimated Fuel Cost</span>
                    <span className="font-bold text-amber-400">₹{route.estimatedFuelCost}</span>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 right-4 z-[400] bg-navy-900/90 backdrop-blur-md border border-navy-700/80 rounded-lg p-2.5 text-[11px] shadow-lg pointer-events-auto">
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
            <span className="text-slate-300">Origin [A]</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white ml-2"></span>
            <span className="text-slate-300">Destination [B]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
