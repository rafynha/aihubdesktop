# AI Hub Desktop

Um hub desktop moderno para acessar múltiplas inteligências artificiais em um só lugar, desenvolvido com Electron.

## 🚀 Funcionalidades

- **Interface moderna e intuitiva** com design glassmorphism
- **Suporte a múltiplas IAs**: Grok, ChatGPT, DeepSeek e Claude
- **Sistema de abas** para alternar facilmente entre diferentes IAs
- **Webviews nativas** para melhor compatibilidade com sites das IAs
- **Atalhos de teclado** para navegação rápida
- **Menu nativo** da aplicação
- **Indicador de carregamento** e tratamento de erros

## 🔧 Tecnologias

- **Electron** - Framework para aplicações desktop
- **HTML5/CSS3** - Interface moderna com gradientes e backdrop-filter
- **JavaScript** - Lógica da aplicação e comunicação com Electron
- **Webview** - Para carregar sites das IAs de forma isolada

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd ai-hub-desktop
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🎮 Uso

### Atalhos de Teclado

- `Ctrl + 1` - Abrir Grok
- `Ctrl + 2` - Abrir ChatGPT  
- `Ctrl + 3` - Abrir DeepSeek
- `Ctrl + 4` - Abrir Claude
- `Ctrl + W` - Fechar aba ativa
- `Ctrl + T` - Nova aba (menu)
- `Ctrl + Q` - Sair da aplicação

### Interface

- **Botões superiores**: Acesso rápido às IAs
- **Sistema de abas**: Navegue entre múltiplas IAs abertas
- **Webviews**: Cada IA é carregada em sua própria webview isolada
- **Indicadores visuais**: Ícones coloridos para cada IA

## 🔨 Scripts Disponíveis

- `npm start` - Executa a aplicação
- `npm run dev` - Executa em modo de desenvolvimento
- `npm run build` - Gera build para todas as plataformas
- `npm run build-win` - Gera build apenas para Windows
- `npm run build-mac` - Gera build apenas para macOS
- `npm run build-linux` - Gera build apenas para Linux

## 🌐 IAs Suportadas

| IA | URL | Descrição |
|---|---|---|
| **Grok** | https://x.ai/grok | IA do X (Twitter) |
| **ChatGPT** | https://chat.openai.com | OpenAI |
| **DeepSeek** | https://chat.deepseek.com | DeepSeek AI |
| **Claude** | https://claude.ai | Anthropic |

## 🎨 Design

O AI Hub Desktop utiliza um design moderno com:

- **Glassmorphism**: Efeitos de vidro com blur e transparência
- **Gradientes suaves**: Background em gradiente roxo/azul
- **Animações fluidas**: Transições e hover effects
- **Cores temáticas**: Cada IA tem sua cor característica
- **Responsividade**: Interface adaptável a diferentes tamanhos

## 🔒 Segurança

- **Contexto isolado**: Cada webview é isolada das outras
- **Preload script**: Comunicação segura entre processos
- **CSP**: Content Security Policy implementada
- **Node integration desabilitada**: No processo renderer por segurança

## 📂 Estrutura do Projeto

```
ai-hub-desktop/
├── main.js              # Processo principal do Electron
├── preload.js           # Script de comunicação segura
├── index.html           # Interface principal
├── about.html           # Página sobre
├── package.json         # Configurações do projeto
├── assets/              # Recursos da aplicação
└── README.md           # Documentação
```

## 🚧 Desenvolvimento

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Abra uma [issue](issues) no GitHub
2. Descreva o problema detalhadamente
3. Inclua informações do sistema (SO, versão do Node.js, etc.)

## 🎯 Próximas Funcionalidades

- [ ] Suporte a mais IAs (Gemini, Perplexity, etc.)
- [ ] Sincronização de configurações
- [ ] Temas personalizáveis
- [ ] Notificações desktop
- [ ] Histórico de conversas
- [ ] Atalhos personalizáveis
- [ ] Auto-updater

---

Desenvolvido com ❤️ usando Electron
