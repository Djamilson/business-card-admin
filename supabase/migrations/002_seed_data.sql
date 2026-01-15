-- Business Card Admin - Seed Data
-- Created: 2026-01-15
-- Purpose: Populate database with initial test data

-- =============================================
-- CLIENTS
-- =============================================

INSERT INTO clients (name, email, phone, subdomain, subscription_status, subscription_start) VALUES
('Luís Fernandes', 'luis.fernandes@example.com', '(11) 98765-4321', 'luis-fernandes', 'active', NOW() - INTERVAL '6 months'),
('Mariana Costa', 'mariana.costa@example.com', '(21) 97654-3210', 'mariana-costa', 'active', NOW() - INTERVAL '3 months'),
('Roberto Silva', 'roberto.silva@example.com', '(31) 96543-2109', 'roberto-silva', 'active', NOW() - INTERVAL '45 days'),
('Ana Paula Santos', 'ana.santos@example.com', '(41) 95432-1098', 'ana-santos', 'suspended', NOW() - INTERVAL '8 months'),
('Carlos Eduardo', 'carlos.eduardo@example.com', '(51) 94321-0987', 'carlos-eduardo', 'canceled', NOW() - INTERVAL '1 year');

-- =============================================
-- SUBSCRIPTIONS
-- =============================================

-- Subscription for Luís Fernandes (Plano Premium)
INSERT INTO subscriptions (client_id, plan, amount, setup_fee, status, billing_cycle, next_billing_date)
SELECT id, 'premium', 497.00, 2000.00, 'active', 'monthly', NOW() + INTERVAL '15 days'
FROM clients WHERE email = 'luis.fernandes@example.com';

-- Subscription for Mariana Costa (Plano Profissional)
INSERT INTO subscriptions (client_id, plan, amount, setup_fee, status, billing_cycle, next_billing_date)
SELECT id, 'professional', 397.00, 2000.00, 'active', 'monthly', NOW() + INTERVAL '8 days'
FROM clients WHERE email = 'mariana.costa@example.com';

-- Subscription for Roberto Silva (Plano Básico)
INSERT INTO subscriptions (client_id, plan, amount, setup_fee, status, billing_cycle, next_billing_date)
SELECT id, 'basic', 197.00, 2000.00, 'pending', 'monthly', NOW() + INTERVAL '3 days'
FROM clients WHERE email = 'roberto.silva@example.com';

-- Subscription for Ana Paula Santos (Suspended)
INSERT INTO subscriptions (client_id, plan, amount, setup_fee, status, billing_cycle, next_billing_date)
SELECT id, 'professional', 397.00, 2000.00, 'past_due', 'monthly', NOW() - INTERVAL '5 days'
FROM clients WHERE email = 'ana.santos@example.com';

-- Subscription for Carlos Eduardo (Canceled)
INSERT INTO subscriptions (client_id, plan, amount, setup_fee, status, billing_cycle, next_billing_date)
SELECT id, 'basic', 197.00, 2000.00, 'canceled', 'monthly', NOW() - INTERVAL '30 days'
FROM clients WHERE email = 'carlos.eduardo@example.com';

-- =============================================
-- INVOICES
-- =============================================

-- Invoice 1: Luís Fernandes - PAID
INSERT INTO invoices (client_id, subscription_id, invoice_number, amount, status, due_date, paid_at, payment_method)
SELECT 
  c.id, 
  s.id,
  'INV-202601-0001',
  497.00,
  'paid',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '18 days',
  'Cartão de Crédito'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id
WHERE c.email = 'luis.fernandes@example.com';

-- Invoice 2: Mariana Costa - PAID
INSERT INTO invoices (client_id, subscription_id, invoice_number, amount, status, due_date, paid_at, payment_method)
SELECT 
  c.id, 
  s.id,
  'INV-202601-0002',
  397.00,
  'paid',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '13 days',
  'PIX'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id
WHERE c.email = 'mariana.costa@example.com';

-- Invoice 3: Roberto Silva - PENDING
INSERT INTO invoices (client_id, subscription_id, invoice_number, amount, status, due_date, payment_method)
SELECT 
  c.id, 
  s.id,
  'INV-202601-0003',
  197.00,
  'pending',
  NOW() + INTERVAL '3 days',
  'Boleto'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id
WHERE c.email = 'roberto.silva@example.com';

-- Invoice 4: Ana Paula Santos - OVERDUE
INSERT INTO invoices (client_id, subscription_id, invoice_number, amount, status, due_date, payment_method)
SELECT 
  c.id, 
  s.id,
  'INV-202601-0004',
  397.00,
  'overdue',
  NOW() - INTERVAL '5 days',
  'Cartão de Crédito'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id
WHERE c.email = 'ana.santos@example.com';

-- Invoice 5: Carlos Eduardo - CANCELED
INSERT INTO invoices (client_id, subscription_id, invoice_number, amount, status, due_date, payment_method)
SELECT 
  c.id, 
  s.id,
  'INV-202512-0099',
  197.00,
  'canceled',
  NOW() - INTERVAL '30 days',
  'Boleto'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id
WHERE c.email = 'carlos.eduardo@example.com';

-- =============================================
-- CARD CONFIGS
-- =============================================

-- Card Config for Luís Fernandes
INSERT INTO card_configs (client_id, profile_data, contact_info, social_links, is_published)
SELECT 
  id,
  jsonb_build_object(
    'name', 'Luís Fernandes',
    'title', 'Corretor de Imóveis',
    'description', 'Especialista em imóveis de alto padrão',
    'avatar_url', NULL
  ),
  jsonb_build_object(
    'whatsapp', '11987654321',
    'email', 'luis.fernandes@example.com',
    'website', 'https://luis-fernandes.businesscard.com',
    'location', 'São Paulo, SP'
  ),
  jsonb_build_object(
    'instagram', '@luisfernandesimoveis',
    'linkedin', 'luisfernandes',
    'facebook', 'luisfernandesimoveis'
  ),
  true
FROM clients WHERE email = 'luis.fernandes@example.com';

-- Card Config for Mariana Costa
INSERT INTO card_configs (client_id, profile_data, contact_info, social_links, is_published)
SELECT 
  id,
  jsonb_build_object(
    'name', 'Mariana Costa',
    'title', 'Corretora de Imóveis',
    'description', 'Especialista em casas e apartamentos no Rio',
    'avatar_url', NULL
  ),
  jsonb_build_object(
    'whatsapp', '21976543210',
    'email', 'mariana.costa@example.com',
    'website', 'https://mariana-costa.businesscard.com',
    'location', 'Rio de Janeiro, RJ'
  ),
  jsonb_build_object(
    'instagram', '@marianacostaimoveis',
    'linkedin', 'marianacosta'
  ),
  true
FROM clients WHERE email = 'mariana.costa@example.com';

-- Card Config for Roberto Silva
INSERT INTO card_configs (client_id, profile_data, contact_info, is_published)
SELECT 
  id,
  jsonb_build_object(
    'name', 'Roberto Silva',
    'title', 'Corretor Imobiliário',
    'description', 'Atendimento personalizado em Minas Gerais',
    'avatar_url', NULL
  ),
  jsonb_build_object(
    'whatsapp', '31965432109',
    'email', 'roberto.silva@example.com',
    'website', NULL,
    'location', 'Belo Horizonte, MG'
  ),
  false
FROM clients WHERE email = 'roberto.silva@example.com';

-- =============================================
-- PAYMENT HISTORY
-- =============================================

-- Payment for Invoice 1 (Luís Fernandes)
INSERT INTO payment_history (client_id, invoice_id, amount, status, payment_method)
SELECT 
  c.id,
  i.id,
  497.00,
  'success',
  'Cartão de Crédito'
FROM clients c
JOIN invoices i ON i.client_id = c.id
WHERE c.email = 'luis.fernandes@example.com'
  AND i.invoice_number = 'INV-202601-0001';

-- Payment for Invoice 2 (Mariana Costa)
INSERT INTO payment_history (client_id, invoice_id, amount, status, payment_method)
SELECT 
  c.id,
  i.id,
  397.00,
  'success',
  'PIX'
FROM clients c
JOIN invoices i ON i.client_id = c.id
WHERE c.email = 'mariana.costa@example.com'
  AND i.invoice_number = 'INV-202601-0002';

-- =============================================
-- ACTIVITY LOG
-- =============================================

-- Log entries for client activities
INSERT INTO activity_log (client_id, action, description)
SELECT id, 'client_created', 'Cliente cadastrado no sistema'
FROM clients;

INSERT INTO activity_log (client_id, action, description)
SELECT c.id, 'subscription_created', 'Assinatura criada'
FROM clients c
JOIN subscriptions s ON s.client_id = c.id;

INSERT INTO activity_log (client_id, action, description)
SELECT c.id, 'invoice_paid', 'Fatura paga com sucesso'
FROM clients c
JOIN invoices i ON i.client_id = c.id
WHERE i.status = 'paid';

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📊 Clients: 5';
  RAISE NOTICE '📊 Subscriptions: 5';
  RAISE NOTICE '📊 Invoices: 5';
  RAISE NOTICE '📊 Card Configs: 3';
  RAISE NOTICE '📊 Payment History: 2';
END $$;
