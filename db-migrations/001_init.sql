-- ============================================================
-- Koinovate Database Schema - Initial Migration
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  membership_tier TEXT CHECK (membership_tier IN ('free', 'pulse', 'premium')) DEFAULT 'free',
  membership_active BOOLEAN DEFAULT false,
  membership_start_date TIMESTAMPTZ,
  membership_end_date TIMESTAMPTZ,
  signup_ip TEXT,
  referred_by UUID REFERENCES users(id),
  referral_code TEXT UNIQUE,
  total_earned DECIMAL(12,2) DEFAULT 0,
  wallet_balance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Membership Plans table
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  duration_days INT DEFAULT 30,
  description TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward DECIMAL(10,2) DEFAULT 0,
  min_tier TEXT DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  survey_url TEXT,
  redirect_url TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  course_url TEXT,
  redirect_url TEXT,
  thumbnail TEXT,
  min_tier TEXT DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  order_num INT DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  reward DECIMAL(10,2) DEFAULT 0,
  task_url TEXT,
  redirect_url TEXT,
  min_tier TEXT DEFAULT 'free',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'once')) DEFAULT 'daily',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User-Survey junction (for tracking completions)
CREATE TABLE IF NOT EXISTS user_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, survey_id)
);

-- User-Course junction
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- User-Task junction
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin logs for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  total_withdrawn DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID NOT NULL UNIQUE REFERENCES users(id),
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_membership_tier ON users(membership_tier);
CREATE INDEX IF NOT EXISTS idx_surveys_created_by ON surveys(created_by);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_user_surveys_user_id ON user_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON user_tasks(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id OR auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Users can read active surveys based on tier
CREATE POLICY "Users can read surveys" ON surveys
  FOR SELECT USING (
    status = 'active' AND (
      min_tier = 'free' OR
      auth.uid() IN (
        SELECT id FROM users WHERE membership_active = true
      )
    )
  );

-- Admins can manage surveys
CREATE POLICY "Admins manage surveys" ON surveys
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Similar policies for courses and tasks...
CREATE POLICY "Users can read courses" ON courses
  FOR SELECT USING (
    status = 'active' AND (
      min_tier = 'free' OR
      auth.uid() IN (
        SELECT id FROM users WHERE membership_active = true
      )
    )
  );

CREATE POLICY "Admins manage courses" ON courses
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Users can read tasks" ON tasks
  FOR SELECT USING (
    status = 'active' AND (
      min_tier = 'free' OR
      auth.uid() IN (
        SELECT id FROM users WHERE membership_active = true
      )
    )
  );

CREATE POLICY "Admins manage tasks" ON tasks
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Wallet policies
CREATE POLICY "Users can read own wallet" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read wallets" ON wallets
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Insert default membership plans
INSERT INTO membership_plans (name, tier, price, duration_days, description, features) VALUES
  ('Free Plan', 'free', 0, 365, 'Basic access to surveys and tasks', '["basic_surveys", "basic_tasks", "view_learning"]'),
  ('Pulse Plan', 'pulse', 15000, 30, 'Full access to all features', '["all_surveys", "all_tasks", "ai_trading", "advanced_analytics"]'),
  ('Premium Plan', 'premium', 50000, 30, 'Complete access with priority support', '["all_features", "priority_support", "custom_settings", "dedicated_account_manager"]')
ON CONFLICT DO NOTHING;
