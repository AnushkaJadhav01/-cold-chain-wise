import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Clock, AlertTriangle, Fuel, Zap } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const cardVariantsRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const MetricRow = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);

const BeforeAfterComparison = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Before vs After AI Optimization</h2>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        {/* Traditional */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-5 rounded-xl border border-warning/20 bg-warning/5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <h3 className="text-sm font-bold text-warning">Traditional Routing</h3>
          </div>
          <div className="space-y-3">
            <MetricRow icon={Clock} label="Delivery Time" value="9 hours" color="text-warning" />
            <MetricRow icon={AlertTriangle} label="Spoilage Risk" value="26%" color="text-warning" />
            <MetricRow icon={Fuel} label="Fuel Cost" value="₹12,400" color="text-warning" />
            <MetricRow icon={TrendingDown} label="Route Efficiency" value="62%" color="text-warning" />
          </div>
          <ul className="space-y-1.5 pt-2 border-t border-border">
            <li className="text-xs text-muted-foreground">• Static route planning</li>
            <li className="text-xs text-muted-foreground">• Higher spoilage risk</li>
            <li className="text-xs text-muted-foreground">• Longer delivery time</li>
          </ul>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-xs font-bold text-primary">AI</span>
          </div>
        </motion.div>

        {/* AI Optimized */}
        <motion.div
          variants={cardVariantsRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-4 glow-primary"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <h3 className="text-sm font-bold text-primary">AI Optimized (GAT-RL)</h3>
          </div>
          <div className="space-y-3">
            <MetricRow icon={Clock} label="Delivery Time" value="6 hours" color="text-primary" />
            <MetricRow icon={AlertTriangle} label="Spoilage Risk" value="8%" color="text-success" />
            <MetricRow icon={Fuel} label="Fuel Cost" value="₹8,900" color="text-success" />
            <MetricRow icon={TrendingDown} label="Route Efficiency" value="94%" color="text-success" />
          </div>
          <ul className="space-y-1.5 pt-2 border-t border-border">
            <li className="text-xs text-primary/80">• Dynamic optimized route</li>
            <li className="text-xs text-primary/80">• Reduced spoilage risk</li>
            <li className="text-xs text-primary/80">• Improved delivery efficiency</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterComparison;
