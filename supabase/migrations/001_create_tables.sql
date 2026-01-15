-- Business Card Admin - Database Schema
-- Created: 2026-01-15
-- Author: Djamilson Alves

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLIENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  cpf_cnpj VARCHAR(20),
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  custom_domain VARCHAR(255),
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active', 'canceled', 'suspended', 'past_due')),
  subscription_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster searches
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_subdomain ON clients(subdomain);
CREATE INDEX idx_clients_status ON clients(subscription_status);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('basic', 'professional', 'premium', 'enterprise')),
  amount DECIMAL(10, 2) NOT NULL,
  setup_fee DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'pending', 'canceled', 'past_due')),
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'annual')),
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- =============================================
-- INVOICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('paid', 'pending', 'failed', 'overdue', 'canceled')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  stripe_invoice_id VARCHAR(255),
  invoice_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

-- =============================================
-- CARD CONFIGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS card_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL DEFAULT '{
    "name": "",
    "title": "",
    "description": "",
    "avatar_url": null
  }',
  contact_info JSONB NOT NULL DEFAULT '{
    "whatsapp": "",
    "email": "",
    "website": null,
    "location": null
  }',
  social_links JSONB DEFAULT '{
    "instagram": null,
    "linkedin": null,
    "facebook": null,
    "twitter": null,
    "youtube": null
  }',
  featured_property JSONB DEFAULT '{
    "title": null,
    "description": null,
    "image_url": null,
    "link_url": null
  }',
  theme_colors JSONB DEFAULT '{
    "primary": "#B8860B",
    "secondary": "#1a1a1a"
  }',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_card_configs_client ON card_configs(client_id);
CREATE INDEX idx_card_configs_published ON card_configs(is_published);

-- =============================================
-- PAYMENT HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'refunded', 'pending')),
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_payment_history_client ON payment_history(client_id);
CREATE INDEX idx_payment_history_invoice ON payment_history(invoice_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);

-- =============================================
-- ACTIVITY LOG TABLE (Auditoria)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_activity_log_client ON activity_log(client_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- =============================================
-- TRIGGERS - Updated_at Auto-Update
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_configs_updated_at BEFORE UPDATE ON card_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTIONS - Helper Functions
-- =============================================

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS VARCHAR AS $$
DECLARE
  year VARCHAR(4);
  month VARCHAR(2);
  sequence_num INT;
  invoice_num VARCHAR(50);
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YYYY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  -- Get next sequence number for this month
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS INT)), 0) + 1
  INTO sequence_num
  FROM invoices
  WHERE invoice_number LIKE 'INV-' || year || month || '-%';
  
  invoice_num := 'INV-' || year || month || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Será configurado posteriormente com autenticação
-- =============================================

-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE card_configs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE clients IS 'Tabela de clientes do sistema';
COMMENT ON TABLE subscriptions IS 'Tabela de assinaturas dos clientes';
COMMENT ON TABLE invoices IS 'Tabela de faturas emitidas';
COMMENT ON TABLE card_configs IS 'Configurações dos cartões digitais';
COMMENT ON TABLE payment_history IS 'Histórico de pagamentos';
COMMENT ON TABLE activity_log IS 'Log de atividades do sistema';
