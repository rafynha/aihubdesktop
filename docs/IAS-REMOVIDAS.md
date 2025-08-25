# Remoção de IAs - AI Hub Desktop

## IAs Removidas

Foram removidas as seguintes 6 IAs conforme solicitado:

1. **Intercom** 💬 - `https://www.intercom.com/customer-support-software/ai-chatbot`
2. **Drift** 🚀 - `https://www.drift.com`
3. **Kustomer** 🎯 - `https://www.kustomer.com`
4. **Acquire** ⚡ - `https://acquire.io`
5. **LivePerson** ☁️ - `https://www.liveperson.com`
6. **Aisera** 🧩 - `https://aisera.com`

## Modificações Realizadas

### 1. Configuração `aiConfigs`
- Removidas as 6 entradas da configuração JavaScript
- Mantidas apenas 8 IAs: Grok, ChatGPT, DeepSeek, Claude, Copilot, Gemini, Jasper, Perplexity

### 2. Overlay HTML
- Removidos os 6 blocos `overlay-ai-item` correspondentes
- Mantido o layout responsivo do grid de IAs

## IAs Restantes (8 total)

### Originais (6):
1. **Grok** 🤖 - X (Twitter) AI
2. **ChatGPT** 💬 - OpenAI
3. **DeepSeek** 🧠 - DeepSeek AI
4. **Claude** 🎭 - Anthropic
5. **Copilot** 👨‍💻 - Microsoft
6. **Gemini** 🔷 - Google

### Adicionadas Anteriormente (2):
7. **Jasper Chat** ✨ - Jasper AI
8. **Perplexity.ai** 🔍 - Perplexity AI

## Layout Atualizado

O grid agora exibe 8 IAs organizadas de forma responsiva:
- **Desktop**: 4 colunas por linha (2 linhas)
- **Tablet**: 3 colunas por linha 
- **Mobile**: 2 colunas por linha

## Funcionalidades Mantidas

✅ Menu hambúrguer com overlay
✅ Sistema de abas
✅ Home tab com navegação
✅ Estados de minimizar/maximizar
✅ Atalhos de teclado (Ctrl+1-6 para as 6 primeiras IAs)
✅ Drag & drop de abas
✅ Loading com animação do robô

## Arquivos Modificados

- `index.html` - Removidas configurações e itens HTML das 6 IAs

## Status

🟢 **CONCLUÍDO** - As 6 IAs foram removidas com sucesso. A aplicação agora conta com 8 IAs principais, mantendo todas as funcionalidades existentes.
