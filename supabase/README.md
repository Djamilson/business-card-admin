# 🗄️ Supabase Database Setup

Este diretório contém as migrações SQL para configurar o banco de dados do Business Card Admin.

## 📋 Estrutura do Banco de Dados

### Tabelas Principais:

1. **clients** - Clientes do sistema
   - Informações pessoais e de contato
   - Status da assinatura
   - Subdomínio personalizado

2. **subscriptions** - Assinaturas dos clientes
   - Planos (basic, professional, premium, enterprise)
   - Valores e ciclo de cobrança
   - Status e próxima cobrança

3. **invoices** - Faturas emitidas
   - Número único de fatura
   - Status de pagamento
   - Integração com Stripe

4. **card_configs** - Configurações dos cartões digitais
   - Dados de perfil (JSONB)
   - Informações de contato (JSONB)
   - Links sociais e tema

5. **payment_history** - Histórico de pagamentos
   - Transações realizadas
   - Status e método de pagamento

6. **activity_log** - Log de atividades
   - Auditoria do sistema
   - Rastreamento de ações

## 🚀 Como Executar as Migrações

### Opção 1: Supabase Dashboard (Recomendado)

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Copie e execute o conteúdo de cada arquivo na ordem:
   - `001_create_tables.sql` - Cria as tabelas
   - `002_seed_data.sql` - Insere dados de teste

### Opção 2: Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Linkar com seu projeto
supabase link --project-ref your-project-ref

# Executar migrações
supabase db push
```

### Opção 3: pgAdmin ou Cliente PostgreSQL

```bash
# Conectar ao seu banco Supabase e executar:
psql -h db.your-project.supabase.co -U postgres -d postgres -f 001_create_tables.sql
psql -h db.your-project.supabase.co -U postgres -d postgres -f 002_seed_data.sql
```

## 📊 Dados de Teste

O arquivo `002_seed_data.sql` insere:
- ✅ 5 Clientes
- ✅ 5 Assinaturas
- ✅ 5 Faturas
- ✅ 3 Configurações de Cartão
- ✅ 2 Pagamentos
- ✅ Logs de atividade

### Clientes de Teste:

| Nome | Email | Status | Plano |
|------|-------|--------|-------|
| Luís Fernandes | luis.fernandes@example.com | Ativo | Premium (R$ 497) |
| Mariana Costa | mariana.costa@example.com | Ativo | Profissional (R$ 397) |
| Roberto Silva | roberto.silva@example.com | Pendente | Básico (R$ 197) |
| Ana Paula Santos | ana.santos@example.com | Suspenso | Profissional (R$ 397) |
| Carlos Eduardo | carlos.eduardo@example.com | Cancelado | Básico (R$ 197) |

## 🔒 Segurança (RLS - Row Level Security)

As políticas de RLS estão comentadas e serão ativadas na Fase 2 após implementar autenticação.

```sql
-- Exemplo de política RLS (será implementada):
CREATE POLICY "Usuários podem ver apenas seus próprios dados"
  ON clients FOR SELECT
  USING (auth.uid() = id);
```

## 🔄 Triggers e Functions

### Auto-Update Timestamp:
- Todas as tabelas atualizam `updated_at` automaticamente ao modificar registros

### Helper Functions:
- `generate_invoice_number()` - Gera números únicos de fatura no formato: INV-YYYYMM-XXXX

## 📈 Índices

Índices foram criados para otimizar queries comuns:
- Email, subdomínio e status de clientes
- Status e data de próxima cobrança de assinaturas
- Status e data de vencimento de faturas

## 🧪 Validação

Após executar as migrações, valide com:

```sql
-- Verificar se todas as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Contar registros
SELECT 
  (SELECT COUNT(*) FROM clients) as clients,
  (SELECT COUNT(*) FROM subscriptions) as subscriptions,
  (SELECT COUNT(*) FROM invoices) as invoices,
  (SELECT COUNT(*) FROM card_configs) as card_configs;
```

Resultado esperado:
```
 clients | subscriptions | invoices | card_configs 
---------+---------------+----------+--------------
       5 |             5 |        5 |            3
```

## 🔧 Troubleshooting

### Erro: "relation already exists"
Se você já executou as migrações antes, pode precisar dropar as tabelas:

```sql
-- CUIDADO: Isso apaga todos os dados!
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS card_configs CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
```

### Erro: "uuid-ossp extension not found"
```sql
-- Ativar extensão UUID manualmente:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## 📞 Suporte

Para dúvidas sobre o schema:
- Email: djamilson@gmail.com
- WhatsApp: (63) 99231-5334

---

**Última atualização:** 15/01/2026
