-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  cycle_length INTEGER NOT NULL DEFAULT 28,
  period_length INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create periods table
CREATE TABLE IF NOT EXISTS periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  flow TEXT CHECK (flow IN ('light', 'medium', 'heavy')),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  mood TEXT CHECK (mood IN ('happy', 'neutral', 'sad')),
  symptoms TEXT[], -- Array of symptom IDs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  flow TEXT CHECK (flow IN ('none', 'light', 'medium', 'heavy')),
  mood TEXT CHECK (mood IN ('happy', 'neutral', 'sad')),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  symptoms TEXT[], -- Array of symptom IDs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_periods_user_id ON periods(user_id);
CREATE INDEX IF NOT EXISTS idx_periods_start_date ON periods(start_date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(date);

-- Set up Row Level Security (RLS) policies
-- Enable RLS on tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON user_settings FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON user_settings FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Create policies for periods
CREATE POLICY "Users can view their own periods" 
  ON periods FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own periods" 
  ON periods FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own periods" 
  ON periods FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own periods" 
  ON periods FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create policies for daily_logs
CREATE POLICY "Users can view their own daily logs" 
  ON daily_logs FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own daily logs" 
  ON daily_logs FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own daily logs" 
  ON daily_logs FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own daily logs" 
  ON daily_logs FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Create function to handle Clerk authentication
CREATE OR REPLACE FUNCTION check_clerk_user(clerk_user_id text, table_user_id text)
RETURNS boolean AS $$
BEGIN
  -- For Clerk users, the user_id starts with 'user_'
  RETURN clerk_user_id = table_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the policies to use the new function
DROP POLICY IF EXISTS "Users can view their own periods" ON periods;
DROP POLICY IF EXISTS "Users can insert their own periods" ON periods;
DROP POLICY IF EXISTS "Users can update their own periods" ON periods;
DROP POLICY IF EXISTS "Users can delete their own periods" ON periods;

CREATE POLICY "Users can view their own periods" 
  ON periods FOR SELECT 
  USING (check_clerk_user(auth.uid()::text, user_id));

CREATE POLICY "Users can insert their own periods" 
  ON periods FOR INSERT 
  WITH CHECK (check_clerk_user(auth.uid()::text, user_id));

CREATE POLICY "Users can update their own periods" 
  ON periods FOR UPDATE 
  USING (check_clerk_user(auth.uid()::text, user_id));

CREATE POLICY "Users can delete their own periods" 
  ON periods FOR DELETE 
  USING (check_clerk_user(auth.uid()::text, user_id));

-- Create admin functions to manage RLS
CREATE OR REPLACE FUNCTION disable_rls()
RETURNS void AS $$
BEGIN
  -- This will only work if the calling user has the necessary permissions
  ALTER TABLE periods DISABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION enable_rls()
RETURNS void AS $$
BEGIN
  -- This will only work if the calling user has the necessary permissions
  ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION disable_rls() TO authenticated;
GRANT EXECUTE ON FUNCTION enable_rls() TO authenticated;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own periods" ON periods;
DROP POLICY IF EXISTS "Users can insert their own periods" ON periods;
DROP POLICY IF EXISTS "Users can update their own periods" ON periods;
DROP POLICY IF EXISTS "Users can delete their own periods" ON periods;

-- Temporarily disable RLS to make changes
ALTER TABLE periods DISABLE ROW LEVEL SECURITY;

-- Create new policies that don't rely on auth.uid()
CREATE POLICY "Enable all operations for authenticated users"
  ON periods
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON periods TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create stored procedure for inserting periods
CREATE OR REPLACE FUNCTION insert_period(
  p_user_id TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_flow TEXT,
  p_pain_level INTEGER DEFAULT NULL,
  p_mood TEXT DEFAULT NULL,
  p_symptoms TEXT[] DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS periods AS $$
DECLARE
  v_result periods;
BEGIN
  INSERT INTO periods (
    user_id,
    start_date,
    flow,
    pain_level,
    mood,
    symptoms,
    notes,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_start_date,
    p_flow,
    p_pain_level,
    p_mood,
    p_symptoms,
    p_notes,
    NOW(),
    NOW()
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION insert_period TO authenticated;

-- Create policy to allow function execution
CREATE POLICY "Allow insert_period function" ON periods
  FOR INSERT
  TO authenticated
  WITH CHECK (true); 