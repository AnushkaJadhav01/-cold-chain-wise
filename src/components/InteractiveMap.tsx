import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Truck } from "lucide-react";

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
      html: `<div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center">
        <div style="width:30px;height:30px;border-radius:50%;background:#E8912A;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
      </div>`,
      className: "",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }
  return L.divIcon({
    html: `<div style="width:12px;height:12px;border-radius:50%;background:#FFFFFF;border:2px solid #CBD5E1;box-shadow:0 1px 2px rgba(0,0,0,0.1)"></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

const createTruckIcon = (color: string, isAlert = false) => {
  const alertRing = isAlert 
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid #D94F3D;animation:ping 1.5s ease-out infinite"></div>` 
    : '';

  return L.divIcon({
    html: `<div style="position:relative;width:34px;height:34px;display:flex;align-items:center;justify-content:center">
      ${alertRing}
      <div style="width:34px;height:34px;border-radius:50%;background:#1B2E6B;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);z-index:2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      </div>
    </div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

const getStatusColor = (temp: number): string => {
  if (temp <= 5) return "#00A878"; // teal
  if (temp <= 8) return "#F5A623"; // amber
  return "#D94F3D"; // red
};

const interpolate = (from: [number, number], to: [number, number], t: number): [number, number] => {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
};

const InteractiveMap = ({ depot, cities, optimized, simulationActive, shipments }: InteractiveMapProps) => {
  const depotCoord = cityCoords[depot] || [19.076, 72.8777];
  const center: [number, number] = [20.5937, 78.9629];
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

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
    <div className="h-full w-full relative flex flex-col bg-white">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%", background: "#F4F6FA", zIndex: 0 }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Depot marker */}
        <Marker position={depotCoord} icon={createIcon("#E8912A", true)}>
          <Popup>
            <div className="p-1 text-xs text-[#1A1A2E] min-w-[120px]">
              <strong className="block text-[13px] mb-1">Hub: {depot}</strong>
              <span className="text-[#5A6680]">Primary Distribution Center</span>
            </div>
          </Popup>
        </Marker>

        {/* City markers */}
        {cities.map(city => {
          const coord = cityCoords[city];
          if (!coord) return null;
          return (
            <Marker key={city} position={coord} icon={createIcon("#CBD5E1")}>
              <Popup>
                <div className="p-1 text-xs text-[#1A1A2E] min-w-[100px]">
                  <strong className="block text-[13px] mb-1">{city}</strong>
                  <span className="text-[#5A6680]">Delivery Node</span>
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
          return (
            <div key={`route-group-${i}`}>
              <Polyline
                positions={[from, to]}
                pathOptions={{
                  color: '#00B4D8',
                  weight: 3,
                  opacity: 0.8,
                  dashArray: '10 5',
                  className: simulationActive ? "animate-route-flow" : ""
                }}
              />
            </div>
          );
        })}

        {/* Truck markers */}
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

      {/* Map Legend Overlay in bottom-left corner */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white border border-[#CBD5E1] p-3 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-[12px] text-[#1A1A2E] space-y-2 min-w-[140px]">
        <div className="font-[600] text-[#1B2E6B] border-b border-[#CBD5E1] pb-1.5 mb-1.5">Map Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A878]" />
          <span>On-time</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D94F3D]" />
          <span>Alert</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#E8912A] text-[14px]">★</span>
          <span>Depot</span>
        </div>
      </div>

      {/* Floating Info Card on Marker Click - Slide in from right */}
      {selectedShipment && (
        <div className="absolute top-4 right-4 z-[400] bg-white border border-[#CBD5E1] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-72 transform transition-transform duration-300">
          <div className="flex items-center justify-between mb-3 border-b border-[#CBD5E1] pb-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1B2E6B]" />
              <span className="font-[700] text-[14px] text-[#1B2E6B]">{selectedShipment.id}</span>
            </div>
            <button 
              onClick={() => setSelectedShipment(null)} 
              className="text-[#5A6680] hover:text-[#1A1A2E] p-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#5A6680]">Cargo:</span>
              <span className="text-[#1A1A2E] font-[600]">{selectedShipment.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6680]">Route:</span>
              <span className="text-[#1A1A2E] font-[600]">{selectedShipment.from} &rarr; {selectedShipment.to}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A6680]">Temperature:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-[700]" style={{ 
                color: getStatusColor(selectedShipment.temp),
                backgroundColor: `${getStatusColor(selectedShipment.temp)}15` 
              }}>
                {selectedShipment.temp}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6680]">ETA:</span>
              <span className="text-[#1A1A2E] font-[600]">{selectedShipment.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A6680]">Risk Level:</span>
              <span className={`font-[600] ${selectedShipment.risk > 40 ? 'text-[#D94F3D]' : 'text-[#00A878]'}`}>{selectedShipment.risk}%</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-[#E8EDF5]">
              <div className="flex justify-between text-[11px] text-[#5A6680]">
                <span>Progress</span>
                <span>{Math.round(selectedShipment.progress * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#E8EDF5] overflow-hidden">
                <div className="h-full bg-[#00B4D8]" style={{ width: `${selectedShipment.progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind arbitrary CSS for route animation */}
      <style>{`
        .animate-route-flow {
          animation: routeFlow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
