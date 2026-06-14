import { Snowflake, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
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
  // keeping these props to not break parent, but not showing simulation buttons in header anymore as requested
}: HeaderProps) => {
  const { user } = useAuth();
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
    <header className="h-[56px] bg-[#1B2E6B] w-full flex items-center shadow-sm z-50 sticky top-0">
      <div className="container flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-[#00B4D8]" />
          <div className="flex items-baseline">
            <span className="text-[#FFFFFF] text-[15px] font-[700] tracking-tight">GAT-RL</span>
            <span className="text-[#B8C8E8] text-[13px] font-[400] ml-1.5">Cold Chain Intelligence</span>
          </div>
        </div>

        {/* Centre: Nav Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#162558] p-1 rounded-full border border-[#2A3F6F]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
            return (
              <a
                key={item.name}
                href={item.path}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  isActive 
                    ? "bg-white text-[#1B2E6B] shadow-sm" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                onClick={(e) => e.preventDefault()} // dummy for now, rely on standard routing if implemented
              >
                {item.name}
              </a>
            )
          })}
        </nav>

        {/* Right: Status Badge & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 bg-white text-[#1B2E6B] text-[11px] font-bold rounded">
              v2.4
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              <span className="text-[#4ADE80] text-[12px] font-medium">System Online</span>
            </div>
          </div>
          
          {user && (
            <button 
              onClick={handleLogout} 
              className="text-white/60 hover:text-white p-1 rounded transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
