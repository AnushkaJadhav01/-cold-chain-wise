import { useState, useEffect } from "react";
import { Thermometer, Truck, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

interface TruckData {
  id: string;
  name: string;
  temp: number;
  route: string;
  product: string;
  status: "safe" | "warning" | "critical";
}

const generateTrucks = (): TruckData[] => [
  {
    id: "TRK-001",
    name: "Truck 1",
    temp: 3 + Math.random() * 2,
    route: "Nashik → Mumbai",
    product: "Dairy",
    status: "safe",
  },
  {
    id: "TRK-002",
    name: "Truck 2",
    temp: 7 + Math.random() * 4,
    route: "Pune → Bangalore",
    product: "Fruits",
    status: "warning",
  },
  {
    id: "TRK-003",
    name: "Truck 3",
    temp: 4 + Math.random() * 2,
    route: "Nagpur → Hyderabad",
    product: "Vaccines",
    status: "safe",
  },
  {
    id: "TRK-004",
    name: "Truck 4",
    temp: 2 + Math.random() * 3,
    route: "Nashik → Pune",
    product: "Pharmaceuticals",
    status: "safe",
  },
];

const getStatus = (temp: number): "safe" | "warning" | "critical" => {
  if (temp > 8) return "critical";
  if (temp > 6) return "warning";
  return "safe";
};

const statusStyles = {
  safe: { bg: "bg-success/10", border: "border-success/20", text: "text-success", icon: CheckCircle2 },
  warning: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning", icon: AlertTriangle },
  critical: { bg: "bg-destructive/10", border: "border-destructive/20", text: "text-destructive", icon: AlertTriangle },
};

const ColdChainMonitoring = () => {
  const [trucks, setTrucks] = useState<TruckData[]>(generateTrucks());

  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks((prev) =>
        prev.map((t) => {
          const newTemp = Math.max(1, Math.min(12, t.temp + (Math.random() - 0.48) * 1.5));
          return { ...t, temp: newTemp, status: getStatus(newTemp) };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const alertCount = trucks.filter((t) => t.status !== "safe").length;

  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-cold" />
          <h2 className="text-lg font-semibold text-foreground">Cold Chain Monitoring</h2>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
          {alertCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning font-medium">
              {alertCount} Alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {trucks.map((truck) => {
          const style = statusStyles[truck.status];
          const StatusIcon = style.icon;
          return (
            <div
              key={truck.id}
              className={`flex items-center justify-between p-3.5 rounded-lg border ${style.border} ${style.bg} transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary/80 border border-border flex items-center justify-center">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{truck.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{truck.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {truck.route} • {truck.product}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-lg font-bold font-mono ${style.text}`}>{truck.temp.toFixed(1)}°C</p>
                  <p className={`text-xs font-medium capitalize ${style.text}`}>{truck.status}</p>
                </div>
                <StatusIcon className={`w-5 h-5 ${style.text}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColdChainMonitoring;
