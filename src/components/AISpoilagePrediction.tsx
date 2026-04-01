import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Thermometer, Droplets, Clock, Gauge } from "lucide-react";

interface Prediction {
  shipmentId: string;
  product: string;
  tempSpike: number;
  duration: number;
  humidity: number;
  refrigEfficiency: number;
  risk: number;
  recommendation: string;
}

const defaultPredictions: Prediction[] = [
  {
    shipmentId: "Dairy Batch #204",
    product: "Dairy",
    tempSpike: 7,
    duration: 20,
    humidity: 78,
    refrigEfficiency: 82,
    risk: 68,
    recommendation: "Reroute shipment to nearest cold storage facility in Pune.",
  },
  {
    shipmentId: "Vaccine Lot #117",
    product: "Vaccines",
    tempSpike: 3,
    duration: 0,
    humidity: 45,
    refrigEfficiency: 96,
    risk: 12,
    recommendation: "Shipment is within safe parameters. Continue on optimal route.",
  },
  {
    shipmentId: "Fruit Crate #892",
    product: "Fruits",
    tempSpike: 9,
    duration: 35,
    humidity: 85,
    refrigEfficiency: 71,
    risk: 84,
    recommendation: "Critical: Divert to Nashik depot immediately. Activate backup cooling.",
  },
];

const getRiskColor = (risk: number) => {
  if (risk <= 30) return { text: "text-success", bg: "bg-success", bar: "bg-success" };
  if (risk <= 60) return { text: "text-warning", bg: "bg-warning", bar: "bg-warning" };
  return { text: "text-destructive", bg: "bg-destructive", bar: "bg-destructive" };
};

interface Props {
  simulationActive: boolean;
}

const AISpoilagePrediction = ({ simulationActive }: Props) => {
  const [predictions, setPredictions] = useState(defaultPredictions);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setPredictions(prev =>
        prev.map(p => ({
          ...p,
          tempSpike: Math.max(1, p.tempSpike + (Math.random() - 0.45) * 2),
          humidity: Math.min(99, Math.max(30, p.humidity + (Math.random() - 0.5) * 5)),
          refrigEfficiency: Math.min(99, Math.max(50, p.refrigEfficiency + (Math.random() - 0.5) * 3)),
          risk: Math.min(99, Math.max(5, p.risk + (Math.random() - 0.45) * 8)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [simulationActive]);

  const selected = predictions[selectedIdx];
  const colors = getRiskColor(selected.risk);

  return (
    <div className="card-premium p-5 glow-primary relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/3 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Spoilage Prediction Engine</h2>
      </div>

      {/* Shipment tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {predictions.map((p, i) => {
          const c = getRiskColor(p.risk);
          return (
            <button
              key={p.shipmentId}
              onClick={() => setSelectedIdx(i)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
                selectedIdx === i
                  ? `${c.bg}/15 border-current ${c.text}`
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.shipmentId}
            </button>
          );
        })}
      </div>

      {/* Risk gauge */}
      <motion.div
        key={selected.shipmentId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-6">
          {/* Circular gauge */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={selected.risk <= 30 ? "hsl(var(--success))" : selected.risk <= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${selected.risk * 2.51} 251`}
                initial={{ strokeDasharray: "0 251" }}
                animate={{ strokeDasharray: `${selected.risk * 2.51} 251` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${colors.text}`}>{Math.round(selected.risk)}%</span>
              <span className="text-[10px] text-muted-foreground">RISK</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="text-sm font-medium text-foreground">{selected.shipmentId}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Thermometer className="w-3.5 h-3.5 text-cold" />
                Spike: <span className="text-foreground">{selected.tempSpike.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-info" />
                Duration: <span className="text-foreground">{selected.duration}min</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Droplets className="w-3.5 h-3.5 text-primary" />
                Humidity: <span className="text-foreground">{selected.humidity.toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gauge className="w-3.5 h-3.5 text-success" />
                Cooling: <span className="text-foreground">{selected.refrigEfficiency.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk bar */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Low Risk</span><span>High Risk</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colors.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${selected.risk}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        {/* AI Recommendation */}
        <div className={`flex items-start gap-2 p-3 rounded-lg border ${
          selected.risk > 60 ? "bg-destructive/5 border-destructive/20" : selected.risk > 30 ? "bg-warning/5 border-warning/20" : "bg-success/5 border-success/20"
        }`}>
          <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
          <div>
            <span className={`text-xs font-semibold ${colors.text}`}>AI Recommendation</span>
            <p className="text-xs text-muted-foreground mt-0.5">{selected.recommendation}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AISpoilagePrediction;
