import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, Thermometer, Clock, MapPin, Activity, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const WhatIfSimulator: React.FC = () => {
  const [delay, setDelay] = useState(2);
  const [temperature, setTemperature] = useState(4);
  const [distance, setDistance] = useState(200);
  const [aiReasoning, setAiReasoning] = useState<string>("Initializing Gemini reasoning engine...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const riskScore = useMemo(() => {
    // Heuristic: Delay (0-10h), Temp (0-15°C), Dist (50-500km)
    const delayRisk = (delay / 10) * 40; // Max 40%
    const tempRisk = (temperature / 15) * 40; // Max 40%
    const distRisk = ((distance - 50) / 450) * 20; // Max 20%
    
    const total = Math.min(100, Math.max(0, delayRisk + tempRisk + distRisk));
    return Math.round(total);
  }, [delay, temperature, distance]);

  const riskLevel = useMemo(() => {
    if (riskScore < 35) return "low";
    if (riskScore < 70) return "medium";
    return "high";
  }, [riskScore]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "high": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "";
    }
  };

  const currentRecommendation = useMemo(() => {
    if (riskLevel === "low") {
      return "Current parameters are within optimal range. No immediate action required. Routing remains efficient.";
    } else if (riskLevel === "medium") {
      return "Risk elevated due to environmental factors. Recommend activating sub-zero cooling mode and monitoring humidity.";
    } else {
      return "CRITICAL RISK: Potential spoilage detected. System recommends immediate warehouse rerouting or deployment of emergency cooling backups.";
    }
  }, [riskLevel]);

  useEffect(() => {
    const fetchExplanation = async () => {
      setIsAiLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/gemini-explain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            delay,
            temperature,
            distance,
            risk: riskScore,
          }),
        });
        const data = await res.json();
        setAiReasoning(data.explanation || "No explanation provided.");
      } catch (error) {
        setAiReasoning("⚠️ Unable to reach the Gemini backend. Please ensure the Flask server is running.");
      } finally {
        setIsAiLoading(false);
      }
    };
    
    // Debounce to prevent spamming the API while dragging sliders
    const timeoutId = setTimeout(() => {
      fetchExplanation();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [delay, temperature, distance, riskScore]);

  return (
    <Card className="glass-card overflow-hidden border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">What-If Simulator</CardTitle>
              <CardDescription>Digital Twin Environmental Stress Test</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="animate-pulse bg-primary/5 text-primary border-primary/20 gap-1">
            <Sparkles className="w-3 h-3" />
            AI Enabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label>Additional Delay</Label>
                </div>
                <span className="text-sm font-bold text-primary">{delay} hours</span>
              </div>
              <Slider
                value={[delay]}
                max={10}
                step={0.5}
                onValueChange={(val) => setDelay(val[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <Label>Average Temperature</Label>
                </div>
                <span className="text-sm font-bold text-primary">{temperature}°C</span>
              </div>
              <Slider
                value={[temperature]}
                max={15}
                step={0.5}
                onValueChange={(val) => setTemperature(val[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Label>Transit Distance</Label>
                </div>
                <span className="text-sm font-bold text-primary">{distance} km</span>
              </div>
              <Slider
                value={[distance]}
                min={50}
                max={500}
                step={10}
                onValueChange={(val) => setDistance(val[0])}
                className="py-4"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-center items-center text-center p-6 bg-secondary/30 rounded-xl border border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              {riskLevel === "low" ? (
                <ShieldCheck className="w-12 h-12 text-emerald-500/20" />
              ) : riskLevel === "medium" ? (
                <AlertTriangle className="w-12 h-12 text-amber-500/20" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-rose-500/20" />
              )}
            </div>
            
            <div className="relative mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-secondary"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 - (364.4 * riskScore) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    riskLevel === "low" ? "text-emerald-500" : 
                    riskLevel === "medium" ? "text-amber-500" : "text-rose-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tighter">{riskScore}%</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Risk Score</span>
              </div>
            </div>

            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-4",
              getRiskColor(riskLevel)
            )}>
              {riskLevel} Risk Level
            </div>

            <p className="text-sm font-medium text-foreground px-4 leading-relaxed">
              {currentRecommendation}
            </p>
          </div>
        </div>

        {/* AI Insight Section */}
        <motion.div 
          initial={false}
          animate={{ backgroundColor: riskLevel === "low" ? "rgba(16, 185, 129, 0.03)" : riskLevel === "medium" ? "rgba(245, 158, 11, 0.03)" : "rgba(244, 63, 94, 0.03)" }}
          className="p-5 rounded-lg border border-dashed border-primary/20 relative"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                Gemini Reasoning Engine
                <span className={cn("flex h-1.5 w-1.5 rounded-full bg-primary", isAiLoading ? "animate-ping" : "animate-pulse")} />
              </h4>
              <p className={cn("text-sm text-muted-foreground italic transition-opacity", isAiLoading && "opacity-50")}>
                "{aiReasoning}"
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default WhatIfSimulator;
