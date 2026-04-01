import { Brain, GitBranch, Cpu, Layers } from "lucide-react";

const techs = [
  {
    icon: Brain,
    title: "Graph Attention Network (GAT)",
    description: "Identifies the most critical routes in the logistics network by assigning attention weights to edges between depot and delivery nodes, prioritizing high-risk or time-sensitive connections.",
  },
  {
    icon: GitBranch,
    title: "Reinforcement Learning (RL)",
    description: "Dynamically learns optimal routing strategies through reward signals — minimizing spoilage, reducing delivery delays, and balancing energy consumption across the fleet.",
  },
  {
    icon: Cpu,
    title: "Hybrid GAT-RL Architecture",
    description: "Combines graph-level structural awareness with sequential decision-making, enabling real-time route adaptation as conditions change across the cold chain network.",
  },
  {
    icon: Layers,
    title: "Multi-Depot Optimization",
    description: "Coordinates across multiple cold storage depots simultaneously, dynamically allocating deliveries to the nearest optimal depot based on capacity and route efficiency.",
  },
];

const TechnologyPanel = () => {
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Cpu className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">AI Model Architecture</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Hybrid Graph Attention Network + Reinforcement Learning</p>
      <div className="grid grid-cols-2 gap-4">
        {techs.map(t => (
          <div key={t.title} className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/20 transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
              <t.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1.5">{t.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnologyPanel;
