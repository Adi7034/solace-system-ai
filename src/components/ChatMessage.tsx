import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import type { Message } from '@/hooks/useChat';
import { BreathingExercise } from './exercises/BreathingExercise';
import { GroundingExercise } from './exercises/GroundingExercise';
import { MuscleRelaxation } from './exercises/MuscleRelaxation';

interface ChatMessageProps {
  message: Message;
}

// Parse content and extract exercise markers
function parseMessageContent(content: string) {
  const parts: { type: 'text' | 'breathing' | 'grounding' | 'muscle'; content?: string }[] = [];
  
  const exerciseMarkers = [
    { marker: '[BREATHING_EXERCISE]', type: 'breathing' as const },
    { marker: '[GROUNDING_EXERCISE]', type: 'grounding' as const },
    { marker: '[MUSCLE_RELAXATION]', type: 'muscle' as const },
  ];

  let remainingContent = content;
  
  exerciseMarkers.forEach(({ marker, type }) => {
    if (remainingContent.includes(marker)) {
      const [before, after] = remainingContent.split(marker);
      if (before.trim()) {
        parts.push({ type: 'text', content: before.trim() });
      }
      parts.push({ type });
      remainingContent = after || '';
    }
  });
  
  if (remainingContent.trim()) {
    parts.push({ type: 'text', content: remainingContent.trim() });
  }
  
  // If no exercises found, return original content
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }
  
  return parts;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const parts = isUser ? [{ type: 'text' as const, content: message.content }] : parseMessageContent(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-rose-400 to-purple-500 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? '' : 'flex flex-col gap-2'}`}>
        {parts.map((part, index) => {
          if (part.type === 'text' && part.content) {
            return (
              <div
                key={index}
                className={`rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{part.content}</p>
              </div>
            );
          }
          if (part.type === 'breathing') {
            return <BreathingExercise key={index} />;
          }
          if (part.type === 'grounding') {
            return <GroundingExercise key={index} />;
          }
          if (part.type === 'muscle') {
            return <MuscleRelaxation key={index} />;
          }
          return null;
        })}
      </div>
    </motion.div>
  );
}
