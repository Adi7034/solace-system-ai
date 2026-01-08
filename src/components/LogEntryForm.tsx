import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Droplets, Trash2 } from 'lucide-react';
import { PeriodLog } from '@/hooks/usePeriodLogs';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface LogEntryFormProps {
  date: Date;
  existingLog?: PeriodLog;
  onSave: (log: Omit<PeriodLog, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function LogEntryForm({ date, existingLog, onSave, onDelete, onClose }: LogEntryFormProps) {
  const { t } = useTranslation();

  const FLOW_OPTIONS = [
    { value: 'spotting', labelKey: 'form.spotting', intensity: 1 },
    { value: 'light', labelKey: 'form.light', intensity: 2 },
    { value: 'medium', labelKey: 'form.medium', intensity: 3 },
    { value: 'heavy', labelKey: 'form.heavy', intensity: 4 },
  ] as const;

  const MOOD_OPTIONS = [
    'mood.happy', 'mood.calm', 'mood.sad', 'mood.irritable', 
    'mood.anxious', 'mood.tired', 'mood.loving', 'mood.low',
    'mood.grateful', 'mood.overwhelmed'
  ];

  const SYMPTOM_OPTIONS = [
    'symptom.cramps', 'symptom.headache', 'symptom.bloating', 'symptom.backPain',
    'symptom.breastTenderness', 'symptom.fatigue', 'symptom.nausea', 'symptom.acne',
    'symptom.cravings', 'symptom.insomnia', 'symptom.hotFlashes', 'symptom.moodSwings'
  ];

  const [flow, setFlow] = useState<typeof FLOW_OPTIONS[number]['value'] | null>(
    existingLog?.flow_intensity || null
  );
  const [moods, setMoods] = useState<string[]>(existingLog?.moods || []);
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms || []);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  const toggleMood = (mood: string) => {
    setMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const handleSave = () => {
    onSave({
      log_date: format(date, 'yyyy-MM-dd'),
      flow_intensity: flow,
      moods,
      symptoms,
      notes: notes.trim() || null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          {format(date, 'EEEE, MMMM d')}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Flow Intensity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Droplets className="w-4 h-4 text-primary" />
          {t('form.flowIntensity')}
        </label>
        <div className="flex gap-2">
          {FLOW_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFlow(flow === option.value ? null : option.value)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                flow === option.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('form.howFeeling')}</label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((moodKey) => {
            const moodText = t(moodKey);
            return (
              <button
                key={moodKey}
                onClick={() => toggleMood(moodText)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  moods.includes(moodText)
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {moodText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('form.anySymptoms')}</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map((symptomKey) => {
            const symptomText = t(symptomKey);
            return (
              <button
                key={symptomKey}
                onClick={() => toggleSymptom(symptomText)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  symptoms.includes(symptomText)
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {symptomText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('form.notes')}</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('form.notesPlaceholder')}
          className="resize-none bg-muted/30"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {onDelete && (
          <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
          {t('form.save')}
        </Button>
      </div>
    </motion.div>
  );
}
