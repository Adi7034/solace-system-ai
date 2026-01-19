-- Drop the existing unique constraint on just log_date
ALTER TABLE public.period_logs DROP CONSTRAINT IF EXISTS period_logs_log_date_key;

-- Create a new composite unique constraint on log_date + user_id
-- This allows different users to log on the same date
ALTER TABLE public.period_logs ADD CONSTRAINT period_logs_log_date_user_id_key UNIQUE (log_date, user_id);