import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Thermometer, Clock, Gauge, Shield } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, remove, serverTimestamp, query, limitToLast } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Alert {
  id: string;
  type: "temperature" | "delay" | "refrigeration" | "security";
  severity: "critical" | "warning" | "info";
  message: string;
  location: string;
  timestamp: string;
  created_at: number;
}

const alertTemplates = [
  { type: "temperature" as const, severity: "critical" as const, message: "Temperature exceeded 8°C threshold", locations: ["Mumbai Hub", "Nashik Depot", "Pune Transit"] },
  { type: "temperature" as const, severity: "warning" as const, message: "Temperature approaching upper limit (6.5°C)", locations: ["Nagpur Route", "Hyderabad Hub"] },
  { type: "delay" as const, severity: "warning" as const, message: "Transit delay detected — 45min behind schedule", locations: ["Mumbai-Pune Corridor", "NH-48 Junction"] },
  { type: "delay" as const, severity: "critical" as const, message: "Critical delay: 2+ hours. Re-routing required", locations: ["Nagpur-Hyderabad Route"] },
  { type: "refrigeration" as const, severity: "warning" as const, message: "Refrigeration efficiency dropped to 72%", locations: ["Truck MH-04-AB-1234", "Truck MH-12-CD-5678"] },
  { type: "refrigeration" as const, severity: "critical" as const, message: "Refrigeration unit malfunction detected", locations: ["Truck KA-01-EF-9012"] },
  { type: "security" as const, severity: "info" as const, message: "Shipment checkpoint verified successfully", locations: ["Pune Gateway", "Nashik Toll Plaza"] },
];

const iconMap = {
  temperature: Thermometer,
  delay: Clock,
  refrigeration: Gauge,
  security: Shield,
};

const severityStyles = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-warning/30 bg-warning/5",
  info: "border-info/30 bg-info/5",
};

const severityDot = {
  critical: "bg-destructive",
  warning: "bg-warning",
  info: "bg-info",
};

interface Props {
  simulationActive: boolean;
}

const RealTimeAlertFeed = ({ simulationActive }: Props) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Push a new alert to Firebase
  const addAlert = useCallback(async () => {
    if (!user || !simulationActive) return;

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const location = template.locations[Math.floor(Math.random() * template.locations.length)];
    const now = new Date();
    const timestamp = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const alertsRef = ref(db, `alerts/${user.uid}`);
      await push(alertsRef, {
        type: template.type,
        severity: template.severity,
        message: template.message,
        location,
        timestamp,
        created_at: serverTimestamp(),
      });
    } catch (e) {
      console.error("Failed to push alert", e);
    }
  }, [user, simulationActive]);

  // Listen for alerts from Firebase
  useEffect(() => {
    if (!user) return;

    const alertsRef = query(ref(db, `alerts/${user.uid}`), limitToLast(10));
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedAlerts: Alert[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        })).sort((a, b) => b.created_at - a.created_at);
        setAlerts(loadedAlerts);
      } else {
        setAlerts([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Handle simulation logic
  useEffect(() => {
    if (!simulationActive) return;
    
    // Clear old alerts when starting new simulation? 
    // Or just keep them. For now, let's keep them and add new ones.
    
    const interval = setInterval(addAlert, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [simulationActive, addAlert]);

  return (
    <div className="card-premium p-5 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-warning/3 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-semibold text-foreground">Real-Time Alert Feed</h2>
        </div>
        {alerts.length > 0 && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-medium"
          >
            {alerts.filter(a => a.severity === "critical").length} Critical
          </motion.span>
        )}
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
        <AnimatePresence initial={false}>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              {simulationActive ? "Waiting for alerts..." : "Start simulation to see live alerts"}
            </div>
          ) : (
            alerts.map(alert => {
              const Icon = iconMap[alert.type];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 30, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -30, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border rounded-lg p-3 ${severityStyles[alert.severity]}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severityDot[alert.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground truncate">{alert.message}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-muted-foreground">📍 {alert.location}</span>
                        <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RealTimeAlertFeed;

