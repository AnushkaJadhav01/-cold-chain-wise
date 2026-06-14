import { Snowflake, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

interface HeaderProps {
  simulationActive?: boolean;
  demoMode?: boolean;
  onToggleSimulation?: () => void;
  onToggleDemo?: () => void;
}

const Header = ({ 
  simulationActive = false, 
  demoMode = false, 
  onToggleSimulation, 
  onToggleDemo 
}: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Fleet", path: "/fleet" },
    { name: "Analytics", path: "/analytics" },
    { name: "Alerts", path: "/alerts" }
  ];

  return (
    <header className="border-b border-[#374151] bg-[#111827] sticky top-0 z-50 h-[56px] flex items-center px-6">
      <div className="flex items-center justify-between w-full h-full">
        {/* Left */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Snowflake size={18} color="#3B82F6" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] font-semibold text-white">GAT-RL</span>
            <span className="text-[12px] text-[#9CA3AF]">Cold Chain Intelligence</span>
          </div>
        </div>

        {/* Centre - Nav Tabs */}
        <nav className="flex items-center gap-6 h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.name === "Dashboard" && location.pathname === "/");
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`h-full flex items-center text-[13px] font-medium transition-colors relative ${
                  isActive ? "text-white" : "text-[#9CA3AF] hover:text-[#D1D5DB]"
                }`}
              >
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#3B82F6]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          {onToggleSimulation && onToggleDemo && (
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={onToggleSimulation}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[12px] font-semibold transition-all ${
                  simulationActive 
                    ? "bg-[#EF4444] text-white hover:bg-[#DC2626]" 
                    : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                }`}
              >
                {simulationActive ? "Stop Simulation" : "Start Simulation"}
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: '#27364B' }}>
            <span className="text-[12px] text-[#9CA3AF] font-medium">GAT-RL v2.4</span>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-[#374151]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[12px] font-medium" style={{ color: '#10B981' }}>System Online</span>
          </div>

          {user && (
            <button 
              onClick={handleLogout} 
              className="ml-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
