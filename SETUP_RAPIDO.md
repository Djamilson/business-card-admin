# ⚡ SETUP RÁPIDO - 5 MINUTOS

## 🎯 O QUE FAZER AGORA

Sua aplicação está **100% implementada**, mas precisa de configuração do Supabase para funcionar.

---

## ✅ PASSO 1: Criar Projeto no Supabase (2min)

1. Acesse: https://supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Nome:** business-card-admin
   - **Database Password:** (crie uma senha forte)
   - **Region:** South America (São Paulo)
   - **Plan:** Free

4. Aguarde ~2 minutos até o projeto ser criado

---

## ✅ PASSO 2: Executar SQL (1min)

1. No menu lateral, clique em **SQL Editor**
2. Clique em **"New Query"**

3. Copie TODO o conteúdo de:
   ```
   supabase/migrations/001_create_tables.sql
   ```
4. Cole no editor
5. Clique em **"RUN"** (canto inferior direito)
6. Aguarde ver: "Success. No rows returned"

7. Repita com:
   ```
   supabase/migrations/002_seed_data.sql
   ```
8. Clique em **"RUN"**
9. Deve ver mensagens de sucesso no console

---

## ✅ PASSO 3: Copiar Credenciais (1min)

1. No menu lateral, clique em **Settings** → **API**

2. Copie dois valores:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** (key que começa com `eyJ...`)

---

## ✅ PASSO 4: Criar .env.local (1min)

1. Na raiz do projeto, crie o arquivo: `.env.local`

2. Cole este conteúdo (substitua os valores):

```env
# Cole aqui a URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Cole aqui a anon key do Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Pode deixar assim mesmo
NEXTAUTH_SECRET=minha-chave-secreta-super-segura-123
NEXTAUTH_URL=http://localhost:3002
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

3. Salve o arquivo

---

## ✅ PASSO 5: Reiniciar Servidor (<1min)

1. No terminal onde o servidor está rodando, aperte **Ctrl+C**

2. Execute novamente:
```bash
pnpm dev
```

3. Aguarde abrir em: http://localhost:3002

---

## 🎉 PRONTO! Agora Teste:

### Teste 1: Clientes
Acesse: http://localhost:3002/dashboard/clients

**Deve ver:**
- ✅ 5 clientes carregados
- ✅ Estatísticas: 5 total, 3 ativos
- ✅ Nomes: Luís Fernandes, Mariana Costa, Roberto Silva, etc.

### Teste 2: Assinaturas
Acesse: http://localhost:3002/dashboard/subscriptions

**Deve ver:**
- ✅ 5 assinaturas
- ✅ MRR: R$ 891,00
- ✅ 3 ativas, 1 pendente, 1 cancelada

### Teste 3: Faturas
Acesse: http://localhost:3002/dashboard/invoices

**Deve ver:**
- ✅ 5 faturas
- ✅ Total recebido: R$ 694,00
- ✅ Pendente: R$ 197,00
- ✅ Vencidas: R$ 397,00

---

## ❌ Se Não Funcionar

### Erro: "Failed to fetch..."

1. Verifique se copiou corretamente:
   - URL do Supabase (sem `/` no final)
   - ANON KEY (completa, começa com `eyJ`)

2. Verifique se reiniciou o servidor após criar o `.env.local`

3. No navegador, aperte **F12** e veja o console
   - Se houver erro de CORS, suas credenciais estão erradas

### Erro: "relation 'clients' does not exist"

1. Execute os arquivos SQL no Supabase SQL Editor:
   - `001_create_tables.sql` PRIMEIRO
   - `002_seed_data.sql` DEPOIS

2. No Supabase, vá em **Table Editor** e verifique se as tabelas foram criadas

---

## 📞 Precisa de Ajuda?

Leia os documentos detalhados:
- `FASE2_COMPLETA.md` - Documentação completa
- `IMPLEMENTACAO_FASE2.md` - Detalhes técnicos
- `supabase/README.md` - Informações sobre o banco

---

**Tempo total:** ~5 minutos  
**Dificuldade:** Fácil  
**Resultado:** Sistema 100% funcional! 🚀
