import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { MoodEntry } from '@/hooks/useMoodEntries';

interface MoodChartProps {
  data: MoodEntry[];
}

export function MoodChart({ data }: MoodChartProps) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    return data.map(entry => ({
      date: format(parseISO(entry.entry_date), 'MMM d'),
      mood: entry.mood_score,
      energy: entry.energy_level || null,
      sleep: entry.sleep_quality || null,
      label: entry.mood_label,
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-3">📊</span>
        <p className="text-muted-foreground">{t('mood.noDataChart')}</p>
        <p className="text-sm text-muted-foreground mt-1">{t('mood.startLogging')}</p>
      </div>
    );
  }

  if (data.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-4xl mb-3">📈</span>
        <p className="text-muted-foreground">{t('mood.needMore')}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t('mood.entriesCount', { count: data.length })}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => ['😢', '😔', '😐', '🙂', '😊'][value - 1]}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-sm">{data.date}</p>
                    <p className="text-sm text-muted-foreground">
                      Mood: {['😢', '😔', '😐', '🙂', '😊'][data.mood - 1]} {data.label}
                    </p>
                    {data.energy && (
                      <p className="text-sm text-muted-foreground">
                        Energy: ⚡ {data.energy}/5
                      </p>
                    )}
                    {data.sleep && (
                      <p className="text-sm text-muted-foreground">
                        Sleep: 😴 {data.sleep}/5
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#moodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
