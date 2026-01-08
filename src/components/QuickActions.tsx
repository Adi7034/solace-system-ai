import { motion } from 'framer-motion';
import { Heart, Wind, Moon, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onSelect: (message: string) => void;
  disabled: boolean;
}

const actions = [
  { icon: Wind, label: 'Breathing Exercise', message: "I'd like to do a breathing exercise to calm down" },
  { icon: Heart, label: 'Stress Relief', message: "I'm feeling stressed and need some support" },
  { icon: Flower2, label: 'Period Care', message: "I'm on my period and need some comfort tips" },
  { icon: Moon, label: 'Just Talk', message: "I just need someone to listen right now" },
];

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(action.message)}
            disabled={disabled}
            className="gap-2 rounded-full border-rose-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
          >
            <action.icon className="h-4 w-4 text-rose-400" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
