import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { MoodEntry } from '@/hooks/useMoodEntries';
import { format } from 'date-fns';

interface MoodEntryFormProps {
  date: string;
  existingEntry?: MoodEntry;
  onSave: (entry: MoodEntry) => void;
  onDelete: () => void;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { score: 1, label: 'Awful', emoji: '😢' },
  { score: 2, label: 'Bad', emoji: '😔' },
  { score: 3, label: 'Okay', emoji: '😐' },
  { score: 4, label: 'Good', emoji: '🙂' },
  { score: 5, label: 'Great', emoji: '😊' },
];

export function MoodEntryForm({ date, existingEntry, onSave, onDelete, onClose }: MoodEntryFormProps) {
  const { t } = useTranslation();
  const [moodScore, setMoodScore] = useState(existingEntry?.mood_score || 3);
  const [moodLabel, setMoodLabel] = useState(existingEntry?.mood_label || 'Okay');
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [energyLevel, setEnergyLevel] = useState(existingEntry?.energy_level || 0);
  const [sleepQuality, setSleepQuality] = useState(existingEntry?.sleep_quality || 0);

  useEffect(() => {
    if (existingEntry) {
      setMoodScore(existingEntry.mood_score);
      setMoodLabel(existingEntry.mood_label);
      setNotes(existingEntry.notes || '');
      setEnergyLevel(existingEntry.energy_level || 0);
      setSleepQuality(existingEntry.sleep_quality || 0);
    } else {
      setMoodScore(3);
      setMoodLabel('Okay');
      setNotes('');
      setEnergyLevel(0);
      setSleepQuality(0);
    }
  }, [existingEntry, date]);

  const handleMoodSelect = (score: number, label: string) => {
    setMoodScore(score);
    setMoodLabel(label);
  };

  const handleSave = () => {
    onSave({
      entry_date: date,
      mood_score: moodScore,
      mood_label: moodLabel,
      notes: notes || undefined,
      energy_level: energyLevel || undefined,
      sleep_quality: sleepQuality || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{t('mood.logEntry')}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">
          {t('mood.howFeeling')}
        </label>
        <div className="flex justify-between gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.score}
              onClick={() => handleMoodSelect(mood.score, mood.label)}
              className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                moodScore === mood.score
                  ? 'bg-primary/20 border-2 border-primary scale-105'
                  : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{t(`mood.${mood.label.toLowerCase()}`) || mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="mb-5">
        <label className="text-sm font-medium text-foreground mb-2 block">
          {t('mood.energyLevel')} ⚡
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setEnergyLevel(energyLevel === level ? 0 : level)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                energyLevel === level
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="mb-5">
        <label className="text-sm font-medium text-foreground mb-2 block">
          {t('mood.sleepQuality')} 😴
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setSleepQuality(sleepQuality === level ? 0 : level)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                sleepQuality === level
                  ? 'bg-blue-400 text-blue-900'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <label className="text-sm font-medium text-foreground mb-2 block">
          {t('mood.notes')}
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('mood.notesPlaceholder')}
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {t('form.save')}
        </Button>
        {existingEntry && (
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
