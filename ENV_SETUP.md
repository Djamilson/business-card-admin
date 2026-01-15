# 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe (opcional - para futuro)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Como Obter as Chaves:

### Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto (gratuito)
3. Vá em Settings → API
4. Copie a URL e a Anon Key

### Stripe:
1. Acesse [stripe.com](https://stripe.com/br)
2. Crie uma conta
3. Vá em Developers → API Keys
4. Copie a Secret Key

### NextAuth Secret:
Execute no terminal:
```bash
openssl rand -base64 32
```
