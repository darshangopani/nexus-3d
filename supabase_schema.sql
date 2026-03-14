  -- ==============================================================================
  -- NEXUS-3D: Complete Supabase Schema (Idempotent Version)
  -- Includes: Tables, Row Level Security (RLS), Triggers, and Credits System
  -- ==============================================================================

  -- ------------------------------------------------------------------------------
  -- 1. Custom Types
  -- ------------------------------------------------------------------------------
  DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('user', 'admin');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
          CREATE TYPE subscription_tier AS ENUM ('free', 'scholar_plus', 'elite_pro', 'global_ultra');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'query_type') THEN
          CREATE TYPE query_type AS ENUM ('summary', 'practice_paper', 'tutor_chat', 'custom');
      END IF;
  END $$;

  -- ------------------------------------------------------------------------------
  -- 2. Tables
  -- ------------------------------------------------------------------------------

  -- Users Table
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
  );

  -- User Credits System
  CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
    tier subscription_tier DEFAULT 'free'::subscription_tier NOT NULL,
    credit_balance INTEGER DEFAULT 0 NOT NULL,
    practice_papers_generated_this_month INTEGER DEFAULT 0 NOT NULL,
    ai_jobs_completed INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
  );

  -- History Table
  CREATE TABLE IF NOT EXISTS public.history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    q_type query_type DEFAULT 'custom'::query_type NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
  );

  -- ------------------------------------------------------------------------------
  -- 3. Row Level Security (RLS)
  -- ------------------------------------------------------------------------------

  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

  -- users policies
  DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own profile') THEN
          CREATE POLICY "Users can read own profile" ON public.users
            FOR SELECT USING (auth.uid() = id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read all profiles') THEN
          CREATE POLICY "Admins can read all profiles" ON public.users
            FOR SELECT USING (
              EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
            );
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
          CREATE POLICY "Users can update own profile" ON public.users
            FOR UPDATE USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
      END IF;
  END $$;

  -- user_credits policies
  DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own credits') THEN
          CREATE POLICY "Users can read own credits" ON public.user_credits
            FOR SELECT USING (auth.uid() = user_id);
      END IF;
  END $$;

  -- history policies
  DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own history') THEN
          CREATE POLICY "Users can read own history" ON public.history
            FOR SELECT USING (auth.uid() = user_id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own history') THEN
          CREATE POLICY "Users can insert own history" ON public.history
            FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
  END $$;

  -- ------------------------------------------------------------------------------
  -- 4. Triggers & Functions
  -- ------------------------------------------------------------------------------

  -- Function: Automatically create a user profile and credit row
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    -- We use COALESCE and ON CONFLICT to make this extremely resilient
    INSERT INTO public.users (id, email, role)
    VALUES (
      new.id,
      new.email,
      CASE WHEN new.email = 'darshangopani3022@gmail.com' THEN 'admin'::user_role ELSE 'user'::user_role END
    )
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

    INSERT INTO public.user_credits (user_id, tier, credit_balance, practice_papers_generated_this_month)
    VALUES (new.id, 'free'::subscription_tier, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
  EXCEPTION WHEN OTHERS THEN
    -- Log error and continue to allow auth user creation even if profile fails
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
  END;
  $$;

  -- Trigger for new user signup
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- Trigger for updating timestamp automatically
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
  $$ language 'plpgsql';

  DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_user_credits_updated_at ON public.user_credits;
  CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- Function: Reset Monthly Limits
  CREATE OR REPLACE FUNCTION public.reset_monthly_limits()
  RETURNS void AS $$
  BEGIN
    UPDATE public.user_credits
    SET practice_papers_generated_this_month = 0;
  END;
  $$ LANGUAGE plpgsql;

  -- Grant Permissions (Crucial for Trigger Success)
  GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
  GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
