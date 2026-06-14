import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import DeliveryPlanner from "@/components/DeliveryPlanner";
import MetricsDashboard from "@/components/MetricsDashboard";
import InteractiveMap from "@/components/InteractiveMap";
import { useSimulation } from "@/hooks/useSimulation";
import { Brain } from "lucide-react";
import FleetList from "@/components/FleetList";
import SimulationController from "@/components/SimulationController";

const Index = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">
      <Header 
        simulationActive={simulationActive}
        demoMode={demoMode}
        onToggleSimulation={toggleSimulation}
        onToggleDemo={toggleDemo}
      />

      {/* Page Body */}
      <main className="flex-1 flex flex-col p-[20px] px-[24px] gap-5">
        {/* Scrollable KPI Row */}
        <div className="w-full">
          <MetricsDashboard simulationActive={simulationActive} />
        </div>

        {/* Main Panel: 320px left panel | remaining width map */}
        <div className="flex flex-1 gap-5 overflow-hidden h-[calc(100vh-56px-150px)] min-h-[600px]">
          {/* Left Panel */}
          <div className="w-[320px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-[#CBD5E1] scrollbar-track-transparent">
            {/* Simulation controls were in header, now we need to make sure user can start it. We'll add a control panel here if needed, or use the existing component. */}
            <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
              <h3 className="text-[#1B2E6B] font-[600] text-[14px] mb-3">Simulation Controls</h3>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={toggleSimulation}
                  className="flex-1 bg-[#1B2E6B] text-white hover:bg-[#2E4DA0] rounded-lg py-2 text-[14px] font-[600] transition-colors"
                >
                  {simulationActive ? "Stop Simulation" : "Start Simulation"}
                </button>
              </div>
              <button
                onClick={toggleDemo}
                className="w-full bg-white border border-[#CBD5E1] text-[#1B2E6B] hover:bg-[#EDF0FA] rounded-lg py-2 text-[13px] font-[500] transition-colors"
              >
                Demo Mode: {demoMode ? "ON" : "OFF"}
              </button>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.07)] overflow-hidden">
              <DeliveryPlanner onOptimize={handleOptimize} />
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.07)] overflow-hidden flex-1 flex flex-col min-h-[300px]">
              <div className="px-4 py-3 border-b border-[#CBD5E1]">
                <h3 className="text-[#1B2E6B] font-[600] text-[14px]">Active Fleet</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FleetList shipments={shipments} simulationActive={simulationActive} />
              </div>
            </div>
          </div>
          
          {/* Right Panel (Map) */}
          <div className="flex-1 relative flex flex-col bg-white border border-[#CBD5E1] rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
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
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 rounded-full border-4 border-[#E8EDF5] border-t-[#1B2E6B] mb-5"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Brain className="w-5 h-5 text-[#1B2E6B]" />
                    <span className="text-sm font-bold text-[#1A1A2E]">AI Optimizing Route...</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
