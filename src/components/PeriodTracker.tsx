import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Droplets, Heart, Moon, ChevronLeft } from 'lucide-react';
import { usePeriodLogs, PeriodLog } from '@/hooks/usePeriodLogs';
import { LogEntryForm } from './LogEntryForm';
import { CyclePrediction } from './CyclePrediction';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface PeriodTrackerProps {
  onBack: () => void;
}

export function PeriodTracker({ onBack }: PeriodTrackerProps) {
  const { t } = useTranslation();
  const { logs, isLoading, saveLog, deleteLog, getLogByDate } = usePeriodLogs();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showForm, setShowForm] = useState(false);

  const selectedLog = selectedDate 
    ? getLogByDate(format(selectedDate, 'yyyy-MM-dd')) 
    : undefined;

  const handleSave = async (log: Omit<PeriodLog, 'id'>) => {
    await saveLog(log);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (selectedDate) {
      await deleteLog(format(selectedDate, 'yyyy-MM-dd'));
      setShowForm(false);
    }
  };

  const getDayContent = (day: Date) => {
    const log = getLogByDate(format(day, 'yyyy-MM-dd'));
    if (!log) return null;

    return (
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
        {log.flow_intensity && (
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            log.flow_intensity === 'heavy' && "bg-primary",
            log.flow_intensity === 'medium' && "bg-primary/70",
            log.flow_intensity === 'light' && "bg-primary/40",
            log.flow_intensity === 'spotting' && "bg-primary/20"
          )} />
        )}
        {log.moods.length > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-lavender" style={{ backgroundColor: 'hsl(280 40% 70%)' }} />
        )}
        {log.symptoms.length > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-sage" style={{ backgroundColor: 'hsl(150 30% 60%)' }} />
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-gradient-to-b from-rose-50 via-background to-purple-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Moon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{t('tracker.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('tracker.subtitle')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-4 shadow-sm"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              if (date) setShowForm(true);
            }}
            className="pointer-events-auto mx-auto"
            modifiers={{
              logged: logs.map(l => parseISO(l.log_date))
            }}
            modifiersStyles={{
              logged: { fontWeight: 'bold' }
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                  {getDayContent(date)}
                </div>
              )
            }}
          />
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-primary" />
              <span>{t('tracker.flow')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" style={{ color: 'hsl(280 40% 70%)' }} />
              <span>{t('tracker.mood')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: 'hsl(150 30% 60%)' }} />
              <span>{t('tracker.symptoms')}</span>
            </div>
          </div>
        </motion.div>

        {/* Cycle Prediction */}
        {!showForm && (
          <CyclePrediction logs={logs} />
        )}

        {/* Selected Date Info */}
        <AnimatePresence mode="wait">
          {showForm && selectedDate && (
            <LogEntryForm
              date={selectedDate}
              existingLog={selectedLog}
              onSave={handleSave}
              onDelete={selectedLog ? handleDelete : undefined}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Recent Logs */}
        {!showForm && logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="font-medium text-foreground">{t('tracker.recentLogs')}</h3>
            <div className="space-y-2">
              {logs.slice(0, 5).map((log) => (
                <button
                  key={log.id}
                  onClick={() => {
                    setSelectedDate(parseISO(log.log_date));
                    setShowForm(true);
                  }}
                  className="w-full bg-card rounded-xl border border-border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {format(parseISO(log.log_date), 'MMM d, yyyy')}
                    </span>
                    {log.flow_intensity && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                        {t(`form.${log.flow_intensity}`)}
                      </span>
                    )}
                  </div>
                  {(log.moods.length > 0 || log.symptoms.length > 0) && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {log.moods.slice(0, 3).map(mood => (
                        <span key={mood} className="text-xs px-1.5 py-0.5 rounded bg-accent/50 text-accent-foreground">
                          {mood}
                        </span>
                      ))}
                      {log.symptoms.slice(0, 2).map(symptom => (
                        <span key={symptom} className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
