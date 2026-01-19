import { useMemo, useState, useEffect } from 'react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Clock, AlertTriangle, Edit2, Check, X } from 'lucide-react';
import { PeriodLog } from '@/hooks/usePeriodLogs';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CyclePredictionProps {
  logs: PeriodLog[];
}

// Store custom predicted date in localStorage
const CUSTOM_PREDICTION_KEY = 'mindphase_custom_prediction';

export function CyclePrediction({ logs }: CyclePredictionProps) {
  const { t } = useTranslation();
  const [customNextDate, setCustomNextDate] = useState<Date | null>(null);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>();

  // Load custom date from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_PREDICTION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date) {
          setCustomNextDate(new Date(parsed.date));
        }
      } catch (e) {
        console.error('Error parsing saved prediction:', e);
      }
    }
  }, []);

  const prediction = useMemo(() => {
    // Get logs with flow (period days)
    const periodLogs = logs
      .filter(l => l.flow_intensity && l.flow_intensity !== 'spotting')
      .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    if (periodLogs.length < 1) {
      return null;
    }

    // Find period start dates (first day of each period)
    const periodStarts: Date[] = [];
    let lastDate: Date | null = null;

    for (const log of periodLogs) {
      const logDate = parseISO(log.log_date);
      
      // If this is the first log or more than 5 days after last, it's a new period
      if (!lastDate || differenceInDays(logDate, lastDate) > 5) {
        periodStarts.push(logDate);
      }
      lastDate = logDate;
    }

    if (periodStarts.length === 0) {
      return null;
    }

    // Calculate cycle lengths between periods
    const cycleLengths: number[] = [];
    for (let i = 1; i < periodStarts.length; i++) {
      const length = differenceInDays(periodStarts[i], periodStarts[i - 1]);
      if (length >= 15 && length <= 60) { // Reasonable cycle length
        cycleLengths.push(length);
      }
    }

    // Calculate average (default to 28 if no data)
    const avgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;

    const lastPeriodStart = periodStarts[periodStarts.length - 1];
    const calculatedNextDate = addDays(lastPeriodStart, avgCycleLength);

    // Calculate irregularity
    let irregularityScore = 0;
    let isIrregular = false;
    let irregularityMessage = '';

    if (cycleLengths.length >= 2) {
      // Calculate standard deviation
      const variance = cycleLengths.reduce((sum, len) => {
        return sum + Math.pow(len - avgCycleLength, 2);
      }, 0) / cycleLengths.length;
      const stdDev = Math.sqrt(variance);
      
      irregularityScore = stdDev;

      // Check for irregularity (std dev > 7 days is considered irregular)
      if (stdDev > 7) {
        isIrregular = true;
        irregularityMessage = 'high';
      } else if (stdDev > 4) {
        irregularityMessage = 'moderate';
      }

      // Also check for recent irregularity
      if (cycleLengths.length >= 2) {
        const recentLengths = cycleLengths.slice(-3);
        const recentVariations = recentLengths.map((len, i) => 
          i > 0 ? Math.abs(len - recentLengths[i - 1]) : 0
        ).filter(v => v > 0);
        
        const hasRecentIrregularity = recentVariations.some(v => v > 7);
        if (hasRecentIrregularity && !isIrregular) {
          isIrregular = true;
          irregularityMessage = 'recent';
        }
      }
    }

    return {
      avgCycleLength,
      calculatedNextDate,
      cyclesTracked: periodStarts.length,
      lastPeriodStart,
      cycleLengths,
      isIrregular,
      irregularityScore,
      irregularityMessage,
    };
  }, [logs]);

  // Use custom date if set, otherwise use calculated
  const nextPeriodDate = customNextDate || prediction?.calculatedNextDate;
  const daysUntil = nextPeriodDate ? differenceInDays(nextPeriodDate, new Date()) : null;

  const handleSaveCustomDate = () => {
    if (tempDate) {
      setCustomNextDate(tempDate);
      localStorage.setItem(CUSTOM_PREDICTION_KEY, JSON.stringify({ date: tempDate.toISOString() }));
    }
    setIsEditingDate(false);
  };

  const handleResetToCalculated = () => {
    setCustomNextDate(null);
    localStorage.removeItem(CUSTOM_PREDICTION_KEY);
    setIsEditingDate(false);
  };

  if (!prediction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-4 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{t('prediction.title')}</h3>
            <p className="text-xs text-muted-foreground">{t('prediction.trackMore')}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('prediction.logPeriod')}
        </p>
      </motion.div>
    );
  }

  const { avgCycleLength, cyclesTracked, isIrregular, irregularityMessage } = prediction;

  const getDaysUntilText = () => {
    if (daysUntil === null) return '';
    if (daysUntil === 0) return t('prediction.today');
    if (daysUntil < 0) return t('prediction.daysAgo', { count: Math.abs(daysUntil) });
    return t('prediction.inDays', { count: daysUntil });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{t('prediction.title')}</h3>
          <p className="text-xs text-muted-foreground">{t('prediction.basedOn', { count: cyclesTracked })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Next Period - Editable */}
        <div className="bg-muted/50 rounded-xl p-3 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{t('prediction.nextPeriod')}</span>
            </div>
            <Popover open={isEditingDate} onOpenChange={setIsEditingDate}>
              <PopoverTrigger asChild>
                <button 
                  onClick={() => setTempDate(nextPeriodDate || new Date())}
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Edit date"
                >
                  <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">{t('prediction.adjustDate')}</p>
                  <p className="text-xs text-muted-foreground">{t('prediction.cycleVaries')}</p>
                </div>
                <CalendarPicker
                  mode="single"
                  selected={tempDate}
                  onSelect={setTempDate}
                  className="p-3 pointer-events-auto"
                  initialFocus
                />
                <div className="p-3 border-t border-border flex gap-2 justify-end">
                  {customNextDate && (
                    <Button size="sm" variant="ghost" onClick={handleResetToCalculated}>
                      {t('prediction.reset')}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingDate(false)}>
                    <X className="w-3 h-3 mr-1" /> {t('prediction.cancel')}
                  </Button>
                  <Button size="sm" onClick={handleSaveCustomDate}>
                    <Check className="w-3 h-3 mr-1" /> {t('prediction.save')}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {nextPeriodDate && (
            <>
              <p className="font-semibold text-foreground">
                {format(nextPeriodDate, 'MMM d')}
              </p>
              <p className="text-xs text-muted-foreground">
                {getDaysUntilText()}
              </p>
              {customNextDate && (
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/50 text-accent-foreground">
                  {t('prediction.custom')}
                </span>
              )}
            </>
          )}
        </div>

        {/* Average Cycle */}
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">{t('prediction.avgCycle')}</span>
          </div>
          <p className="font-semibold text-foreground">{t('prediction.days', { count: avgCycleLength })}</p>
          <p className="text-xs text-muted-foreground">{t('prediction.yourAverage')}</p>
        </div>
      </div>

      {/* Irregularity Warning */}
      <AnimatePresence>
        {isIrregular && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  {irregularityMessage === 'high' 
                    ? t('prediction.irregularHigh')
                    : irregularityMessage === 'recent'
                    ? t('prediction.irregularRecent')
                    : t('prediction.irregularModerate')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {irregularityMessage === 'high' 
                    ? t('prediction.irregularHighDesc')
                    : irregularityMessage === 'recent'
                    ? t('prediction.irregularRecentDesc')
                    : t('prediction.irregularModerateDesc')}
                </p>
                <p className="text-xs text-primary mt-2">
                  {t('prediction.editTip')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Alert */}
      {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2 rounded-lg bg-primary/10 text-center"
        >
          <p className="text-sm text-primary font-medium">
            {daysUntil === 0 
              ? t('prediction.expectedToday') 
              : t('prediction.comingIn', { count: daysUntil, s: daysUntil > 1 ? 's' : '' })}
          </p>
        </motion.div>
      )}

      {/* Cycle History (if enough data) */}
      {prediction.cycleLengths.length >= 2 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">{t('prediction.recentCycleLengths')}</p>
          <div className="flex gap-2 flex-wrap">
            {prediction.cycleLengths.slice(-5).map((length, i) => (
              <span 
                key={i}
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  Math.abs(length - avgCycleLength) > 7 
                    ? "bg-amber-500/20 text-amber-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {t('prediction.daysLabel', { count: length })}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
