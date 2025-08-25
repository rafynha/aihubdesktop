const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o processo renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Receber mensagens do processo principal
    onOpenAI: (callback) => ipcRenderer.on('open-ai', callback),
    onNewTab: (callback) => ipcRenderer.on('new-tab', callback),
    onCloseTab: (callback) => ipcRenderer.on('close-tab', callback),
    onLoadingStart: (callback) => ipcRenderer.on('loading-start', callback),
    onLoadingStop: (callback) => ipcRenderer.on('loading-stop', callback),
    onLoadingError: (callback) => ipcRenderer.on('loading-error', callback),
    
    // Funções para comunicação com o processo principal
    createAITab: (aiType, url) => ipcRenderer.invoke('create-ai-tab', aiType, url),
    switchAITab: (aiType) => ipcRenderer.invoke('switch-ai-tab', aiType),
    closeAITab: (aiType) => ipcRenderer.invoke('close-ai-tab', aiType),
    hideAllViews: () => ipcRenderer.invoke('hide-all-views'),
    goToHome: () => ipcRenderer.invoke('go-to-home'),
    
    // Função para abrir links externos
    openExternal: (url) => {
        const { shell } = require('electron');
        shell.openExternal(url);
    },
    
    // Controles da janela
    minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
    maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
    closeWindow: () => ipcRenderer.invoke('close-window'),
    
    // Controles do menu hambúrguer
    menuOpened: () => ipcRenderer.invoke('menu-opened'),
    menuClosed: (activeTabType) => ipcRenderer.invoke('menu-closed', activeTabType),
    
    // Remover listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
