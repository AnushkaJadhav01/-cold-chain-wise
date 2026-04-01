import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GitCompareArrows } from "lucide-react";

const comparisonData = [
  { metric: "Spoilage Risk", traditional: 42, ai: 8 },
  { metric: "Fuel Cost", traditional: 100, ai: 72 },
  { metric: "Delivery Delay", traditional: 35, ai: 9 },
  { metric: "Route Length", traditional: 100, ai: 68 },
  { metric: "Energy Use", traditional: 95, ai: 61 },
];

const ComparisonPanel = () => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <GitCompareArrows className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Traditional vs AI Routing</h2>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={comparisonData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="metric" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 16%)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "hsl(210 40% 96%)" }}
          />
          <Bar dataKey="traditional" name="Traditional" radius={[4, 4, 0, 0]}>
            {comparisonData.map((_, i) => <Cell key={i} fill="hsl(38 92% 50%)" opacity={0.6} />)}
          </Bar>
          <Bar dataKey="ai" name="AI Optimized" radius={[4, 4, 0, 0]}>
            {comparisonData.map((_, i) => <Cell key={i} fill="hsl(187 85% 53%)" />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground justify-center">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-warning/60 inline-block" /> Traditional</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary inline-block" /> AI Optimized</span>
      </div>
    </div>
  );
};

export default ComparisonPanel;
