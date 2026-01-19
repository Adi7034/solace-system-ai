import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, BellRing, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

const REMINDER_STORAGE_KEY = 'mindphase_period_reminders';

interface ReminderSettings {
  enabled: boolean;
  daysBefore: number[];
}

interface PeriodReminderProps {
  nextPeriodDate: Date | null;
}

export function PeriodReminder({ nextPeriodDate }: PeriodReminderProps) {
  const { t } = useTranslation();
  const { permission, isSupported, requestPermission, showNotification } = useNotifications();
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { enabled: false, daysBefore: [1, 3] };
      }
    }
    return { enabled: false, daysBefore: [1, 3] };
  });
  const [showSettings, setShowSettings] = useState(false);
  const [lastNotifiedKey, setLastNotifiedKey] = useState<string | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Check and show notification when appropriate
  useEffect(() => {
    if (!settings.enabled || !nextPeriodDate || permission !== 'granted') return;

    const now = new Date();
    const daysUntil = Math.ceil((nextPeriodDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create a unique key for this notification check
    const notificationKey = `${nextPeriodDate.toISOString()}-${daysUntil}`;
    
    // Don't repeat notification for the same day/date combination
    if (lastNotifiedKey === notificationKey) return;

    // Check if we should notify
    if (settings.daysBefore.includes(daysUntil)) {
      const title = daysUntil === 0 
        ? t('reminder.periodToday') 
        : daysUntil === 1 
        ? t('reminder.periodTomorrow')
        : t('reminder.periodIn', { count: daysUntil });
      
      const body = t('reminder.prepareBody');
      
      showNotification(title, { body, tag: 'period-reminder' });
      setLastNotifiedKey(notificationKey);
      
      // Also show a toast in-app
      toast.info(title, { description: body });
    }
  }, [nextPeriodDate, settings, permission, showNotification, lastNotifiedKey, t]);

  const handleEnableReminders = async () => {
    if (permission === 'granted') {
      setSettings(prev => ({ ...prev, enabled: true }));
      toast.success(t('reminder.enabled'));
    } else {
      const granted = await requestPermission();
      if (granted) {
        setSettings(prev => ({ ...prev, enabled: true }));
        toast.success(t('reminder.enabled'));
      } else {
        toast.error(t('reminder.permissionDenied'));
      }
    }
  };

  const toggleDayBefore = (day: number) => {
    setSettings(prev => ({
      ...prev,
      daysBefore: prev.daysBefore.includes(day)
        ? prev.daysBefore.filter(d => d !== day)
        : [...prev.daysBefore, day].sort((a, b) => b - a),
    }));
  };

  if (!isSupported) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            settings.enabled ? 'bg-primary/20' : 'bg-muted'
          }`}>
            {settings.enabled ? (
              <BellRing className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{t('reminder.title')}</h3>
            <p className="text-xs text-muted-foreground">
              {settings.enabled ? t('reminder.activeStatus') : t('reminder.inactiveStatus')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {settings.enabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? <X className="w-4 h-4" /> : t('reminder.customize')}
            </Button>
          )}
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => {
              if (checked) {
                handleEnableReminders();
              } else {
                setSettings(prev => ({ ...prev, enabled: false }));
                toast.info(t('reminder.disabled'));
              }
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showSettings && settings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-3">{t('reminder.notifyMe')}</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 5, 7].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDayBefore(day)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    settings.daysBefore.includes(day)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {day === 0 ? t('reminder.onDay') : t('reminder.daysBefore', { count: day })}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {permission === 'denied' && (
        <p className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
          {t('reminder.browserBlocked')}
        </p>
      )}
    </motion.div>
  );
}
