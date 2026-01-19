import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Hand, Ear, Heart, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const STEPS = [
  { count: 5, sense: 'see', icon: Eye, color: 'from-blue-400 to-blue-600' },
  { count: 4, sense: 'touch', icon: Hand, color: 'from-green-400 to-green-600' },
  { count: 3, sense: 'hear', icon: Ear, color: 'from-purple-400 to-purple-600' },
  { count: 2, sense: 'smell', icon: Heart, color: 'from-pink-400 to-pink-600' },
  { count: 1, sense: 'taste', icon: Sparkles, color: 'from-amber-400 to-amber-600' },
];

export function GroundingExercise() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const step = STEPS[currentStep];
  const Icon = step?.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 my-3 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t('exercise.grounding.title')}</h3>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-lg`}
            >
              <Icon className="w-8 h-8" />
            </motion.div>

            <p className="text-2xl font-bold text-foreground mb-2">{step.count}</p>
            <p className="text-center text-muted-foreground mb-6">
              {t(`exercise.grounding.${step.sense}` as any)}
            </p>

            <Button onClick={handleNext} className="gap-2">
              {currentStep < STEPS.length - 1 ? (
                <>
                  {t('exercise.next')} <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                t('exercise.finish')
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white mb-4"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {t('exercise.grounding.complete')}
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {t('exercise.grounding.completeMessage')}
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
