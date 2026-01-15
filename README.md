# 📊 Business Card Admin - Dashboard de Assinaturas

Sistema administrativo para gerenciar assinaturas do Cartão Digital.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 + React 19
- **Linguagem:** TypeScript 5
- **Estilização:** Tailwind CSS 4
- **Banco de Dados:** Supabase (PostgreSQL)
- **Pagamentos:** Stripe (a implementar)
- **UI Components:** Shadcn/ui
- **Ícones:** Lucide React
- **Tabelas:** TanStack Table
- **Gráficos:** Recharts

## 📦 Instalação

```bash
# Clone o projeto
cd business-card-admin

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
# Copie as variáveis do ENV_SETUP.md para .env.local

# Execute o projeto
pnpm dev
```

O projeto estará rodando em [http://localhost:3000](http://localhost:3000)

## 🏗️ Estrutura do Projeto

```
business-card-admin/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Overview do dashboard
│   │   ├── clients/          # Gerenciar clientes
│   │   ├── subscriptions/    # Gerenciar assinaturas
│   │   ├── invoices/         # Gerenciar faturas
│   │   └── settings/         # Configurações
│   ├── api/                  # API Routes (webhooks, etc)
│   └── page.tsx              # Redirect para dashboard
├── components/
│   ├── ui/                   # Componentes UI reutilizáveis
│   └── sidebar.tsx           # Sidebar do dashboard
├── lib/
│   ├── supabase.ts           # Cliente Supabase + Types
│   └── utils.ts              # Utilitários
└── public/                   # Assets estáticos
```

## ✨ Funcionalidades Implementadas

### ✅ Fase 1 (MVP Atual)

- [x] Setup do projeto Next.js 16
- [x] Configuração TypeScript
- [x] Configuração Tailwind CSS
- [x] Sidebar de navegação
- [x] Layout do dashboard
- [x] Página Overview com métricas
- [x] Cards de estatísticas (MRR, ARR, Churn)
- [x] Lista de clientes recentes
- [x] Próximas cobranças
- [x] Ações rápidas

### 🚧 Fase 2 (A Implementar)

- [ ] Autenticação (NextAuth)
- [ ] CRUD completo de clientes
- [ ] Gerenciar assinaturas
- [ ] Sistema de faturas
- [ ] Integração com Supabase
- [ ] Integração com Stripe
- [ ] Editor de cartão digital
- [ ] Dashboard de analytics
- [ ] Sistema de notificações
- [ ] Webhooks Stripe

## 🎨 Componentes UI

O projeto usa componentes customizados baseados no Shadcn/ui:

- **Button:** Botões com variantes (default, outline, ghost, etc)
- **Card:** Cards para conteúdo
- Mais componentes serão adicionados conforme necessário

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais:

1. **clients** - Dados dos clientes
   - id, name, email, phone, subdomain, custom_domain
   - subscription_status, subscription_start, subscription_end
   - created_at, updated_at

2. **subscriptions** - Assinaturas
   - id, client_id, plan, amount, status
   - next_billing_date, payment_method_id

3. **invoices** - Faturas
   - id, client_id, amount, status
   - due_date, paid_at, invoice_url

4. **card_configs** - Configurações dos cartões
   - id, client_id, profile_data, contact_info
   - social_links, featured_property, theme_colors

## 💰 Modelo de Negócio

- **Setup Inicial:** R$ 2.000,00 (pagamento único)
- **Mensalidade:** R$ 397,00/mês
- **Contrato:** Mínimo 12 meses
- **Incluso:** Hospedagem + Atualizações + Suporte

### Métricas Importantes:

- **MRR:** Monthly Recurring Revenue (Receita Recorrente Mensal)
- **ARR:** Annual Recurring Revenue (Receita Recorrente Anual)
- **Churn:** Taxa de cancelamento
- **LTV:** Lifetime Value (Valor do cliente ao longo do tempo)

## 📊 Dashboard Overview

O dashboard principal exibe:

1. **Métricas Principais:**
   - Clientes Ativos
   - MRR (Receita Recorrente Mensal)
   - ARR (Receita Recorrente Anual)
   - Taxa de Churn

2. **Clientes Recentes:**
   - Lista dos últimos clientes cadastrados
   - Status da assinatura
   - Data de entrada

3. **Próximas Cobranças:**
   - Cobranças agendadas
   - Valor total a receber

4. **Ações Rápidas:**
   - Novo Cliente
   - Gerar Fatura
   - Ver Relatórios

## 🔧 Desenvolvimento

```bash
# Rodar em desenvolvimento
pnpm dev

# Buildar para produção
pnpm build

# Rodar produção localmente
pnpm start

# Lint
pnpm lint
```

## 📝 Próximos Passos

1. **Configurar Supabase:**
   - Criar projeto no Supabase
   - Executar migrações do banco de dados
   - Configurar Row Level Security (RLS)

2. **Implementar Autenticação:**
   - NextAuth com Supabase
   - Página de login
   - Proteção de rotas

3. **CRUD de Clientes:**
   - Lista com filtros e busca
   - Formulário de cadastro
   - Edição e exclusão
   - Detalhes do cliente

4. **Integração Stripe:**
   - Configurar Stripe
   - Criar assinaturas
   - Webhooks de pagamento
   - Dashboard de pagamentos

5. **Editor de Cartão:**
   - Interface para editar cartão do cliente
   - Preview em tempo real
   - Upload de imagens
   - Publicar/Despublicar

## 🤝 Suporte

Para dúvidas ou suporte:
- Email: djamilson@gmail.com
- WhatsApp: (63) 99231-5334

## 📄 Licença

Projeto proprietário - Todos os direitos reservados.

---

**Desenvolvido por Djamilson Alves** | 2026
