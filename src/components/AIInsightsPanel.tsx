import { Brain, AlertTriangle, Truck, Navigation, Lightbulb } from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    text: "AI rerouted delivery to avoid high temperature zones near Mumbai — ambient temp exceeds 38°C on direct route.",
    type: "warning",
  },
  {
    icon: Truck,
    text: "Vaccine shipment prioritized for faster delivery due to strict temperature requirements (2–8°C range).",
    type: "critical",
  },
  {
    icon: Navigation,
    text: "Traffic congestion risk avoided on Nashik–Mumbai route. Alternative via Pune reduces delay by 45 minutes.",
    type: "info",
  },
  {
    icon: Lightbulb,
    text: "Multi-hop strategy via Pune depot reduces total energy consumption by 18% compared to direct routing.",
    type: "success",
  },
  {
    icon: Brain,
    text: "GAT attention weights indicate Nagpur–Hyderabad corridor has highest spoilage risk — active cooling recommended.",
    type: "warning",
  },
];

const typeStyles: Record<string, string> = {
  warning: "border-warning/30 bg-warning/5",
  critical: "border-destructive/30 bg-destructive/5",
  info: "border-info/30 bg-info/5",
  success: "border-success/30 bg-success/5",
};

const iconStyles: Record<string, string> = {
  warning: "text-warning",
  critical: "text-destructive",
  info: "text-info",
  success: "text-success",
};

const AIInsightsPanel = () => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Route Insights</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Why the AI chose this specific routing strategy</p>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors hover:border-primary/20 ${typeStyles[insight.type]}`}
          >
            <div className="mt-0.5 shrink-0">
              <insight.icon className={`w-4 h-4 ${iconStyles[insight.type]}`} />
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
