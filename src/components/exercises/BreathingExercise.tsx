import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Breathe In' },
  { phase: 'hold1', duration: 4, label: 'Hold' },
  { phase: 'exhale', duration: 4, label: 'Breathe Out' },
  { phase: 'hold2', duration: 4, label: 'Hold' },
];

export function BreathingExercise() {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 4;

  const currentPhase = PHASES[currentPhaseIndex];

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(PHASES[0].duration);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
          setCurrentPhaseIndex(nextIndex);
          
          if (nextIndex === 0) {
            setCycles((c) => {
              if (c + 1 >= totalCycles) {
                setIsActive(false);
                return c + 1;
              }
              return c + 1;
            });
          }
          
          return PHASES[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhaseIndex]);

  const getCircleScale = () => {
    if (currentPhase.phase === 'inhale') return 1.3;
    if (currentPhase.phase === 'exhale') return 0.8;
    return 1;
  };

  const getPhaseColor = () => {
    switch (currentPhase.phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold1': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-emerald-400';
      case 'hold2': return 'from-amber-400 to-orange-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 my-3 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t('exercise.breathing.title')}</h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Breathing Circle */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <motion.div
            animate={{ 
              scale: isActive ? getCircleScale() : 1,
            }}
            transition={{ 
              duration: currentPhase.duration,
              ease: currentPhase.phase === 'inhale' || currentPhase.phase === 'exhale' ? 'easeInOut' : 'linear'
            }}
            className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-30`}
          />
          <motion.div
            animate={{ 
              scale: isActive ? getCircleScale() : 1,
            }}
            transition={{ 
              duration: currentPhase.duration,
              ease: currentPhase.phase === 'inhale' || currentPhase.phase === 'exhale' ? 'easeInOut' : 'linear'
            }}
            className={`absolute w-24 h-24 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-50`}
          />
          <motion.div
            animate={{ 
              scale: isActive ? getCircleScale() : 1,
            }}
            transition={{ 
              duration: currentPhase.duration,
              ease: currentPhase.phase === 'inhale' || currentPhase.phase === 'exhale' ? 'easeInOut' : 'linear'
            }}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
          >
            {isActive ? timeLeft : '4'}
          </motion.div>
        </div>

        {/* Phase Label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase.phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-foreground mb-2"
          >
            {isActive ? currentPhase.label : t('exercise.breathing.ready')}
          </motion.p>
        </AnimatePresence>

        {/* Cycle Progress */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: totalCycles }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < cycles ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="default"
            size="sm"
            className="gap-2"
            disabled={cycles >= totalCycles}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? t('exercise.pause') : cycles >= totalCycles ? t('exercise.complete') : t('exercise.start')}
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t('exercise.reset')}
          </Button>
        </div>

        {cycles >= totalCycles && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm text-primary font-medium"
          >
            ✨ {t('exercise.breathing.complete')}
          </motion.p>
        )}
      </div>
    </div>
  );
}
