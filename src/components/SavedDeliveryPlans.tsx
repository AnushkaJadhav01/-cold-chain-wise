import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { ref, onValue, push, remove, serverTimestamp } from "firebase/database";
import { MapPin, Trash2, Eye, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface DeliveryPlan {
  id: string;
  route_name: string;
  depot: string;
  deliveries: string[];
  product: string;
  spoilage_risk: number;
  created_at: number;
}

interface SavedDeliveryPlansProps {
  currentConfig?: {
    depot: string;
    deliveries: string[];
    product: string;
    temp: number;
    priority: string;
  };
  optimized?: boolean;
}

const SavedDeliveryPlans = ({ currentConfig, optimized }: SavedDeliveryPlansProps) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<DeliveryPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DeliveryPlan | null>(null);

  useEffect(() => {
    if (!user) {
      setPlans([]);
      return;
    }

    setLoading(true);
    const plansRef = ref(db, `plans/${user.uid}`);
    
    const unsubscribe = onValue(plansRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPlans: DeliveryPlan[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        })).sort((a, b) => b.created_at - a.created_at);
        setPlans(loadedPlans);
      } else {
        setPlans([]);
      }
      setLoading(false);
    }, (error) => {
      toast.error("Failed to load plans");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const savePlan = async () => {
    if (!user || !currentConfig) return;
    
    const name = `${currentConfig.depot} → ${currentConfig.deliveries.join(", ")}`;
    const spoilage = Math.round(Math.random() * 8 + 4);
    
    try {
      const plansRef = ref(db, `plans/${user.uid}`);
      await push(plansRef, {
        route_name: name,
        depot: currentConfig.depot,
        deliveries: currentConfig.deliveries,
        product: currentConfig.product,
        temp_requirement: currentConfig.temp,
        priority: currentConfig.priority,
        spoilage_risk: spoilage,
        created_at: serverTimestamp(),
      });
      toast.success("Delivery plan saved!");
    } catch (error) {
      toast.error("Failed to save plan");
    }
  };

  const deletePlan = async (id: string) => {
    if (!user) return;
    try {
      await remove(ref(db, `plans/${user.uid}/${id}`));
      toast.success("Plan deleted");
      if (selectedPlan?.id === id) setSelectedPlan(null);
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Saved Delivery Plans</h2>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        )}
      </div>

      {/* Save Button */}
      {user && optimized && currentConfig && (
        <Button onClick={savePlan} size="sm" className="mb-4 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20 text-xs">
          <Package className="w-3 h-3 mr-1.5" /> Save Current Route
        </Button>
      )}

      {/* Plans List */}
      {user ? (
        loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map(i => (
              <div key={i} className="h-16 w-full animate-pulse bg-secondary/30 rounded-lg" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No saved plans yet. Optimize a route and save it!</p>
        ) : (
          <div className="space-y-2">
            {plans.map((plan) => (
              <div key={plan.id} className="p-3.5 rounded-lg border border-border bg-secondary/30 hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{plan.route_name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {plan.depot}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'Just now'}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${plan.spoilage_risk > 10 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                        {plan.spoilage_risk}% risk
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)} className="h-7 w-7 p-0 text-muted-foreground hover:text-primary">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {selectedPlan?.id === plan.id && (
                  <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                    <p>Deliveries: <span className="text-foreground">{plan.deliveries.join(" → ")}</span></p>
                    <p>Product: <span className="text-foreground">{plan.product}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-xs text-muted-foreground py-4 text-center">Please log in to see your saved plans.</p>
      )}
    </div>
  );
};

export default SavedDeliveryPlans;

