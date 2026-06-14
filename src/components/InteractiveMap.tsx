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
  const size = isDepot ? 16 : 10;
  const svgIcon = isDepot
    ? `<svg width="${size * 2}" height="${size * 2}" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2"/><circle cx="16" cy="16" r="7" fill="${color}"/></svg>`
    : `<svg width="${size * 2}" height="${size * 2}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="1.5"/><circle cx="10" cy="10" r="4" fill="${color}"/></svg>`;
  return L.divIcon({
    html: svgIcon,
    className: "",
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
  });
};

const createTruckIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${color}88;border:2px solid ${color}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const getStatusColor = (temp: number): string => {
  if (temp <= 5) return "#22c55e";
  if (temp <= 8) return "#eab308";
  return "#ef4444";
};

const interpolate = (from: [number, number], to: [number, number], t: number): [number, number] => {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
};

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const InteractiveMap = ({ depot, cities, optimized, simulationActive, shipments }: InteractiveMapProps) => {
  const depotCoord = cityCoords[depot] || [19.076, 72.8777];
  const center: [number, number] = [19.5, 77.0];

  const routeColor = (shipment: Shipment) => getStatusColor(shipment.temp);

  return (
    <div className="card-premium p-5 h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Logistics Map</h2>
        </div>
        <div className="flex items-center gap-2">
          {simulationActive && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs px-2.5 py-1 rounded-full font-medium bg-destructive/10 text-destructive border border-destructive/20"
            >
              ● LIVE
            </motion.span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${optimized ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"}`}>
            {optimized ? "AI Optimized" : "Traditional"}
          </span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-border" style={{ height: 400 }}>
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: "100%", width: "100%", background: "hsl(222 47% 6%)" }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Depot marker */}
          <Marker position={depotCoord} icon={createIcon("hsl(187, 85%, 53%)", true)}>
            <Popup className="dark-popup">
              <div style={{ color: "#fff", background: "#1a1a2e", padding: 8, borderRadius: 8, minWidth: 150 }}>
                <strong>🏭 {depot} Depot</strong>
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Primary Distribution Hub</p>
              </div>
            </Popup>
          </Marker>

          {/* City markers */}
          {cities.map(city => {
            const coord = cityCoords[city];
            if (!coord) return null;
            return (
              <Marker key={city} position={coord} icon={createIcon("#64b5f6")}>
                <Popup>
                  <div style={{ color: "#fff", background: "#1a1a2e", padding: 8, borderRadius: 8, minWidth: 150 }}>
                    <strong>📦 {city}</strong>
                    <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Delivery Node</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Routes */}
          {shipments.map((s, i) => {
            const from = cityCoords[s.from];
            const to = cityCoords[s.to];
            if (!from || !to) return null;
            const color = routeColor(s);
            return (
              <Polyline
                key={`route-${i}`}
                positions={[from, to]}
                pathOptions={{
                  color,
                  weight: 3,
                  opacity: 0.7,
                  dashArray: optimized ? undefined : "8 6",
                }}
              />
            );
          })}

          {/* Truck markers (animated via progress) */}
          {simulationActive && shipments.map((s, i) => {
            const from = cityCoords[s.from];
            const to = cityCoords[s.to];
            if (!from || !to) return null;
            const pos = interpolate(from, to, s.progress);
            const color = getStatusColor(s.temp);
            return (
              <Marker key={`truck-${i}`} position={pos} icon={createTruckIcon(color)}>
                <Popup>
                  <div style={{ color: "#fff", background: "#1a1a2e", padding: 10, borderRadius: 8, minWidth: 180 }}>
                    <strong>🚛 {s.id}</strong>
                    <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.8 }}>
                      <div>📦 {s.product}</div>
                      <div>🌡️ Temperature: <span style={{ color }}>{s.temp}°C</span></div>
                      <div>⏱️ ETA: {s.eta}</div>
                      <div>🤖 AI Risk: <span style={{ color }}>{s.risk}%</span></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Safe (&le;5°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" /> Warning (5-8°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Risk (&gt;8°C)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Depot</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
