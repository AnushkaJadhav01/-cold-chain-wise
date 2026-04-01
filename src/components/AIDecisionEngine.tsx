import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Thermometer, Clock, Shield, AlertTriangle, TrendingUp, Zap, Activity } from "lucide-react";

interface Decision {
  shipmentId: string;
  product: string;
  tempSpike: { value: number; duration: number };
  transitDelay: number;
  spoilageRisk: number;
  recommendation: string;
  action: "reroute" | "continue" | "emergency";
  confidence: number;
}

const defaultDecisions: Decision[] = [
  {
    shipmentId: "Dairy Batch #204",
    product: "Dairy",
    tempSpike: { value: 7, duration: 20 },
    transitDelay: 12,
    spoilageRisk: 68,
    recommendation: "Reroute shipment to nearest cold storage facility in Pune.",
    action: "reroute",
    confidence: 94,
  },
  {
    shipmentId: "Vaccine Lot #117",
    product: "Vaccines",
    tempSpike: { value: 3, duration: 0 },
    transitDelay: 0,
    spoilageRisk: 8,
    recommendation: "Shipment within safe parameters. Continue optimal route via NH-48.",
    action: "continue",
    confidence: 98,
  },
  {
    shipmentId: "Fruit Crate #892",
    product: "Fruits",
    tempSpike: { value: 9, duration: 35 },
    transitDelay: 45,
    spoilageRisk: 84,
    recommendation: "Critical: Divert to Nashik depot. Activate backup cooling unit immediately.",
    action: "emergency",
    confidence: 91,
  },
];

const actionStyles = {
  reroute: { bg: "bg-warning/8", border: "border-warning/25", text: "text-warning", label: "REROUTE" },
  continue: { bg: "bg-success/8", border: "border-success/25", text: "text-success", label: "CONTINUE" },
  emergency: { bg: "bg-destructive/8", border: "border-destructive/25", text: "text-destructive", label: "EMERGENCY" },
};

interface Props {
  simulationActive: boolean;
}

const AIDecisionEngine = ({ simulationActive }: Props) => {
  const [decisions, setDecisions] = useState(defaultDecisions);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setDecisions(prev =>
        prev.map(d => ({
          ...d,
          tempSpike: {
            value: Math.max(1, Math.min(12, d.tempSpike.value + (Math.random() - 0.45) * 1.5)),
            duration: Math.max(0, d.tempSpike.duration + Math.floor((Math.random() - 0.4) * 5)),
          },
          transitDelay: Math.max(0, Math.min(120, d.transitDelay + Math.floor((Math.random() - 0.4) * 8))),
          spoilageRisk: Math.max(3, Math.min(99, d.spoilageRisk + (Math.random() - 0.45) * 6)),
          confidence: Math.max(80, Math.min(99, d.confidence + (Math.random() - 0.5) * 2)),
        }))
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [simulationActive]);

  // Auto-cycle in simulation
  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % decisions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [simulationActive, decisions.length]);

  const active = decisions[activeIdx];
  const style = actionStyles[active.action];
  const riskColor = active.spoilageRisk > 60 ? "destructive" : active.spoilageRisk > 30 ? "warning" : "success";

  return (
    <div className="card-premium p-6 glow-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={simulationActive ? { rotate: [0, 360] } : {}}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI Decision Engine</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Real-Time Intelligent Analysis</p>
            </div>
          </div>
          {simulationActive && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Activity className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">PROCESSING</span>
            </motion.div>
          )}
        </div>

        {/* Shipment Selector */}
        <div className="flex gap-2 mb-5">
          {decisions.map((d, i) => {
            const rc = d.spoilageRisk > 60 ? "destructive" : d.spoilageRisk > 30 ? "warning" : "success";
            return (
              <button
                key={d.shipmentId}
                onClick={() => setActiveIdx(i)}
                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeIdx === i
                    ? `bg-${rc}/10 border-${rc}/30 text-${rc}`
                    : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                }`}
              >
                <div className="truncate">{d.shipmentId}</div>
                <div className={`text-[10px] mt-0.5 font-bold text-${rc}`}>{Math.round(d.spoilageRisk)}% risk</div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main Risk Display */}
            <div className="flex gap-5 mb-5">
              {/* Gauge */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  {/* Background track */}
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="10" strokeDasharray="235.6 78.5" strokeDashoffset="-39.3" strokeLinecap="round" />
                  {/* Risk arc */}
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={`hsl(var(--${riskColor}))`}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${active.spoilageRisk * 2.356} ${314 - active.spoilageRisk * 2.356}`}
                    strokeDashoffset="-39.3"
                    initial={{ strokeDasharray: "0 314" }}
                    animate={{ strokeDasharray: `${active.spoilageRisk * 2.356} ${314 - active.spoilageRisk * 2.356}` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  {/* Glow filter */}
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    key={active.spoilageRisk}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-3xl font-extrabold text-${riskColor}`}
                  >
                    {Math.round(active.spoilageRisk)}%
                  </motion.span>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Spoilage Risk</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Temp Spike</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">{active.tempSpike.value.toFixed(1)}°C</div>
                  <div className="text-[10px] text-muted-foreground">for {active.tempSpike.duration} min</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-warning" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Transit Delay</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">{active.transitDelay} min</div>
                  <div className="text-[10px] text-muted-foreground">{active.transitDelay > 30 ? "Behind schedule" : "On track"}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">AI Confidence</span>
                  </div>
                  <div className="text-sm font-bold text-primary">{active.confidence.toFixed(1)}%</div>
                  <div className="text-[10px] text-muted-foreground">Model certainty</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-success" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">Action</span>
                  </div>
                  <div className={`text-sm font-bold ${style.text}`}>{style.label}</div>
                  <div className="text-[10px] text-muted-foreground">Recommended</div>
                </div>
              </div>
            </div>

            {/* Risk Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
                <span>LOW RISK</span>
                <span>MODERATE</span>
                <span>HIGH RISK</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden relative">
                <motion.div
                  className={`h-full rounded-full bg-${riskColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${active.spoilageRisk}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ boxShadow: `0 0 12px hsl(var(--${riskColor}) / 0.4)` }}
                />
              </div>
            </div>

            {/* AI Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {active.action === "emergency" ? (
                    <AlertTriangle className={`w-4 h-4 ${style.text}`} />
                  ) : active.action === "reroute" ? (
                    <Zap className={`w-4 h-4 ${style.text}`} />
                  ) : (
                    <Shield className={`w-4 h-4 ${style.text}`} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${style.text}`}>AI Recommendation</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${style.bg} ${style.text} font-bold border ${style.border}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Shipment: {active.shipmentId}</strong>
                    <br />
                    Temperature Spike: {active.tempSpike.value.toFixed(1)}°C for {active.tempSpike.duration} minutes
                    <br />
                    AI Spoilage Risk: <span className={`font-bold text-${riskColor}`}>{Math.round(active.spoilageRisk)}%</span>
                    <br />
                    <span className="text-foreground/80">{active.recommendation}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIDecisionEngine;
