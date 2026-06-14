import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export interface Shipment {
  id: string;
  from: string;
  to: string;
  temp: number;
  eta: string;
  risk: number;
  progress: number;
  product: string;
}

interface FleetListProps {
  shipments: Shipment[];
  simulationActive: boolean;
}

const TempGauge = ({ temp }: { temp: number }) => {
  const clampedTemp = Math.max(0, Math.min(12, temp));
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedTemp / 12) * circumference;

  let color = "#10B981"; // 0-5°C (Emerald green)
  if (temp > 5 && temp <= 8) color = "#F59E0B"; // 5-8°C (Warning amber)
  if (temp > 8) color = "#EF4444"; // 8°C+ (Danger red)

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          opacity="0.3"
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-foreground leading-none">{temp}°C</span>
    </div>
  );
};

export default function FleetList({ shipments, simulationActive }: FleetListProps) {
  const getStatusColor = (temp: number) => {
    if (temp <= 5) return "bg-[#10B981]";
    if (temp <= 8) return "bg-[#F59E0B]";
    return "bg-[#EF4444]";
  };

  return (
    <div className="card-premium p-5 space-y-4 flex flex-col h-full" style={{ border: '1px solid #374151' }}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Active Fleet Telemetry</h2>
        </div>
        <span className="text-[10px] bg-secondary px-2.5 py-0.5 rounded-full text-muted-foreground font-semibold">
          {shipments.length} Vehicles
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
        {shipments.map((shipment) => {
          const isAnomaly = shipment.temp > 8 || shipment.risk > 40;
          return (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 rounded-lg bg-[#1F2937]/45 border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded bg-secondary/80 border border-border/80 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <Truck className="w-4 h-4" />
                  {isAnomaly && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-[#111827] animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">{shipment.id}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(shipment.temp)}`} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {shipment.from} &rarr; {shipment.to}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TempGauge temp={shipment.temp} />
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">ETA</div>
                  <div className="text-xs font-bold text-foreground">{shipment.eta}</div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {shipments.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No active shipments in the fleet. Start the simulation.
          </div>
        )}
      </div>
    </div>
  );
}
