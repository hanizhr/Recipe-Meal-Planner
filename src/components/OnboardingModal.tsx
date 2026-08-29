import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Sparkles, Utensils } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-[32px] overflow-hidden bg-[#121318] border border-[#252834] shadow-2xl flex flex-col min-h-[620px]"
        >
          {/* Top Hero Photo with flame cooking effect */}
          <div className="relative h-72 w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
              alt="Culinary Searing"
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-black/40 to-black/20" />
            
            {/* Status bar mockup */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-white/80 font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5E3A]" />
                <span className="text-[10px] tracking-wider uppercase font-semibold">Live Preview</span>
              </div>
            </div>

            {/* Food thumbnail floating preview bubble matching mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute right-4 bottom-4 bg-[#1E2029]/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl flex items-center gap-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80" 
                alt="Grilled Skewers"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="pr-2">
                <p className="text-[11px] font-semibold text-white">Grilled Skewers</p>
                <p className="text-[9px] text-[#FF5E3A] font-medium">⭐ 4.9 • 15 min</p>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FF5E3A]/20 text-[#FF5E3A] border border-[#FF5E3A]/30">
                  Meal Planner & Recipes
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Cook. <br />
                Eat. <span className="inline-block animate-bounce">😋</span> <br />
                <span className="text-[#FF5E3A]">Better!</span>
              </h1>

              <p className="text-sm text-gray-400 leading-relaxed">
                Delicious recipes for every taste and skill level. Easy. Fun. Healthy. Integrated with weekly meal planning and smart grocery sync.
              </p>
            </div>

            {/* Bottom Swipe/Action Button matching mockup */}
            <div className="pt-6">
              <button
                id="onboarding-get-started-btn"
                onClick={onClose}
                className="w-full group relative flex items-center justify-between p-1.5 pr-5 rounded-full bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-semibold transition-all duration-300 shadow-lg shadow-[#FF5E3A]/30 active:scale-[0.98]"
              >
                <div className="w-11 h-11 rounded-full bg-[#0F1015] flex items-center justify-center text-white shadow-md">
                  <Check className="w-5 h-5 text-[#FF5E3A]" />
                </div>
                <span className="text-sm font-bold tracking-wide">Get Started</span>
                <div className="flex items-center -space-x-1 text-white/90 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </div>
              </button>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-gray-500">Offline Ready • Instant Synchronization</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
