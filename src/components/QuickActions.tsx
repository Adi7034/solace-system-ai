import { motion } from 'framer-motion';
import { Heart, Wind, Moon, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface QuickActionsProps {
  onSelect: (message: string) => void;
  disabled: boolean;
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  const { t } = useTranslation();

  const actions = [
    { icon: Wind, labelKey: 'action.breathing', messageKey: 'action.breathing.msg' },
    { icon: Heart, labelKey: 'action.stress', messageKey: 'action.stress.msg' },
    { icon: Flower2, labelKey: 'action.period', messageKey: 'action.period.msg' },
    { icon: Moon, labelKey: 'action.talk', messageKey: 'action.talk.msg' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map((action, index) => (
        <motion.div
          key={action.labelKey}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(t(action.messageKey))}
            disabled={disabled}
            className="gap-2 rounded-full border-rose-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
          >
            <action.icon className="h-4 w-4 text-rose-400" />
            {t(action.labelKey)}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
