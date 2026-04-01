import { Snowflake, Activity, Cpu, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { toast } from "sonner";

const Header = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center glow-primary"
          >
            <Snowflake className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">
              GAT-RL <span className="text-gradient-primary">Cold Chain Intelligence</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">AI-Powered Logistics Optimization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <Cpu className="w-3 h-3 text-primary animate-pulse-slow" />
            <span className="text-[10px] font-medium text-muted-foreground">GAT-RL v2.4</span>
          </div>
          <motion.div
            animate={{ boxShadow: ["0 0 0px hsl(152 69% 45% / 0)", "0 0 12px hsl(152 69% 45% / 0.3)", "0 0 0px hsl(152 69% 45% / 0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20"
          >
            <Activity className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">System Online</span>
          </motion.div>

          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline text-xs">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

