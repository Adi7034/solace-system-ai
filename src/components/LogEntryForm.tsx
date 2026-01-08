import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Droplets, Trash2 } from 'lucide-react';
import { PeriodLog } from '@/hooks/usePeriodLogs';
import { cn } from '@/lib/utils';

interface LogEntryFormProps {
  date: Date;
  existingLog?: PeriodLog;
  onSave: (log: Omit<PeriodLog, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const FLOW_OPTIONS = [
  { value: 'spotting', label: 'Spotting', intensity: 1 },
  { value: 'light', label: 'Light', intensity: 2 },
  { value: 'medium', label: 'Medium', intensity: 3 },
  { value: 'heavy', label: 'Heavy', intensity: 4 },
] as const;

const MOOD_OPTIONS = [
  '😊 Happy', '😌 Calm', '😢 Sad', '😤 Irritable', 
  '😰 Anxious', '😴 Tired', '🥰 Loving', '😔 Low',
  '🤗 Grateful', '😵 Overwhelmed'
];

const SYMPTOM_OPTIONS = [
  'Cramps', 'Headache', 'Bloating', 'Back pain',
  'Breast tenderness', 'Fatigue', 'Nausea', 'Acne',
  'Cravings', 'Insomnia', 'Hot flashes', 'Mood swings'
];

export function LogEntryForm({ date, existingLog, onSave, onDelete, onClose }: LogEntryFormProps) {
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
          Flow Intensity
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
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Moods */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood}
              onClick={() => toggleMood(mood)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all",
                moods.includes(mood)
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Any symptoms?</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all",
                symptoms.includes(symptom)
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How's your day going? Any thoughts to capture..."
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
          Save Entry 💜
        </Button>
      </div>
    </motion.div>
  );
}
