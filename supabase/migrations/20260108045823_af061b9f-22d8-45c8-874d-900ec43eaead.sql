-- Drop the old permissive policy that was missed
DROP POLICY IF EXISTS "Allow all operations on period_logs" ON public.period_logs;