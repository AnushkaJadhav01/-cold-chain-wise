import { useEffect, useRef } from "react";
import { Network } from "lucide-react";

interface RouteVizProps {
  depot: string;
  cities: string[];
  optimized: boolean;
}

const cityCoords: Record<string, [number, number]> = {
  Nashik: [0.35, 0.35],
  Pune: [0.3, 0.55],
  Nagpur: [0.65, 0.3],
  Hyderabad: [0.55, 0.65],
  Mumbai: [0.15, 0.45],
  Ahmedabad: [0.1, 0.2],
  Bangalore: [0.45, 0.85],
  Chennai: [0.7, 0.85],
  Kolkata: [0.85, 0.35],
  Delhi: [0.35, 0.05],
  Jaipur: [0.25, 0.12],
  Indore: [0.35, 0.25],
  Vizag: [0.75, 0.55],
  Surat: [0.15, 0.3],
  Lucknow: [0.5, 0.1],
  Bhopal: [0.45, 0.25],
};

const RouteVisualization = ({ depot, cities, optimized }: RouteVizProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = w / 2;
    const ch = h / 2;

    ctx.clearRect(0, 0, cw, ch);

    // Background grid
    ctx.strokeStyle = "rgba(100, 200, 255, 0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < cw; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
    }
    for (let y = 0; y < ch; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    const pad = 40;
    const getPos = (name: string): [number, number] => {
      const c = cityCoords[name] || [0.5, 0.5];
      return [pad + c[0] * (cw - pad * 2), pad + c[1] * (ch - pad * 2)];
    };

    const depotPos = getPos(depot);
    const cityPositions = cities.map(c => ({ name: c, pos: getPos(c) }));

    // Draw connections
    if (optimized) {
      // Optimized: ordered path
      const sorted = [...cityPositions].sort((a, b) => {
        const da = Math.hypot(a.pos[0] - depotPos[0], a.pos[1] - depotPos[1]);
        const db = Math.hypot(b.pos[0] - depotPos[0], b.pos[1] - depotPos[1]);
        return da - db;
      });

      ctx.strokeStyle = "rgba(45, 212, 191, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      let prev = depotPos;
      sorted.forEach(c => {
        ctx.beginPath();
        ctx.moveTo(prev[0], prev[1]);
        ctx.lineTo(c.pos[0], c.pos[1]);
        ctx.stroke();

        // Arrow
        const angle = Math.atan2(c.pos[1] - prev[1], c.pos[0] - prev[0]);
        const mx = (prev[0] + c.pos[0]) / 2;
        const my = (prev[1] + c.pos[1]) / 2;
        ctx.fillStyle = "rgba(45, 212, 191, 0.8)";
        ctx.beginPath();
        ctx.moveTo(mx + 6 * Math.cos(angle), my + 6 * Math.sin(angle));
        ctx.lineTo(mx - 6 * Math.cos(angle - 0.5), my - 6 * Math.sin(angle - 0.5));
        ctx.lineTo(mx - 6 * Math.cos(angle + 0.5), my - 6 * Math.sin(angle + 0.5));
        ctx.fill();

        prev = c.pos;
      });
    } else {
      // Traditional: star from depot
      ctx.strokeStyle = "rgba(255, 160, 50, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      cityPositions.forEach(c => {
        ctx.beginPath();
        ctx.moveTo(depotPos[0], depotPos[1]);
        ctx.lineTo(c.pos[0], c.pos[1]);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Draw depot node
    ctx.fillStyle = "rgba(45, 212, 191, 0.15)";
    ctx.beginPath();
    ctx.arc(depotPos[0], depotPos[1], 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(45, 212, 191, 1)";
    ctx.beginPath();
    ctx.arc(depotPos[0], depotPos[1], 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(45, 212, 191, 1)";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(depot, depotPos[0], depotPos[1] - 25);
    ctx.font = "8px Inter, sans-serif";
    ctx.fillStyle = "rgba(45, 212, 191, 0.6)";
    ctx.fillText("DEPOT", depotPos[0], depotPos[1] - 15);

    // Draw delivery nodes
    cityPositions.forEach(c => {
      ctx.fillStyle = "rgba(100, 200, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(c.pos[0], c.pos[1], 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(100, 200, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(c.pos[0], c.pos[1], 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(210, 230, 255, 0.9)";
      ctx.font = "9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c.name, c.pos[0], c.pos[1] - 18);
    });

  }, [depot, cities, optimized]);

  return (
    <div className="bg-gradient-card border border-border rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Route Visualization</h2>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${optimized ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"}`}>
          {optimized ? "AI Optimized" : "Traditional"}
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full h-[350px] rounded-lg" style={{ imageRendering: "auto" }} />
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Depot</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cold inline-block" /> Delivery Node</span>
        <span className="flex items-center gap-1.5"><span className="w-6 h-0.5 bg-primary inline-block rounded" /> Optimized Path</span>
      </div>
    </div>
  );
};

export default RouteVisualization;
