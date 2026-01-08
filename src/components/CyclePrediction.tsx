import { useMemo } from 'react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { PeriodLog } from '@/hooks/usePeriodLogs';

interface CyclePredictionProps {
  logs: PeriodLog[];
}

export function CyclePrediction({ logs }: CyclePredictionProps) {
  const prediction = useMemo(() => {
    // Get logs with flow (period days)
    const periodLogs = logs
      .filter(l => l.flow_intensity && l.flow_intensity !== 'spotting')
      .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    if (periodLogs.length < 2) {
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

    if (periodStarts.length < 2) {
      return null;
    }

    // Calculate average cycle length from the last few cycles
    const cycleLengths: number[] = [];
    for (let i = 1; i < periodStarts.length; i++) {
      const length = differenceInDays(periodStarts[i], periodStarts[i - 1]);
      if (length >= 21 && length <= 45) { // Reasonable cycle length
        cycleLengths.push(length);
      }
    }

    if (cycleLengths.length === 0) {
      return null;
    }

    const avgCycleLength = Math.round(
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    );

    const lastPeriodStart = periodStarts[periodStarts.length - 1];
    const nextPeriodDate = addDays(lastPeriodStart, avgCycleLength);
    const daysUntil = differenceInDays(nextPeriodDate, new Date());

    return {
      avgCycleLength,
      nextPeriodDate,
      daysUntil,
      cyclesTracked: periodStarts.length,
      lastPeriodStart,
    };
  }, [logs]);

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
            <h3 className="font-medium text-foreground">Cycle Prediction</h3>
            <p className="text-xs text-muted-foreground">Track 2+ periods to see predictions</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Log your period days and I'll learn your cycle to predict your next period! 💜
        </p>
      </motion.div>
    );
  }

  const { avgCycleLength, nextPeriodDate, daysUntil, cyclesTracked } = prediction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Cycle Prediction</h3>
          <p className="text-xs text-muted-foreground">Based on {cyclesTracked} cycles</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Next Period</span>
          </div>
          <p className="font-semibold text-foreground">
            {format(nextPeriodDate, 'MMM d')}
          </p>
          <p className="text-xs text-muted-foreground">
            {daysUntil <= 0 
              ? daysUntil === 0 
                ? 'Today!' 
                : `${Math.abs(daysUntil)} days ago`
              : `in ${daysUntil} days`}
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Avg Cycle</span>
          </div>
          <p className="font-semibold text-foreground">{avgCycleLength} days</p>
          <p className="text-xs text-muted-foreground">Your average</p>
        </div>
      </div>

      {daysUntil <= 3 && daysUntil >= 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-2 rounded-lg bg-primary/10 text-center"
        >
          <p className="text-sm text-primary font-medium">
            {daysUntil === 0 ? "Period expected today! 🌸" : `Period coming in ${daysUntil} day${daysUntil > 1 ? 's' : ''}! 🌸`}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
