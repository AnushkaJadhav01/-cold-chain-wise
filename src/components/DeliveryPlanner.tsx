import { useState } from "react";
import { MapPin, Package, Thermometer, Zap, Plus, X, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

const depots = ["Nashik", "Pune", "Nagpur", "Hyderabad"];
const cities = ["Mumbai", "Ahmedabad", "Bangalore", "Chennai", "Kolkata", "Delhi", "Jaipur", "Indore", "Vizag", "Surat", "Lucknow", "Bhopal"];
const products = ["Fruits", "Dairy", "Vaccines", "Pharmaceuticals"];
const priorities = ["Standard", "Express", "Critical"];

interface PlannerProps {
  onOptimize: (config: { depot: string; deliveries: string[]; product: string; temp: number; priority: string }) => void;
}

const DeliveryPlanner = ({ onOptimize }: PlannerProps) => {
  const [depot, setDepot] = useState(depots[0]);
  const [selectedCities, setSelectedCities] = useState<string[]>(["Mumbai", "Bangalore"]);
  const [product, setProduct] = useState(products[0]);
  const [temp, setTemp] = useState(4);
  const [priority, setPriority] = useState(priorities[0]);

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) setSelectedCities([...selectedCities, city]);
  };

  const removeCity = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  return (
    <div className="card-premium p-6 space-y-5 h-full">
      <div className="flex items-center gap-2 mb-1">
        <Route className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Delivery Planning</h2>
      </div>

      {/* Depot */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Depot Location</label>
        <div className="grid grid-cols-2 gap-2">
          {depots.map(d => (
            <button
              key={d}
              onClick={() => setDepot(d)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                depot === d
                  ? "bg-primary/15 border border-primary/40 text-primary"
                  : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1.5" />{d}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Cities */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Delivery Cities</label>
        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg bg-secondary/50 border border-border">
          {selectedCities.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary">
              {c}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeCity(c)} />
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {cities.filter(c => !selectedCities.includes(c)).slice(0, 6).map(c => (
            <button key={c} onClick={() => addCity(c)} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
              <Plus className="w-2.5 h-2.5 inline mr-0.5" />{c}
            </button>
          ))}
        </div>
      </div>

      {/* Product & Temp */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Type</label>
          <select
            value={product}
            onChange={e => setProduct(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground"
          >
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Temp (°C)</label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
            <Thermometer className="w-4 h-4 text-cold" />
            <input
              type="number"
              value={temp}
              onChange={e => setTemp(Number(e.target.value))}
              className="bg-transparent text-sm text-foreground w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</label>
        <div className="flex gap-2">
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                priority === p
                  ? p === "Critical" ? "bg-destructive/15 border border-destructive/40 text-destructive" : "bg-primary/15 border border-primary/40 text-primary"
                  : "bg-secondary border border-border text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onOptimize({ depot, deliveries: selectedCities, product, temp, priority })}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        disabled={selectedCities.length === 0}
      >
        <Zap className="w-4 h-4 mr-2" />
        Optimize Route with AI
      </Button>
    </div>
  );
};

export default DeliveryPlanner;
