import { useEffect, useState } from "react";

const TICKER_ITEMS = [
  { truck: "Truck #07", route: "Nashik → Mumbai", temp: "3°C", status: "✓ On-Time" },
  { truck: "Truck #14", route: "Mumbai → Pune", temp: "4°C", status: "✓ On-Time" },
  { truck: "Truck #23", route: "Delhi → Jaipur", temp: "6°C", status: "⚠ Delayed 12min" },
  { truck: "Truck #31", route: "Bangalore → Chennai", temp: "2°C", status: "✓ On-Time" },
  { truck: "Truck #09", route: "Hyderabad → Vizag", temp: "8°C", status: "⚠ Temp Warning" },
  { truck: "Truck #42", route: "Ahmedabad → Surat", temp: "3°C", status: "✓ On-Time" },
  { truck: "Truck #18", route: "Kolkata → Lucknow", temp: "5°C", status: "✓ On-Time" },
  { truck: "Truck #55", route: "Indore → Bhopal", temp: "4°C", status: "✓ On-Time" },
];

const LiveTicker = () => {
  const [items, setItems] = useState(TICKER_ITEMS);

  // Randomly update temps to feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => prev.map(item => {
        const tempShift = (Math.random() - 0.5) * 2;
        const newTemp = Math.max(1, Math.min(10, parseFloat(item.temp) + tempShift));
        const rounded = Math.round(newTemp);
        const status = rounded > 7 ? "⚠ Temp Warning" : rounded > 5 ? "⚠ Delayed" : "✓ On-Time";
        return { ...item, temp: `${rounded}°C`, status };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = items.map(item => {
    const isWarning = item.status.startsWith("⚠");
    return `${item.truck} — ${item.route} — ${item.temp} ${item.status}`;
  }).join("     •     ");

  // Duplicate for seamless loop
  const fullContent = `${tickerContent}     •     ${tickerContent}`;

  return (
    <div className="w-full overflow-hidden py-2.5 border-t" style={{ borderColor: '#2A3F6F', background: '#0F1E38' }}>
      <div className="flex items-center gap-3 px-4">
        <span className="flex-shrink-0 text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full" 
              style={{ background: '#10B98120', color: '#10B981', border: '1px solid #10B98130' }}>
          LIVE FEED
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll whitespace-nowrap text-xs font-mono" style={{ color: '#94A3B8' }}>
            {fullContent}
          </div>
        </div>
      </div>
      <style>{`
        .ticker-scroll {
          display: inline-block;
          animation: ticker-slide 45s linear infinite;
        }
        @keyframes ticker-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LiveTicker;
