#!/bin/bash

# ===========================================================
# 🔄 Script de Commit e Push Automático - MesaGo v.1.0.0
# ===========================================================
# Este script adiciona todos os arquivos não ignorados,
# faz commit com mensagem descritiva e push para o repositório
# ===========================================================

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verifica se estamos em um repositório git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Este diretório não é um repositório git!"
    exit 1
fi

print_info "Iniciando processo de commit e push..."
echo ""

# Verifica se há mudanças
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    print_warning "Não há mudanças para commitar!"
    exit 0
fi

# Mostra o status atual
print_info "Status atual do repositório:"
echo ""
git status --short
echo ""

# Adiciona todos os arquivos não ignorados
print_info "Adicionando todos os arquivos não ignorados..."
git add -A
print_success "Arquivos adicionados ao staging"
echo ""

# Gera mensagem de commit baseada nas mudanças
print_info "Gerando mensagem de commit baseada nas mudanças..."

# Obtém arquivos modificados
MODIFIED_FILES=$(git diff --cached --name-only)
NEW_FILES=$(git diff --cached --name-only --diff-filter=A)
DELETED_FILES=$(git diff --cached --name-only --diff-filter=D)

# Cria arquivo temporário para a mensagem
TEMP_MSG_FILE=$(mktemp)

# Escreve cabeçalho da mensagem
echo "chore: atualização automática do projeto" > "$TEMP_MSG_FILE"
echo "" >> "$TEMP_MSG_FILE"

# Adiciona informações sobre arquivos modificados
if [ ! -z "$MODIFIED_FILES" ]; then
    echo "📝 Arquivos modificados:" >> "$TEMP_MSG_FILE"
    while IFS= read -r file; do
        if [ ! -z "$file" ]; then
            echo "  - $file" >> "$TEMP_MSG_FILE"
        fi
    done <<< "$MODIFIED_FILES"
    echo "" >> "$TEMP_MSG_FILE"
fi

# Adiciona informações sobre arquivos novos
if [ ! -z "$NEW_FILES" ]; then
    echo "✨ Arquivos novos:" >> "$TEMP_MSG_FILE"
    while IFS= read -r file; do
        if [ ! -z "$file" ]; then
            echo "  - $file" >> "$TEMP_MSG_FILE"
        fi
    done <<< "$NEW_FILES"
    echo "" >> "$TEMP_MSG_FILE"
fi

# Adiciona informações sobre arquivos deletados
if [ ! -z "$DELETED_FILES" ]; then
    echo "🗑️  Arquivos deletados:" >> "$TEMP_MSG_FILE"
    while IFS= read -r file; do
        if [ ! -z "$file" ]; then
            echo "  - $file" >> "$TEMP_MSG_FILE"
        fi
    done <<< "$DELETED_FILES"
    echo "" >> "$TEMP_MSG_FILE"
fi

# Adiciona data e hora
echo "📅 Data: $(date '+%d/%m/%Y %H:%M:%S')" >> "$TEMP_MSG_FILE"

# Mostra preview da mensagem
print_info "Preview da mensagem de commit:"
echo ""
cat "$TEMP_MSG_FILE"
echo ""

# Faz o commit
print_info "Fazendo commit..."
if git commit -F "$TEMP_MSG_FILE"; then
    print_success "Commit realizado com sucesso!"
else
    print_error "Erro ao fazer commit!"
    rm "$TEMP_MSG_FILE"
    exit 1
fi

# Remove arquivo temporário
rm "$TEMP_MSG_FILE"
echo ""

# Obtém o branch atual
CURRENT_BRANCH=$(git branch --show-current)
print_info "Branch atual: $CURRENT_BRANCH"
echo ""

# Faz o push
print_info "Fazendo push para o repositório remoto..."
if git push origin "$CURRENT_BRANCH"; then
    print_success "Push realizado com sucesso!"
else
    print_error "Erro ao fazer push!"
    print_warning "Verifique se você tem permissões e se o repositório remoto está configurado corretamente."
    exit 1
fi

echo ""
print_success "Processo concluído com sucesso! 🎉"
echo ""

# Mostra log dos últimos commits
print_info "Últimos 5 commits:"
echo ""
git log --oneline -5 --decorate
echo ""

