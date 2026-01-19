import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Copy, Check, Pencil, X } from 'lucide-react';
import type { Message } from '@/hooks/useChat';
import { BreathingExercise } from './exercises/BreathingExercise';
import { GroundingExercise } from './exercises/GroundingExercise';
import { MuscleRelaxation } from './exercises/MuscleRelaxation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
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

export function ChatMessage({ message, onEdit }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const parts = isUser ? [{ type: 'text' as const, content: message.content }] : parseMessageContent(message.content);
  
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = async () => {
    // Get plain text without exercise markers
    const plainText = message.content
      .replace(/\[BREATHING_EXERCISE\]/g, '')
      .replace(/\[GROUNDING_EXERCISE\]/g, '')
      .replace(/\[MUSCLE_RELAXATION\]/g, '')
      .trim();
    
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    toast({
      description: "Copied to clipboard ✨",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
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
        {isEditing ? (
          <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] text-sm resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="w-3 h-3 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          parts.map((part, index) => {
            if (part.type === 'text' && part.content) {
              return (
                <div key={index} className="relative">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card border border-border rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{part.content}</p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className={`absolute -bottom-6 ${isUser ? 'right-0' : 'left-0'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {isUser && onEdit && (
                      <button
                        onClick={handleEdit}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
          })
        )}
      </div>
    </motion.div>
  );
}
