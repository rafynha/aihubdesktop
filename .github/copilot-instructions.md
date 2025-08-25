<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Hub Desktop - Copilot Instructions

Este é um projeto Electron para um hub desktop de múltiplas inteligências artificiais.

## Contexto do Projeto

- **Tecnologia Principal**: Electron (desktop app)
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Funcionalidade**: Hub para acessar Grok, ChatGPT, DeepSeek e Claude
- **Arquitetura**: Processo principal (main.js) + processo renderer (index.html)

## Diretrizes de Código

### Electron
- Use BrowserViews ao invés de webviews/iframes para melhor compatibilidade com sites que bloqueiam frame-ancestors
- Mantenha comunicação segura entre processos usando preload.js
- Implemente contextIsolation e desabilite nodeIntegration no renderer
- Use IPC (Inter-Process Communication) para comunicação entre main e renderer
- Gerencie BrowserViews no processo principal com ajuste automático de dimensões

### Frontend
- Mantenha o design glassmorphism com backdrop-filter
- Use CSS Grid e Flexbox para layouts responsivos
- Implemente animações suaves com CSS transitions
- Mantenha cores temáticas para cada IA

### JavaScript
- Use JavaScript vanilla (sem frameworks)
- Implemente event listeners para atalhos de teclado
- Gerencie estado das abas com Set e objetos simples
- Use async/await para comunicação IPC com o processo principal
- Trate erros de carregamento das BrowserViews

### Segurança
- Mantenha webSecurity habilitada
- Use contextIsolation: true
- Implemente allowpopups apenas quando necessário para BrowserViews
- Valide URLs antes de carregar em BrowserViews

### Performance
- Use loading states para melhor UX
- Implemente BrowserViews para carregamento otimizado
- Otimize CSS com will-change para animações
- Minimize reflows e repaints
- Ajuste dimensões das BrowserViews dinamicamente

## Convenções

- Nomes de variáveis em camelCase
- Nomes de arquivos em kebab-case
- Comentários em português
- IDs e classes CSS descritivas
- Event handlers nomeados de forma clara

## Funcionalidades Específicas

- Sistema de abas dinâmico
- Atalhos de teclado globais
- Menu nativo da aplicação
- Tratamento de erros de rede
- Indicadores visuais de carregamento
- Suporte a múltiplas IAs simultaneamente
