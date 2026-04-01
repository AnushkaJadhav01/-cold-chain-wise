import { Cloud, Server, Database, Wifi, Globe } from "lucide-react";

const services = [
  { icon: Server, name: "Amazon SageMaker", role: "GAT-RL model training & inference", color: "text-primary" },
  { icon: Cloud, name: "AWS Lambda", role: "Route optimization API (serverless)", color: "text-success" },
  { icon: Database, name: "Amazon DynamoDB", role: "Logistics & route data storage", color: "text-info" },
  { icon: Wifi, name: "AWS IoT Core", role: "Real-time truck temperature sensors", color: "text-warning" },
  { icon: Globe, name: "AWS Amplify", role: "Frontend hosting & deployment", color: "text-primary" },
];

const AWSArchitecture = () => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Cloud className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AWS Deployment Architecture</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Scalable cloud infrastructure for production deployment</p>

      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        <div className="space-y-3">
          {services.map((s, i) => (
            <div key={s.name} className="flex items-center gap-4 relative pl-2" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center z-10 shrink-0">
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="flex-1 p-3 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AWSArchitecture;
