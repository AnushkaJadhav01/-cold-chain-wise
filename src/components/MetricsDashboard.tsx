import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Fuel, Clock, Leaf, Brain, Apple, HeartPulse } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface MetricsDashboardProps {
  simulationActive?: boolean;
}

const generateSparklineData = (base: number, volatility: number) => {
  return Array.from({ length: 15 }, (_, i) => ({
    value: base + (Math.random() - 0.5) * volatility
  }));
};

const baseMetrics = [
  { label: "Spoilage Reduction", value: 37.2, suffix: "%", icon: TrendingDown, color: "#10B981", delta: "+2.4%", data: generateSparklineData(37, 2) },
  { label: "Fuel Savings", value: 12.8, suffix: "%", icon: Fuel, color: "#F59E0B", delta: "+1.1%", data: generateSparklineData(12, 1) },
  { label: "Delivery Efficiency", value: 23.5, suffix: "%", icon: Clock, color: "#3B82F6", delta: "+3.5%", data: generateSparklineData(23, 2) },
  { label: "Carbon Reduction", value: 18.4, suffix: "%", icon: Leaf, color: "#10B981", delta: "+1.8%", data: generateSparklineData(18, 1) },
  { label: "AI Confidence", value: 94.7, suffix: "%", icon: Brain, color: "#8B5CF6", delta: "+0.2%", data: generateSparklineData(94, 0.5) },
  { label: "Food Saved", value: 12480, suffix: "", icon: Apple, color: "#F59E0B", delta: "+120", data: generateSparklineData(12400, 100) },
  { label: "Cold Chain Health", value: 92, suffix: "", icon: HeartPulse, color: "#06B6D4", delta: "+1", data: generateSparklineData(90, 3) },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const prevValue = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const startVal = prevValue.current;
    const duration = 800; // Updated to 800ms per request
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out
      const current = startVal + (value - startVal) * eased;
      setDisplay(value >= 100 ? Math.round(current) : parseFloat(current.toFixed(1)));
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = value;
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span ref={ref}>{value >= 1000 ? display.toLocaleString() : display}{suffix}</span>;
};

const MetricsDashboard = ({ simulationActive = false }: MetricsDashboardProps) => {
  const [metrics, setMetrics] = useState(baseMetrics);

  useEffect(() => {
    if (!simulationActive) return;
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        let newValue = m.value;
        if (m.label === "Food Saved") newValue = m.value + Math.floor(Math.random() * 50);
        else if (m.label === "Cold Chain Health") newValue = Math.min(100, Math.max(80, m.value + (Math.random() - 0.5) * 3));
        else newValue = Math.min(99, Math.max(5, m.value + (Math.random() - 0.45) * 2));
        
        const newData = [...m.data.slice(1), { value: newValue }];
        
        return {
          ...m,
          value: newValue,
          data: newData
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [simulationActive]);

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="flex flex-col shrink-0 w-[180px] rounded-[10px] overflow-hidden"
          style={{ 
            background: '#27364B', 
            border: '1px solid #374151',
            padding: '16px 20px'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: m.color }}
            >
              <m.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[12px] text-[#9CA3AF] font-medium leading-tight truncate">
              {m.label}
            </p>
          </div>
          
          <div className="mb-2">
            <p className="text-[28px] font-semibold text-[#F9FAFB] tracking-tight leading-none">
              <AnimatedCounter value={m.value} suffix={m.suffix} />
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between h-[40px] w-full">
            <div className="w-[60%] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={m.data}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={m.color} 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-2" style={{ backgroundColor: `${m.color}20`, color: m.color }}>
              {m.delta}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsDashboard;
