import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MoodEntryForm } from '@/components/MoodEntryForm';
import { MoodChart } from '@/components/MoodChart';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';

interface MoodJournalProps {
  onBack: () => void;
}

export function MoodJournal({ onBack }: MoodJournalProps) {
  const { t } = useTranslation();
  const { entries, isLoading, saveEntry, deleteEntry, getEntriesForDays } = useMoodEntries();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const chartData = getEntriesForDays(14);
  const todayEntry = entries.find(e => e.entry_date === format(new Date(), 'yyyy-MM-dd'));

  const handleSave = async (entry: any) => {
    await saveEntry(entry);
    setShowForm(false);
  };

  const handleDelete = async () => {
    await deleteEntry(selectedDate);
    setShowForm(false);
  };

  const recentEntries = entries.slice(0, 7);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 via-background to-purple-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">{t('mood.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('mood.subtitle')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Today's Entry CTA */}
        {!todayEntry && !showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{t('mood.howToday')}</p>
                <p className="text-sm text-muted-foreground">{t('mood.logNow')}</p>
              </div>
              <Button 
                onClick={() => {
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                  setShowForm(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('mood.logMood')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Chart Section */}
        <AnimatePresence mode="wait">
          {!showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">{t('mood.patterns')}</h2>
                </div>
                <MoodChart data={chartData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entry Form */}
        <AnimatePresence mode="wait">
          {showForm && (
            <MoodEntryForm
              date={selectedDate}
              existingEntry={entries.find(e => e.entry_date === selectedDate)}
              onSave={handleSave}
              onDelete={handleDelete}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Recent Entries */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">{t('mood.recentEntries')}</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('mood.add')}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('mood.noEntries')}
              </p>
            ) : (
              <div className="space-y-2">
                {recentEntries.map((entry) => (
                  <motion.button
                    key={entry.entry_date}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      setSelectedDate(entry.entry_date);
                      setShowForm(true);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood_score)}</span>
                      <div>
                        <p className="font-medium text-sm">{entry.mood_label}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.entry_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {entry.energy_level && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          ⚡ {entry.energy_level}/5
                        </span>
                      )}
                      {entry.sleep_quality && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          😴 {entry.sleep_quality}/5
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function getMoodEmoji(score: number): string {
  switch (score) {
    case 1: return '😢';
    case 2: return '😔';
    case 3: return '😐';
    case 4: return '🙂';
    case 5: return '😊';
    default: return '😐';
  }
}
