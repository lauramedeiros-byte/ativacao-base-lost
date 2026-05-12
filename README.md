# Miro Seazone — Board de Motivos de Lost

Board interativo para correlacionar e segmentar motivos de lost entre Lançamentos e Marketplace, com mensagens de e-mail e WhatsApp por grupo.

## Stack

- **Next.js 14** (pages router)
- **Upstash Redis** (persistência via REST API)
- **Deploy:** Vercel (zero config)

---

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas chaves do Upstash

# 3. Rodar
npm run dev
```

Acesse `http://localhost:3000`

---

## Deploy no Vercel

### 1. Suba o projeto para o GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create miro-seazone --public --push
# ou crie o repo manualmente no GitHub e siga as instruções
```

### 2. Importe no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório
3. **Adicione as variáveis de ambiente** no painel do Vercel:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Clique em **Deploy**

### 3. Onde encontrar as chaves do Upstash

1. Acesse [console.upstash.com](https://console.upstash.com)
2. Crie um banco Redis (plano free funciona perfeitamente)
3. Vá em **REST API** → copie `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| Drag & drop | Arraste cards entre grupos — salva automaticamente |
| Renomear grupos | Clique no nome do grupo |
| Novo grupo | Botão no header |
| Remover grupo | Botão ✕ no grupo (cards vão para "Sem Grupo") |
| Mensagens | Cada grupo tem painel de e-mails e WhatsApps |
| Tags de etapa | Autocomplete com tags criadas anteriormente |
| Persistência | Tudo salvo no Upstash — qualquer pessoa que abrir a URL vê o estado atual |

---

## Estrutura do projeto

```
pages/
  index.js          ← board completo (React)
  api/
    board.js        ← GET/POST estado no Upstash
styles/
  global.css
```

## Chave usada no Redis

`seazone:lost_board_v1` — JSON com `{ groups, messages, tags }`
