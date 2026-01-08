-- Add user_id column to period_logs
ALTER TABLE public.period_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all read access" ON public.period_logs;
DROP POLICY IF EXISTS "Allow all insert access" ON public.period_logs;
DROP POLICY IF EXISTS "Allow all update access" ON public.period_logs;
DROP POLICY IF EXISTS "Allow all delete access" ON public.period_logs;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own logs"
ON public.period_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own logs"
ON public.period_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
ON public.period_logs FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
ON public.period_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);