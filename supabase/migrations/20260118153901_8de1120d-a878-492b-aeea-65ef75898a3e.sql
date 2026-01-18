-- Create mood_entries table for daily mood journaling
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 5),
  mood_label TEXT NOT NULL,
  notes TEXT,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

-- Enable Row Level Security
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own mood entries" 
ON public.mood_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood entries" 
ON public.mood_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" 
ON public.mood_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" 
ON public.mood_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mood_entries_updated_at
BEFORE UPDATE ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();