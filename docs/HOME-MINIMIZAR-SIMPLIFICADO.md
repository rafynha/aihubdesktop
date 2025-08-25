# Correção Simplificada - Estado da Home ao Minimizar/Maximizar

## Problema

Quando o usuário está na tela inicial (home) e minimiza a aplicação, ao maximizar não estava voltando para a tela inicial corretamente.

## Solução Simplificada

Implementei uma lógica bem simples e direta:

### Regra Única
**Se `activeTab === 'home'` quando a janela for focada, forçar estado da home**

### Código Implementado

```javascript
// Gerenciamento de estado da janela (minimizar/maximizar)
window.addEventListener('focus', function() {
    console.log('Janela focada - estado atual:', activeTab);
    
    // REGRA SIMPLES: Se activeTab for 'home', garantir que estamos na tela inicial
    if (activeTab === 'home') {
        console.log('Restaurando tela inicial');
        forceHomeState();
    }
});

// Função simples para forçar estado da home
async function forceHomeState() {
    try {
        // Ocultar todas as BrowserViews
        await window.electronAPI.hideAllViews();
        
        // Mostrar tela de boas-vindas
        const welcomeElement = document.getElementById('welcome');
        const contentElement = document.querySelector('.content');
        welcomeElement.style.display = 'flex';
        contentElement.classList.add('showing-welcome');
        
        // Ocultar container de abas
        const tabContainer = document.getElementById('tabContainer');
        tabContainer.style.display = 'none';
        
        // Mostrar botão flutuante
        const floatingButton = document.getElementById('floatingTabsButton');
        floatingButton.classList.add('show');
        
        // Garantir que home tab esteja ativa
        const homeTab = document.getElementById('tab-home');
        if (homeTab) {
            homeTab.classList.add('active');
        }
        
        console.log('Estado da home restaurado');
    } catch (error) {
        console.error('Erro ao restaurar home:', error);
    }
}
```

## Vantagens da Solução Simplificada

1. **Código Limpo**: Muito menos código, mais fácil de entender e manter
2. **Lógica Direta**: Uma única verificação: `if (activeTab === 'home')`
3. **Sem Ambiguidade**: Não há verificações complexas ou condições múltiplas
4. **Focada no Problema**: Resolve especificamente o caso da home, sem interferir com outras abas
5. **Logs Claros**: Mostra exatamente o que está acontecendo

## Como Funciona

1. **Minimizar na Home**: `activeTab` permanece como `'home'`
2. **Maximizar**: Event listener `focus` é disparado
3. **Verificação**: Se `activeTab === 'home'`, chama `forceHomeState()`
4. **Resultado**: Tela inicial é restaurada corretamente

## Teste

### Cenário:
1. ✅ Ficar na tela inicial (home)
2. ✅ Minimizar a aplicação
3. ✅ Maximizar a aplicação

### Resultado:
- ✅ Aparece a tela inicial corretamente
- ✅ Container de abas permanece oculto
- ✅ Botão flutuante visível
- ✅ Tela de boas-vindas visível

## Status

🟢 **SIMPLIFICADO E FUNCIONAL** - Solução muito mais limpa e direta que resolve o problema específico.
