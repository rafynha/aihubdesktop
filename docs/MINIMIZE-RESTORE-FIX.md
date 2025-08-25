# Correção: Problema de Minimizar/Maximizar Janela

## 🐛 **Problema Identificado**

Quando a janela era minimizada e depois restaurada/maximizada, a tela ficava toda roxa (cor de fundo) e o conteúdo das BrowserViews não era exibido até que o usuário trocasse de aba ou clicasse no menu.

## ✅ **Solução Implementada**

### 1. **Rastreamento de Aba Ativa**
- Adicionado variável global `activeAIType` para rastrear qual IA está ativa
- Atualizada sempre que uma BrowserView é exibida

### 2. **Event Listeners Adicionados**
Implementados novos event listeners na janela principal:

- **`restore`**: Quando janela sai do estado minimizado
- **`maximize`**: Quando janela é maximizada
- **`unmaximize`**: Quando janela sai do estado maximizado

### 3. **Função `adjustBrowserViews` Melhorada**
- Adicionadas validações para janela existente/válida
- Logs mais detalhados para debug
- Tratamento de erros melhorado
- Informações sobre views ativas/totais

### 4. **Função `showBrowserView` Robusta**
- Validações de janela válida
- Rastreamento da aba ativa (`activeAIType`)
- Forçar invalidação/repaint da view
- Melhor tratamento de erros
- Logs detalhados

### 5. **Limpeza de Estado**
- `activeAIType` é limpo quando abas são fechadas
- Limpeza adequada no encerramento da aplicação

## 🔧 **Código Implementado**

### Event Listeners:
```javascript
// Restaurar BrowserView quando janela é restaurada
mainWindow.on('restore', () => {
    setTimeout(() => {
        adjustBrowserViews();
        if (activeAIType && browserViews.has(activeAIType)) {
            showBrowserView(activeAIType);
        }
    }, 150);
});

// Mesmo para maximize/unmaximize
mainWindow.on('maximize', () => { /* similar */ });
mainWindow.on('unmaximize', () => { /* similar */ });
```

### Rastreamento de Estado:
```javascript
let activeAIType = null; // Variável global

function showBrowserView(aiType) {
    // ... código existente ...
    activeAIType = aiType; // Atualizar aba ativa
    // ... resto da função ...
}
```

### Função Melhorada:
```javascript
function adjustBrowserViews() {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    
    // Logs detalhados com informações da janela e views
    // Tratamento de erros individual para cada view
    // Validações robustas
}
```

## 🎯 **Resultado**

- ✅ **Janela restaura**: BrowserView ativa é reexibida automaticamente
- ✅ **Redimensionamento**: Views ajustam corretamente em qualquer mudança
- ✅ **Estado consistente**: Aba ativa é mantida entre minimize/restore
- ✅ **Logs detalhados**: Facilita debug de problemas futuros
- ✅ **Tratamento robusto**: Validações previnem crashes

## 🧪 **Como Testar**

1. Abrir uma IA (ex: ChatGPT)
2. Minimizar a janela
3. Restaurar a janela → **Deve mostrar o conteúdo imediatamente**
4. Maximizar/desmaximizar → **Views ajustam automaticamente**
5. Trocar entre abas → **Funciona normalmente**

## 📊 **Debug/Logs**

Os logs agora mostram:
- Estado da janela (bounds, views ativas/totais)
- Qual aba está sendo restaurada
- Erros específicos com contexto
- Sequência de eventos de restore/maximize

## 🔮 **Benefícios Adicionais**

- **Performance**: Views são invalidadas/repintadas quando necessário
- **Robustez**: Múltiplas validações previnem crashes
- **Manutenibilidade**: Logs detalhados facilitam debug
- **UX**: Transições suaves entre estados da janela
