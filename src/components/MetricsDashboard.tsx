import { useState, useEffect, useRef } from "react";
import { TrendingDown, Fuel, Clock, Leaf, Brain, Apple, HeartPulse } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface MetricsDashboardProps {
  simulationActive?: boolean;
}

const generateSparklineData = (base: number, volatility: number) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    value: base + (Math.random() - 0.5) * volatility
  }));
};

const baseMetrics = [
  { label: "Spoilage Reduction", value: 37.2, suffix: "%", icon: TrendingDown, color: "#00A878", delta: "+4.1% ▲", deltaColor: "text-[#00A878]" },
  { label: "Fuel Savings", value: 12.8, suffix: "%", icon: Fuel, color: "#E8912A", delta: "+2.3% ▲", deltaColor: "text-[#00A878]" },
  { label: "Delivery Efficiency", value: 23.5, suffix: "%", icon: Clock, color: "#1B2E6B", delta: "+1.5% ▲", deltaColor: "text-[#00A878]" },
  { label: "Carbon Reduction", value: 18.4, suffix: "%", icon: Leaf, color: "#00A878", delta: "+3.2% ▲", deltaColor: "text-[#00A878]" },
  { label: "AI Confidence", value: 94.7, suffix: "%", icon: Brain, color: "#2E4DA0", delta: "+0.8% ▲", deltaColor: "text-[#00A878]" },
  { label: "Food Saved", value: 12480, suffix: " kg", icon: Apple, color: "#E8912A", delta: "+420 kg ▲", deltaColor: "text-[#00A878]" },
  { label: "Cold Chain Health", value: 92, suffix: "/100", icon: HeartPulse, color: "#00B4D8", delta: "-2 ▼", deltaColor: "text-[#D94F3D]" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const prevValue = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const startVal = prevValue.current;
    const duration = 900;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-in-out quad
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const current = startVal + (value - startVal) * eased;
      
      setDisplay(value >= 100 ? Math.round(current) : parseFloat(current.toFixed(1)));
      
      if (t < 1) requestAnimationFrame(animate);
      else prevValue.current = value;
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span ref={ref}>{value >= 1000 ? display.toLocaleString() : display}{suffix}</span>;
};

const MetricsDashboard = ({ simulationActive = false }: MetricsDashboardProps) => {
  const [metrics, setMetrics] = useState(baseMetrics);
  const [sparklines, setSparklines] = useState<Record<string, any[]>>({});

  // Initialize sparklines
  useEffect(() => {
    const initialSparklines: Record<string, any[]> = {};
    metrics.forEach(m => {
      initialSparklines[m.label] = generateSparklineData(m.value, m.value > 100 ? 500 : 5);
    });
    setSparklines(initialSparklines);
  }, []);

  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        const newValue = m.label === "Food Saved"
          ? m.value + Math.floor(Math.random() * 50)
          : m.label === "Cold Chain Health"
          ? Math.min(100, Math.max(80, m.value + (Math.random() - 0.5) * 3))
          : Math.min(99, Math.max(5, m.value + (Math.random() - 0.45) * 2));
        
        // Update sparkline
        setSparklines(s => ({
          ...s,
          [m.label]: [...(s[m.label] || []).slice(1), { value: newValue }]
        }));

        return { ...m, value: newValue };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [simulationActive]);

  return (
    <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-[#CBD5E1] scrollbar-track-transparent">
      {metrics.map((m) => {
        const Icon = m.icon;
        const colorWithOpacity = m.color + "20"; // 12% opacity approx

        return (
          <div
            key={m.label}
            className="flex-shrink-0 w-[200px]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              borderTop: `3px solid ${m.color}`,
              padding: '16px 18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
            }}
          >
            {/* Row 1: Icon Badge + Label */}
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: colorWithOpacity, color: m.color }}
              >
                <Icon size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[12px] font-medium text-[#5A6680]">
                {m.label}
              </span>
            </div>

            {/* Row 2: Metric Value */}
            <div className="text-[28px] font-[700] text-[#1A1A2E] leading-none mb-3">
              <AnimatedCounter value={m.value} suffix={m.suffix} />
            </div>

            {/* Row 3: Sparkline + Delta Pill */}
            <div className="flex items-center justify-between gap-2 h-[40px]">
              <div className="flex-1 h-full">
                {sparklines[m.label] && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklines[m.label]}>
                      <defs>
                        <linearGradient id={`color-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={m.color} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={m.color} 
                        strokeWidth={1.5}
                        fillOpacity={1} 
                        fill={`url(#color-${m.label})`} 
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${m.deltaColor}`} style={{ backgroundColor: m.deltaColor.replace('text-[', '').replace(']', '') + '15' }}>
                {m.delta}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsDashboard;
