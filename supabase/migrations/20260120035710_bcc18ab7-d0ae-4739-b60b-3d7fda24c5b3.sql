-- Create slot_memory table for storing user preferences and personal details
CREATE TABLE public.slot_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slot_key TEXT NOT NULL,
  slot_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slot_key)
);

-- Create event_memory table for storing past conversation snippets
CREATE TABLE public.event_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_summary TEXT NOT NULL,
  context TEXT,
  importance_score INTEGER DEFAULT 5 CHECK (importance_score >= 1 AND importance_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.slot_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_memory ENABLE ROW LEVEL SECURITY;

-- RLS policies for slot_memory
CREATE POLICY "Users can view their own slot memory"
ON public.slot_memory FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own slot memory"
ON public.slot_memory FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own slot memory"
ON public.slot_memory FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own slot memory"
ON public.slot_memory FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for event_memory
CREATE POLICY "Users can view their own event memory"
ON public.event_memory FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event memory"
ON public.event_memory FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event memory"
ON public.event_memory FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updating slot_memory updated_at
CREATE TRIGGER update_slot_memory_updated_at
BEFORE UPDATE ON public.slot_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_slot_memory_user_id ON public.slot_memory(user_id);
CREATE INDEX idx_event_memory_user_id ON public.event_memory(user_id);
CREATE INDEX idx_event_memory_importance ON public.event_memory(importance_score DESC);