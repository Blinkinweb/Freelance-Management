-- ============================================================
-- FreelanceOS — Initial Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (managed by Supabase Auth, extended profile)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  email TEXT,
  google_business_url TEXT,
  invoice_template JSONB,
  digest_email_enabled BOOLEAN DEFAULT false,
  digest_email_time TIME DEFAULT '08:00',
  testimonial_delay_days INTEGER DEFAULT 14,
  invoice_payment_terms_days INTEGER DEFAULT 14,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Templates
CREATE TABLE IF NOT EXISTS project_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]',
  timeline_stages JSONB DEFAULT '[]',
  revision_limit INTEGER DEFAULT 3,
  base_price NUMERIC,
  price_range_max NUMERIC,
  out_of_scope JSONB DEFAULT '[]',
  deposit_percentage NUMERIC DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  project_hint TEXT,
  budget_hint NUMERIC,
  deadline_hint TEXT,
  source TEXT DEFAULT 'quick_capture',
  raw_input TEXT,
  converted BOOLEAN DEFAULT false,
  converted_client_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  health_score TEXT DEFAULT 'grey' CHECK (health_score IN ('green', 'amber', 'red', 'grey')),
  testimonial_status TEXT DEFAULT 'not_requested' CHECK (testimonial_status IN ('not_requested', 'sent', 'received')),
  testimonial_sent_at TIMESTAMPTZ,
  testimonial_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  budget NUMERIC,
  start_date DATE,
  deadline DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  template_id UUID REFERENCES project_templates(id) ON DELETE SET NULL,
  revision_limit INTEGER DEFAULT 3,
  revisions_used INTEGER DEFAULT 0,
  sow_generated BOOLEAN DEFAULT false,
  sow_url TEXT,
  offboarding_complete_at TIMESTAMPTZ,
  testimonial_countdown_start TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT,
  line_items JSONB DEFAULT '[]',
  subtotal NUMERIC DEFAULT 0,
  tax_rate NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue')),
  due_date DATE,
  paid_date DATE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  pdf_url TEXT,
  sendgrid_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own data" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own leads" ON leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
