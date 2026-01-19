import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const BODY_PARTS = [
  'hands',
  'arms', 
  'shoulders',
  'face',
  'chest',
  'stomach',
  'legs',
  'feet',
];

export function MuscleRelaxation() {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'relax'>('tense');
  const [timeLeft, setTimeLeft] = useState(5);
  const [isComplete, setIsComplete] = useState(false);

  const currentPart = BODY_PARTS[currentPartIndex];

  useEffect(() => {
    if (!isActive || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'tense') {
            setPhase('relax');
            return 10; // Relax for 10 seconds
          } else {
            // Move to next body part
            if (currentPartIndex < BODY_PARTS.length - 1) {
              setCurrentPartIndex(currentPartIndex + 1);
              setPhase('tense');
              return 5;
            } else {
              setIsComplete(true);
              setIsActive(false);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, currentPartIndex, isComplete]);

  const reset = () => {
    setIsActive(false);
    setCurrentPartIndex(0);
    setPhase('tense');
    setTimeLeft(5);
    setIsComplete(false);
  };

  const progress = ((currentPartIndex + (phase === 'relax' ? 0.5 : 0)) / BODY_PARTS.length) * 100;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 my-3 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t('exercise.muscle.title')}</h3>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={`${currentPartIndex}-${phase}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                scale: phase === 'tense' ? [1, 1.1, 1] : 1,
                opacity: phase === 'relax' ? [1, 0.7, 1] : 1
              }}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-lg ${
                phase === 'tense' 
                  ? 'bg-gradient-to-br from-red-400 to-orange-500' 
                  : 'bg-gradient-to-br from-green-400 to-teal-500'
              }`}
            >
              <span className="text-2xl font-bold">{isActive ? timeLeft : '-'}</span>
            </motion.div>

            <p className="text-lg font-semibold text-foreground mb-1 capitalize">
              {t(`exercise.muscle.${currentPart}` as any)}
            </p>
            <p className={`text-sm font-medium mb-6 ${phase === 'tense' ? 'text-orange-500' : 'text-green-500'}`}>
              {phase === 'tense' ? t('exercise.muscle.tense') : t('exercise.muscle.relax')}
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsActive(!isActive)}
                variant="default"
                size="sm"
                className="gap-2"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isActive ? t('exercise.pause') : t('exercise.start')}
              </Button>
              <Button onClick={reset} variant="outline" size="sm" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t('exercise.reset')}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white mb-4"
            >
              ✨
            </motion.div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {t('exercise.muscle.complete')}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {t('exercise.muscle.completeMessage')}
            </p>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {t('exercise.tryAgain')}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
