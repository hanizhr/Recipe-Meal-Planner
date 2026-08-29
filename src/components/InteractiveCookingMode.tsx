import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Timer, 
  Sparkles,
  Volume2,
  VolumeX,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types';

interface InteractiveCookingModeProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  servings: number;
}

export const InteractiveCookingMode: React.FC<InteractiveCookingModeProps> = ({
  recipe,
  isOpen,
  onClose,
  servings,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = recipe.instructions;
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Initialize or reset timer when switching steps
  useEffect(() => {
    if (currentStep && currentStep.durationMinutes && currentStep.durationMinutes > 0) {
      setTimerSecondsLeft(currentStep.durationMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSecondsLeft(null);
      setIsTimerRunning(false);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [currentStepIndex, currentStep]);

  // Handle timer countdown
  useEffect(() => {
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // Play alert sound / trigger step completion
            if (soundEnabled) {
              try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
              } catch (e) {
                // audio not allowed
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSecondsLeft, soundEnabled]);

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps((prev) => 
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep.stepNumber)) {
      toggleStepCompleted(currentStep.stepNumber);
    }

    if (isLastStep) {
      // Trigger festive celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5E3A', '#FFA726', '#4CAF50', '#29B6F6', '#AB47BC']
      });
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0B0C10]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#252834] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5E3A]/20 border border-[#FF5E3A]/30 flex items-center justify-center text-[#FF5E3A]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#FF5E3A] uppercase tracking-wider">Live Cooking Assistant</span>
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate max-w-xs sm:max-w-md">
                {recipe.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-full bg-[#1A1C24] hover:bg-[#252834] text-gray-300 hover:text-white transition-colors"
              title={soundEnabled ? "Sound Alert Enabled" : "Muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FF5E3A]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#1A1C24] hover:bg-[#252834] text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2 bg-[#1A1C24] rounded-full overflow-hidden flex gap-1">
            {steps.map((s, idx) => (
              <div
                key={s.stepNumber}
                className={`flex-1 h-full rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex ? 'bg-[#FF5E3A]' : 'bg-[#252834]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Center Main Step Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full my-4">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#161822] border border-[#252834] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Step Number Tag */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FF5E3A] text-white shadow-md shadow-[#FF5E3A]/20">
                STEP {currentStep.stepNumber.toString().padStart(2, '0')}
              </span>

              <button
                onClick={() => toggleStepCompleted(currentStep.stepNumber)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  completedSteps.includes(currentStep.stepNumber)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#252834] text-gray-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedSteps.includes(currentStep.stepNumber) ? 'Marked Done' : 'Mark as Done'}
              </button>
            </div>

            {/* Step Title & Instruction */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
                {currentStep.title}
              </h3>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium">
                {currentStep.instruction}
              </p>
            </div>

            {/* Step Duration & Interactive Timer if applicable */}
            {timerSecondsLeft !== null && (
              <div className="bg-[#1E202B] rounded-2xl p-4 sm:p-5 border border-[#2F3342] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center">
                    <Timer className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold">{currentStep.timerLabel || 'Step Timer'}</span>
                    <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
                      {formatTimer(timerSecondsLeft)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="cooking-timer-toggle-btn"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ${
                      isTimerRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-black'
                        : 'bg-[#FF5E3A] hover:bg-[#FF7043] text-white shadow-[#FF5E3A]/30'
                    }`}
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Start Timer
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft((currentStep.durationMinutes || 5) * 60);
                    }}
                    className="p-2.5 rounded-full bg-[#252834] hover:bg-[#2F3342] text-gray-300 hover:text-white transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-4 pt-4 border-t border-[#252834]">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-[#1A1C24] text-gray-500'
                : 'bg-[#1A1C24] hover:bg-[#252834] text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            id="cooking-next-step-btn"
            onClick={handleNext}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-extrabold text-sm shadow-xl shadow-[#FF5E3A]/30 transition-all hover:scale-105 active:scale-95"
          >
            {isLastStep ? (
              <>
                <Sparkles className="w-4 h-4" /> Finish Cooking!
              </>
            ) : (
              <>
                Next Step <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
