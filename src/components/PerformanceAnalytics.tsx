import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, Truck, Thermometer, Apple, BarChart3 } from "lucide-react";

const generateTimeData = () => {
  const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  return hours.map(h => ({
    time: h,
    spoilage: 30 + Math.random() * 25,
    efficiency: 70 + Math.random() * 20,
    compliance: 80 + Math.random() * 15,
    foodSaved: Math.floor(800 + Math.random() * 400),
  }));
};

interface Props {
  simulationActive: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-xs shadow-xl">
      <p className="text-muted-foreground font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          {p.name === "Food Saved" ? " kg" : "%"}
        </p>
      ))}
    </div>
  );
};

const PerformanceAnalytics = ({ simulationActive }: Props) => {
  const [data, setData] = useState(generateTimeData);

  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setData(prev => {
        const updated = [...prev];
        // Shift and add new point
        updated.shift();
        const now = new Date();
        updated.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          spoilage: Math.max(5, Math.min(60, (updated[updated.length - 1]?.spoilage || 30) + (Math.random() - 0.55) * 6)),
          efficiency: Math.max(60, Math.min(99, (updated[updated.length - 1]?.efficiency || 85) + (Math.random() - 0.45) * 4)),
          compliance: Math.max(70, Math.min(99, (updated[updated.length - 1]?.compliance || 90) + (Math.random() - 0.45) * 3)),
          foodSaved: Math.floor(800 + Math.random() * 600),
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [simulationActive]);

  const stats = [
    { label: "Spoilage Reduction", value: "37.2%", icon: TrendingDown, color: "text-success" },
    { label: "Delivery Efficiency", value: "92.8%", icon: Truck, color: "text-primary" },
    { label: "Temp Compliance", value: "96.4%", icon: Thermometer, color: "text-info" },
    { label: "Food Saved Today", value: "12,480 kg", icon: Apple, color: "text-warning" },
  ];

  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Performance Analytics</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">24-Hour Operational Metrics</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-lg bg-secondary/50 border border-border text-center"
          >
            <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1.5`} />
            <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-medium uppercase mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Spoilage Reduction & Efficiency</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gradSpoilage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 69%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="spoilage" name="Spoilage ↓" stroke="hsl(152, 69%, 45%)" fill="url(#gradSpoilage)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="efficiency" name="Efficiency" stroke="hsl(187, 85%, 53%)" fill="url(#gradEfficiency)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Food Saved per Period (kg)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="foodSaved" name="Food Saved" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
