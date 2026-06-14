import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import DeliveryPlanner from "@/components/DeliveryPlanner";
import MetricsDashboard from "@/components/MetricsDashboard";
import InteractiveMap from "@/components/InteractiveMap";
import ComparisonPanel from "@/components/ComparisonPanel";
import RiskAnalysis from "@/components/RiskAnalysis";
import TechnologyPanel from "@/components/TechnologyPanel";
import AWSArchitecture from "@/components/AWSArchitecture";
import OptimizedRoute from "@/components/OptimizedRoute";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import ColdChainMonitoring from "@/components/ColdChainMonitoring";
import SavedDeliveryPlans from "@/components/SavedDeliveryPlans";
import AISpoilagePrediction from "@/components/AISpoilagePrediction";
import RealTimeAlertFeed from "@/components/RealTimeAlertFeed";
import SimulationController from "@/components/SimulationController";
import AIDecisionEngine from "@/components/AIDecisionEngine";
import PerformanceAnalytics from "@/components/PerformanceAnalytics";
import { useSimulation } from "@/hooks/useSimulation";
import { Brain } from "lucide-react";
import AIAgent from "@/components/AIAgent";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const [config, setConfig] = useState({
    depot: "Nashik",
    deliveries: ["Mumbai", "Bangalore"],
    product: "Fruits",
    temp: 4,
    priority: "Standard",
  });
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const { simulationActive, demoMode, shipments, toggleSimulation, toggleDemo } = useSimulation();

  const handleOptimize = (newConfig: typeof config) => {
    setConfig(newConfig);
    setOptimized(false);
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* Hero + Simulation Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative text-center py-10 bg-gradient-hero rounded-2xl border border-border overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/3 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/2 blur-2xl" />
          </div>
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-extrabold text-foreground mb-3 tracking-tight"
            >
              <span className="text-gradient-primary">GAT-RL</span> Cold Chain Intelligence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed"
            >
              AI-driven multi-depot cold chain routing optimization using Graph Attention Networks
              and Reinforcement Learning to reduce spoilage, delays, and energy consumption.
            </motion.p>
            <SimulationController
              active={simulationActive}
              demoMode={demoMode}
              onToggleSimulation={toggleSimulation}
              onToggleDemo={toggleDemo}
            />
          </div>
        </motion.div>

        {/* Metrics */}
        <MetricsDashboard simulationActive={simulationActive} />

        {/* Main Panel: Planner + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-4"
          >
            <DeliveryPlanner onOptimize={handleOptimize} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-8 relative"
          >
            <InteractiveMap
              depot={config.depot}
              cities={config.deliveries}
              optimized={optimized}
              simulationActive={simulationActive}
              shipments={shipments}
            />

            {/* Loading Overlay */}
            <AnimatePresence>
              {optimizing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 backdrop-blur-md rounded-xl z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary mb-5"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-foreground">AI Optimizing Route...</span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-muted-foreground mt-2"
                  >
                    Analyzing graph attention weights & reward signals
                  </motion.p>
                  <motion.div
                    className="mt-4 w-48 h-1 rounded-full bg-secondary overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Optimized Route */}
        <AnimatePresence>
          {optimized && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <OptimizedRoute depot={config.depot} cities={config.deliveries} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Decision Engine */}
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
          <AIDecisionEngine simulationActive={simulationActive} />
        </motion.div>

        {/* AI Spoilage Prediction + Alert Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
            <AISpoilagePrediction simulationActive={simulationActive} />
          </motion.div>
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            <RealTimeAlertFeed simulationActive={simulationActive} />
          </motion.div>
        </div>

        {/* Performance Analytics */}
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
          <PerformanceAnalytics simulationActive={simulationActive} />
        </motion.div>

        {/* Before vs After */}
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
          <BeforeAfterComparison />
        </motion.div>

        {/* AI Insights + Cold Chain Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
            <AIInsightsPanel />
          </motion.div>
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            <ColdChainMonitoring />
          </motion.div>
        </div>

        {/* Comparison + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
            <ComparisonPanel />
          </motion.div>
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            <RiskAnalysis />
          </motion.div>
        </div>

        {/* Saved Plans */}
        <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
          <SavedDeliveryPlans currentConfig={config} optimized={optimized} />
        </motion.div>

        {/* Technology + AWS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
            <TechnologyPanel />
          </motion.div>
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.1 }}>
            <AWSArchitecture />
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            GAT-RL Cold Chain Intelligence Platform • AI-Powered Logistics Optimization • Built for Enterprise Scale
          </p>
        </footer>
      </main>

      <AIAgent />
    </div>
  );
};

export default Index;
