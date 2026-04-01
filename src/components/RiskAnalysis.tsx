import { AlertTriangle, Thermometer, Clock, ShieldCheck } from "lucide-react";

const risks = [
  {
    label: "Temperature Risk Zones",
    value: "2 zones flagged",
    severity: "medium",
    detail: "Nagpur–Hyderabad corridor exceeds 35°C ambient. Recommend active cooling boost.",
    icon: Thermometer,
  },
  {
    label: "Delay Probability",
    value: "12.3%",
    severity: "low",
    detail: "Low traffic congestion predicted. Monsoon season risk: minimal for this period.",
    icon: Clock,
  },
  {
    label: "Spoilage Risk",
    value: "4.2%",
    severity: "low",
    detail: "With AI-optimized routing, spoilage risk drops from 18% to 4.2% for dairy products.",
    icon: AlertTriangle,
  },
  {
    label: "Routing Strategy",
    value: "Multi-hop recommended",
    severity: "info",
    detail: "GAT-RL suggests Nashik → Pune → Bangalore → Chennai path for optimal cold chain integrity.",
    icon: ShieldCheck,
  },
];

const severityStyles: Record<string, string> = {
  low: "bg-success/10 border-success/20 text-success",
  medium: "bg-warning/10 border-warning/20 text-warning",
  high: "bg-destructive/10 border-destructive/20 text-destructive",
  info: "bg-primary/10 border-primary/20 text-primary",
};

const RiskAnalysis = () => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Cold Chain Risk Analysis</h2>
      </div>
      <div className="space-y-3">
        {risks.map(r => (
          <div key={r.label} className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/20 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <r.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{r.label}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityStyles[r.severity]}`}>{r.value}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAnalysis;
