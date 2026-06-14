import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Truck } from "lucide-react";

const cityCoords: Record<string, [number, number]> = {
  Mumbai: [19.076, 72.8777],
  Nashik: [19.9975, 73.7898],
  Pune: [18.5204, 73.8567],
  Nagpur: [21.1458, 79.0882],
  Hyderabad: [17.385, 78.4867],
  Ahmedabad: [23.0225, 72.5714],
  Bangalore: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Delhi: [28.7041, 77.1025],
  Jaipur: [26.9124, 75.7873],
  Indore: [22.7196, 75.8577],
  Vizag: [17.6868, 83.2185],
  Surat: [21.1702, 72.8311],
  Lucknow: [26.8467, 80.9462],
  Bhopal: [23.2599, 77.4126],
};

interface Shipment {
  id: string;
  from: string;
  to: string;
  temp: number;
  eta: string;
  risk: number;
  progress: number;
  product: string;
}

interface InteractiveMapProps {
  depot: string;
  cities: string[];
  optimized: boolean;
  simulationActive: boolean;
  shipments: Shipment[];
}

const createIcon = (color: string, isDepot = false) => {
  if (isDepot) {
    return L.divIcon({
      html: `<div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;inset:0;border-radius:50%;background:#8B5CF6;opacity:0.15;animation:marker-ping 2s ease-out infinite"></div>
        <div style="width:18px;height:18px;border-radius:50%;background:#8B5CF6;border:2px solid #0B1629;box-shadow:0 0 12px #8B5CF6;display:flex;align-items:center;justify-content:center">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0B1629;box-shadow:0 0 8px ${color}88"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const createTruckIcon = (color: string, isAlert = false) => {
  const alertDot = isAlert 
    ? `<div style="position:absolute;top:0;right:0;width:10px;height:10px;border-radius:50%;background:#EF4444;border:1.5px solid #1F2937;box-shadow:0 0 6px #EF4444;"></div>` 
    : '';
  const pingAnim = isAlert 
    ? `animation: alert-ping 1.5s ease-out infinite; border: 2.5px solid #EF4444;` 
    : `animation: marker-ping 2s ease-out infinite; border: 2px solid ${color};`;

  return L.divIcon({
    html: `<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;border-radius:50%;opacity:0.6;${pingAnim}"></div>
      <div style="width:30px;height:30px;border-radius:50%;background:#3B82F6;display:flex;align-items:center;justify-content:center;border:2px solid ${color};box-shadow:0 0 10px ${color}55">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      </div>
      ${alertDot}
    </div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const getStatusColor = (temp: number): string => {
  if (temp <= 5) return "#10B981"; // green
  if (temp <= 8) return "#F59E0B"; // amber
  return "#EF4444"; // red
};

const interpolate = (from: [number, number], to: [number, number], t: number): [number, number] => {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
};

const InteractiveMap = ({ depot, cities, optimized, simulationActive, shipments }: InteractiveMapProps) => {
  const depotCoord = cityCoords[depot] || [19.076, 72.8777];
  const center: [number, number] = [20.5937, 78.9629];
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Clear or update selection if simulation resets or shipments change
  useEffect(() => {
    if (selectedShipment) {
      const activeShipment = shipments.find(s => s.id === selectedShipment.id);
      if (activeShipment) {
        setSelectedShipment(activeShipment);
      } else {
        setSelectedShipment(null);
      }
    }
  }, [shipments]);

  return (
    <div className="card-premium p-5 h-full relative overflow-hidden flex flex-col" style={{ border: '1px solid #374151' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground tracking-tight">AI Logistics Map</h2>
        </div>
        <div className="flex items-center gap-2">
          {simulationActive && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
          <span className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
            optimized 
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            {optimized ? "AI Optimized" : "Traditional"}
          </span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border relative flex-1" style={{ minHeight: 550 }}>
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "100%", width: "100%", background: "#111827" }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <style>{`
            @keyframes marker-ping {
              0% { transform: scale(1); opacity: 0.8; }
              100% { transform: scale(2.8); opacity: 0; }
            }
            .dark-popup .leaflet-popup-content-wrapper {
              background: #1F2937 !important;
              border: 1px solid #374151 !important;
              color: #F9FAFB !important;
            }
            .route-flow-animation {
              animation: dash-flow 2s linear infinite;
            }
            @keyframes dash-flow {
              from { stroke-dashoffset: 300; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* Depot marker */}
          <Marker position={depotCoord} icon={createIcon("#3B82F6", true)}>
            <Popup className="dark-popup">
              <div className="p-2 text-xs text-foreground min-w-[140px]">
                <strong className="block text-sm mb-1">Hub: {depot}</strong>
                <span className="text-muted-foreground">Primary Distribution Center</span>
              </div>
            </Popup>
          </Marker>

          {/* City markers */}
          {cities.map(city => {
            const coord = cityCoords[city];
            if (!coord) return null;
            return (
              <Marker key={city} position={coord} icon={createIcon("#9CA3AF")}>
                <Popup className="dark-popup">
                  <div className="p-2 text-xs text-foreground min-w-[120px]">
                    <strong className="block text-sm mb-1">{city}</strong>
                    <span className="text-muted-foreground">Delivery Node</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Routes — animated cyan glow */}
          {shipments.map((s, i) => {
            const from = cityCoords[s.from];
            const to = cityCoords[s.to];
            if (!from || !to) return null;
            return (
              <div key={`route-group-${i}`}>
                {/* Glow underlay */}
                <Polyline
                  positions={[from, to]}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 6,
                    opacity: 0.15,
                  }}
                />
                {/* Main route line */}
                <Polyline
                  positions={[from, to]}
                  className="route-flow-animation"
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '8, 4',
                  }}
                />
              </div>
            );
          })}

          {/* Truck markers (animated via progress) */}
          {simulationActive && shipments.map((s, i) => {
            const from = cityCoords[s.from];
            const to = cityCoords[s.to];
            if (!from || !to) return null;
            const pos = interpolate(from, to, s.progress);
            const color = getStatusColor(s.temp);
            const isAlert = s.temp > 8 || s.risk > 40;
            return (
              <Marker 
                key={`truck-${i}`} 
                position={pos} 
                icon={createTruckIcon(color, isAlert)}
                eventHandlers={{
                  click: () => {
                    setSelectedShipment(s);
                  }
                }}
              />
            );
          })}
        </MapContainer>

        {/* Map Legend Overlay in top-right corner */}
        <div className="absolute top-4 right-4 z-[1000] bg-card/90 border border-border p-2.5 rounded-lg shadow-lg backdrop-blur-sm text-[11px] text-muted-foreground space-y-1.5 min-w-[120px]">
          <div className="font-semibold text-foreground border-b border-border/60 pb-1 mb-1">Status Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span>Depot Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Optimal (&le;5°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Warning (5-8°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span>Anomaly (&gt;8°C)</span>
          </div>
        </div>

        {/* Floating Info Card on Marker Click */}
        {selectedShipment && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 border border-border p-4 rounded-xl shadow-xl w-64 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-foreground">{selectedShipment.id}</span>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)} 
                className="text-xs text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cargo Type:</span>
                <span className="text-foreground font-semibold">{selectedShipment.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route:</span>
                <span className="text-foreground font-semibold">{selectedShipment.from} &rarr; {selectedShipment.to}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Telemetry Temp:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ 
                  color: getStatusColor(selectedShipment.temp),
                  backgroundColor: `${getStatusColor(selectedShipment.temp)}15` 
                }}>
                  {selectedShipment.temp}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ETA:</span>
                <span className="text-foreground font-semibold">{selectedShipment.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spoilage Risk:</span>
                <span className={`font-semibold ${selectedShipment.risk > 40 ? 'text-destructive' : 'text-foreground'}`}>{selectedShipment.risk}%</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Route Progress</span>
                  <span>{Math.round(selectedShipment.progress * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary/80 overflow-hidden border border-border/30">
                  <div className="h-full bg-primary" style={{ width: `${selectedShipment.progress * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success inline-block" /> Safe (&le;5°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning inline-block" /> Warning (5-8°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Risk (&gt;8°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Depot</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
