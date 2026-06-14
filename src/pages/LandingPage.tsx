import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-center" style={{ backgroundColor: '#060B18', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Background Cinematic Image generated based on the user's prompt */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img 
          src="/hero_scene.png" 
          alt="Cold Chain Wise Cinematic Scene" 
          className="w-full h-full object-cover object-center lg:object-right mix-blend-screen" 
        />
        {/* Subtle left-side gradient to ensure UI text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060B18] via-[#060B18]/70 to-transparent w-full lg:w-1/2"></div>
      </motion.div>

      {/* Main Content Overlay - Restricted to left 40-50% */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-12 w-full">
        <div className="w-full lg:w-[45%] max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Badge */}
            <div 
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase mb-8"
              style={{ 
                backgroundColor: 'rgba(29, 111, 232, 0.15)', 
                color: '#4DCFFF', 
                border: '1px solid rgba(77, 207, 255, 0.3)' 
              }}
            >
              AI-Powered Fleet Management
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-[#E8F4FF]">
              Cold Chain <span style={{ color: '#1D6FE8' }}>Wise</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl leading-relaxed mb-10 font-light" style={{ color: '#B0BEC5' }}>
              Ensure fresh produce and critical medicines arrive with zero spoilage. Advanced route optimization using real-time subsurface temperature telemetry.
            </p>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all group"
              style={{
                backgroundColor: '#1D6FE8',
                color: '#E8F4FF',
                boxShadow: '0 8px 32px rgba(29, 111, 232, 0.4)'
              }}
            >
              Launch Command Center
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: '#4DCFFF' }} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
