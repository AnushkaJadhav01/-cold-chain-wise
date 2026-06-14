import { useState, useEffect, useRef, useCallback } from 'react';

export type TruckStatus = 'nominal' | 'warning' | 'critical';

export interface TruckTelemetry {
  id: string;
  tempC: number;
  riskScore: number;   // 0-100
  etaMins: number;
  routeId: string;
  status: TruckStatus;
  lastSync: number;    // timestamp ms
  product: string;
  city: string;
  destination: string;
  progress: number;    // 0-1 along route
  deviation: number;   // km off optimal route
}

export interface RouteData {
  routeId: string;
  riskLevel: 'safe' | 'elevated' | 'critical';
  from: string;
  to: string;
}

export interface FleetKPIs {
  activeFleet: number;
  totalFleet: number;
  avgRiskPercent: number;
  efficiencyGain: number;
  activeAlerts: number;
  syncAgoSecs: number;
}

// ---------------------------------------------------------------------------
// Mock route definitions (bezier control points on the SVG map, viewBox 500×580)
// ---------------------------------------------------------------------------
export const ROUTES: RouteData[] = [
  { routeId: 'R1', riskLevel: 'safe',     from: 'Delhi',     to: 'Mumbai'    },
  { routeId: 'R2', riskLevel: 'safe',     from: 'Mumbai',    to: 'Bangalore' },
  { routeId: 'R3', riskLevel: 'elevated', from: 'Nagpur',    to: 'Hyderabad' },
  { routeId: 'R4', riskLevel: 'critical', from: 'Mumbai',    to: 'Pune'      },
  { routeId: 'R5', riskLevel: 'safe',     from: 'Hyderabad', to: 'Chennai'   },
  { routeId: 'R6', riskLevel: 'elevated', from: 'Delhi',     to: 'Kolkata'   },
];

const INITIAL_TRUCKS: TruckTelemetry[] = [
  { id: 'TK-001', tempC: 4.2,  riskScore: 8,  etaMins: 142, routeId: 'R1', status: 'nominal',  lastSync: Date.now(), product: 'Vaccines',        city: 'Delhi',     destination: 'Mumbai',    progress: 0.22, deviation: 0.4  },
  { id: 'TK-002', tempC: 3.1,  riskScore: 5,  etaMins: 87,  routeId: 'R2', status: 'nominal',  lastSync: Date.now(), product: 'Dairy',           city: 'Mumbai',    destination: 'Bangalore', progress: 0.41, deviation: 0    },
  { id: 'TK-003', tempC: 6.8,  riskScore: 34, etaMins: 203, routeId: 'R3', status: 'warning',  lastSync: Date.now(), product: 'Fruits',          city: 'Nagpur',    destination: 'Hyderabad', progress: 0.18, deviation: 2.1  },
  { id: 'TK-004', tempC: 7.9,  riskScore: 61, etaMins: 38,  routeId: 'R4', status: 'critical', lastSync: Date.now(), product: 'Pharmaceuticals', city: 'Mumbai',    destination: 'Pune',      progress: 0.73, deviation: 4.8  },
  { id: 'TK-005', tempC: 3.9,  riskScore: 12, etaMins: 165, routeId: 'R5', status: 'nominal',  lastSync: Date.now(), product: 'Seafood',         city: 'Hyderabad', destination: 'Chennai',   progress: 0.35, deviation: 0.2  },
  { id: 'TK-006', tempC: 4.5,  riskScore: 9,  etaMins: 110, routeId: 'R6', status: 'nominal',  lastSync: Date.now(), product: 'Blood Products',  city: 'Delhi',     destination: 'Kolkata',   progress: 0.58, deviation: 0    },
  { id: 'TK-007', tempC: 5.1,  riskScore: 18, etaMins: 92,  routeId: 'R2', status: 'nominal',  lastSync: Date.now(), product: 'Biologics',       city: 'Mumbai',    destination: 'Bangalore', progress: 0.65, deviation: 1.0  },
  { id: 'TK-008', tempC: 8.3,  riskScore: 72, etaMins: 22,  routeId: 'R4', status: 'critical', lastSync: Date.now(), product: 'Insulin',         city: 'Mumbai',    destination: 'Pune',      progress: 0.91, deviation: 6.1  },
];

export function useFleetTelemetry(pollMs = 3000) {
  const [trucks, setTrucks] = useState<TruckTelemetry[]>(INITIAL_TRUCKS);
  const [kpis, setKpis] = useState<FleetKPIs>({
    activeFleet: 1248,
    totalFleet: 1300,
    avgRiskPercent: 1.2,
    efficiencyGain: 18.4,
    activeAlerts: 3,
    syncAgoSecs: 0,
  });
  const lastSyncRef = useRef(Date.now());

  const tick = useCallback(() => {
    const now = Date.now();
    setTrucks(prev =>
      prev.map(truck => {
        const tempDrift    = (Math.random() - 0.45) * 0.5;
        const newTemp      = Math.max(1.2, Math.min(10.5, truck.tempC + tempDrift));
        const riskDrift    = (Math.random() - 0.5) * 6;
        const newRisk      = Math.max(2, Math.min(98, truck.riskScore + riskDrift));
        const newStatus: TruckStatus =
          newRisk > 50 ? 'critical' : newRisk > 25 ? 'warning' : 'nominal';
        const newProgress  = truck.progress >= 0.99 ? 0.03 : truck.progress + 0.006;
        const newETA       = Math.max(4, Math.floor((1 - newProgress) * 210));
        const devDrift     = (Math.random() - 0.5) * 0.3;
        const newDev       = Math.max(0, truck.deviation + devDrift);
        return {
          ...truck,
          tempC:     Math.round(newTemp * 10) / 10,
          riskScore: Math.round(newRisk),
          status:    newStatus,
          lastSync:  now,
          progress:  newProgress,
          etaMins:   newETA,
          deviation: Math.round(newDev * 10) / 10,
        };
      }),
    );

    setKpis(prev => {
      const alerts = trucks.filter(t => t.status !== 'nominal').length;
      return {
        ...prev,
        activeFleet:    Math.max(1200, Math.min(1300, prev.activeFleet + Math.floor((Math.random() - 0.5) * 4))),
        avgRiskPercent: Math.max(0.4, Math.min(3.5,  Math.round((prev.avgRiskPercent + (Math.random() - 0.5) * 0.12) * 10) / 10)),
        efficiencyGain: Math.max(15,  Math.min(23,   Math.round((prev.efficiencyGain  + (Math.random() - 0.5) * 0.15) * 10) / 10)),
        activeAlerts:   alerts,
        syncAgoSecs:    Math.round((now - lastSyncRef.current) / 1000),
      };
    });

    lastSyncRef.current = now;
  }, [trucks]);

  useEffect(() => {
    const id = setInterval(tick, pollMs);
    return () => clearInterval(id);
  }, [tick, pollMs]);

  return { trucks, kpis };
}
