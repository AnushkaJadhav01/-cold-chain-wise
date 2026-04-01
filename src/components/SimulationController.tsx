import { motion } from "framer-motion";
import { Play, Pause, Radio, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  active: boolean;
  demoMode: boolean;
  onToggleSimulation: () => void;
  onToggleDemo: () => void;
}

const SimulationController = ({ active, demoMode, onToggleSimulation, onToggleDemo }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 flex-wrap justify-center"
    >
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onToggleSimulation}
          size="lg"
          className={`font-bold text-sm px-8 py-3 transition-all duration-300 ${
            active
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground glow-destructive"
              : "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary-strong"
          }`}
        >
          {active ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {active ? "Stop Simulation" : "Start AI Logistics Simulation"}
          {!active && <Zap className="w-3.5 h-3.5 ml-2" />}
        </Button>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onToggleDemo}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 border ${
          demoMode
            ? "bg-primary/15 border-primary/30 text-primary glow-primary"
            : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
        }`}
      >
        <Radio className={`w-3.5 h-3.5 ${demoMode ? "animate-pulse" : ""}`} />
        Demo Mode {demoMode ? "ON" : "OFF"}
      </motion.button>

      {active && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-xs text-success font-medium"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-success"
          />
          Simulation Running
        </motion.div>
      )}
    </motion.div>
  );
};

export default SimulationController;
