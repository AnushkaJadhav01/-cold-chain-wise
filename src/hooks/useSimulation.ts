import { useState, useEffect, useCallback } from "react";

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

const initialShipments: Shipment[] = [
  { id: "SH-001", from: "Nashik", to: "Mumbai", temp: 4, eta: "2h 15m", risk: 12, progress: 0, product: "Dairy" },
  { id: "SH-002", from: "Pune", to: "Bangalore", temp: 3, eta: "8h 30m", risk: 8, progress: 0, product: "Vaccines" },
  { id: "SH-003", from: "Nagpur", to: "Hyderabad", temp: 5, eta: "6h 00m", risk: 22, progress: 0, product: "Fruits" },
  { id: "SH-004", from: "Mumbai", to: "Pune", temp: 6, eta: "3h 45m", risk: 35, progress: 0, product: "Pharmaceuticals" },
  { id: "SH-005", from: "Hyderabad", to: "Bangalore", temp: 4, eta: "7h 20m", risk: 15, progress: 0, product: "Dairy" },
];

export const useSimulation = () => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);

  const toggleSimulation = useCallback(() => {
    setSimulationActive(prev => {
      if (prev) {
        // Reset on stop
        setShipments(initialShipments);
      }
      return !prev;
    });
  }, []);

  const toggleDemo = useCallback(() => {
    setDemoMode(prev => {
      const next = !prev;
      if (next && !simulationActive) {
        setSimulationActive(true);
      }
      return next;
    });
  }, [simulationActive]);

  // Animate shipments
  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setShipments(prev =>
        prev.map(s => {
          const newProgress = s.progress >= 1 ? 0 : s.progress + 0.02 + Math.random() * 0.01;
          const tempFlux = (Math.random() - 0.4) * 1.5;
          const newTemp = Math.max(1, Math.min(12, s.temp + tempFlux));
          const newRisk = Math.max(3, Math.min(95, s.risk + (newTemp > 6 ? 3 : -1) + (Math.random() - 0.5) * 5));
          const hours = Math.max(0, 8 - newProgress * 8);
          const mins = Math.floor((hours % 1) * 60);
          return {
            ...s,
            progress: newProgress,
            temp: parseFloat(newTemp.toFixed(1)),
            risk: Math.round(newRisk),
            eta: `${Math.floor(hours)}h ${mins}m`,
          };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, [simulationActive]);

  return { simulationActive, demoMode, shipments, toggleSimulation, toggleDemo };
};
