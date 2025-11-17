-- Auth setup and user profile initialization
-- This migration sets up automatic user profile creation on signup

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset monthly AI usage cost
CREATE OR REPLACE FUNCTION reset_monthly_ai_costs()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET current_month_ai_cost = 0.00
  WHERE date_trunc('month', updated_at) < date_trunc('month', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule monthly cost reset (to be called by cron job)
-- Note: This would typically be handled by application logic or external scheduler
