-- Add unique constraint for log_date + user_id for upsert to work
ALTER TABLE public.period_logs ADD CONSTRAINT period_logs_user_date_unique UNIQUE (log_date, user_id);