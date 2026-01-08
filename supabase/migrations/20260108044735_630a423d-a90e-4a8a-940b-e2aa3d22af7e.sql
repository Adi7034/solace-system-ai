-- Create period tracking tables
CREATE TABLE public.period_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  log_date DATE NOT NULL,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'medium', 'heavy', 'spotting')),
  symptoms TEXT[] DEFAULT '{}',
  moods TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(log_date)
);

-- Enable RLS but allow public access for now (no auth required yet)
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (anonymous users)
CREATE POLICY "Allow all operations on period_logs" 
ON public.period_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_period_logs_updated_at
BEFORE UPDATE ON public.period_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();