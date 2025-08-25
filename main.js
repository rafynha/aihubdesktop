const { app, BrowserWindow, BrowserView, Menu, shell, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let browserViews = new Map();
let activeAIType = null; // Rastrear qual IA está ativa no momento

function createWindow() {
    // Criar a janela principal
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true,
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        // Configuração específica para Windows
        titleBarStyle: process.platform === 'win32' ? 'hidden' : 'hiddenInset',
        titleBarOverlay: process.platform === 'win32' ? {
            color: '#667eea',
            symbolColor: '#ffffff',
            height: 30
        } : false,
        backgroundColor: '#667eea',
        // Manter frame true para preservar o menu no Windows
        frame: true,
        show: false,
        // Configurações adicionais para Windows
        ...(process.platform === 'win32' && {
            transparent: false,
            vibrancy: false,
            backgroundMaterial: 'auto',
            // Manter menu visível
            autoHideMenuBar: false
        })
    });

    // Carregar o arquivo HTML principal
    mainWindow.loadFile('index.html');
    
    // Definir título da janela
    mainWindow.setTitle('🚀 AI Hub Desktop');

    // Mostrar a janela quando estiver pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Abrir DevTools em modo de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    // Lidar com links externos
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        // Limpar todas as BrowserViews
        browserViews.forEach((view, aiType) => {
            try {
                if (view && typeof view.destroy === 'function') {
                    view.destroy();
                }
            } catch (error) {
                console.error(`Erro ao destruir BrowserView ${aiType}:`, error);
            }
        });
        browserViews.clear();
    });

    // Ajustar BrowserViews quando a janela for redimensionada ou movida
    mainWindow.on('resize', () => {
        setTimeout(() => adjustBrowserViews(), 100);
    });
    
    mainWindow.on('move', () => {
        setTimeout(() => adjustBrowserViews(), 100);
    });

    // Ajustar BrowserViews quando a janela for restaurada/maximizada
    mainWindow.on('restore', () => {
        console.log('Janela restaurada - ajustando BrowserViews');
        setTimeout(() => {
            adjustBrowserViews();
            // Reexibir a BrowserView ativa APENAS se houver uma activeAIType
            if (activeAIType && browserViews.has(activeAIType)) {
                console.log(`Restaurando aba ativa: ${activeAIType}`);
                showBrowserView(activeAIType);
            }
            // ✅ Removido o fallback que mostrava a primeira aba quando activeAIType = null
        }, 150);
    });

    mainWindow.on('maximize', () => {
        console.log('Janela maximizada - ajustando BrowserViews');
        setTimeout(() => {
            adjustBrowserViews();
            // Reexibir a BrowserView ativa APENAS se houver uma activeAIType
            if (activeAIType && browserViews.has(activeAIType)) {
                console.log(`Restaurando aba ativa: ${activeAIType}`);
                showBrowserView(activeAIType);
            }
            // ✅ Removido o fallback que mostrava a primeira aba quando activeAIType = null
        }, 150);
    });

    mainWindow.on('unmaximize', () => {
        console.log('Janela desmaximizada - ajustando BrowserViews');
        setTimeout(() => {
            adjustBrowserViews();
            // Reexibir a BrowserView ativa APENAS se houver uma activeAIType
            if (activeAIType && browserViews.has(activeAIType)) {
                console.log(`Restaurando aba ativa: ${activeAIType}`);
                showBrowserView(activeAIType);
            }
            // ✅ Removido o fallback que mostrava a primeira aba quando activeAIType = null
        }, 150);
    });
}

function createBrowserView(aiType, url) {
    console.log(`Criando BrowserView para ${aiType} com URL: ${url}`);
    
    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        }
    });

    view.webContents.loadURL(url);
    
    // Event listeners
    view.webContents.on('did-start-loading', () => {
        console.log(`${aiType} iniciou carregamento...`);
        mainWindow.webContents.send('loading-start', aiType);
    });

    view.webContents.on('did-stop-loading', () => {
        console.log(`${aiType} parou de carregar`);
        mainWindow.webContents.send('loading-stop', aiType);
    });

    view.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(`Erro ao carregar ${aiType}:`, errorCode, errorDescription);
        mainWindow.webContents.send('loading-error', aiType, errorDescription);
    });

    // Lidar com links externos
    view.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    browserViews.set(aiType, view);
    
    // Ajustar bounds se esta view for adicionada à janela
    view.webContents.once('dom-ready', () => {
        if (mainWindow.getBrowserViews().includes(view)) {
            adjustBrowserViews();
        }
    });
    
    return view;
}

function adjustBrowserViews() {
    if (!mainWindow || mainWindow.isDestroyed()) {
        console.log('Janela principal não existe ou foi destruída');
        return;
    }

    const bounds = mainWindow.getContentBounds();
    // Calcular altura baseado se há abas abertas
    const hasOpenTabs = browserViews.size > 0;
    const headerHeight = hasOpenTabs ? 90 : 30; // 30px titlebar + (60px abas se houver)
    
    console.log('Ajustando BrowserViews:', {
        windowBounds: bounds,
        headerHeight,
        hasOpenTabs,
        totalViews: browserViews.size,
        activeViews: mainWindow.getBrowserViews().length,
        viewBounds: {
            x: 0,
            y: headerHeight,
            width: bounds.width,
            height: bounds.height - headerHeight
        }
    });
    
    browserViews.forEach((view, aiType) => {
        try {
            const viewBounds = {
                x: 0,
                y: headerHeight,
                width: bounds.width,
                height: bounds.height - headerHeight
            };
            
            view.setBounds(viewBounds);
            console.log(`BrowserView ${aiType} ajustada para:`, viewBounds);
        } catch (error) {
            console.error(`Erro ao ajustar BrowserView ${aiType}:`, error);
        }
    });
}

function showBrowserView(aiType) {
    if (!mainWindow || mainWindow.isDestroyed()) {
        console.log('Janela principal não existe - não é possível mostrar BrowserView');
        return;
    }

    console.log(`Mostrando BrowserView: ${aiType}`);
    
    // Esconder todas as views
    try {
        const currentViews = mainWindow.getBrowserViews();
        currentViews.forEach((view) => {
            mainWindow.removeBrowserView(view);
        });
    } catch (error) {
        console.error('Erro ao esconder BrowserViews:', error);
    }

    // Mostrar a view solicitada
    const view = browserViews.get(aiType);
    if (view) {
        try {
            mainWindow.addBrowserView(view);
            activeAIType = aiType; // Atualizar aba ativa
            console.log(`BrowserView ${aiType} adicionada à janela`);
            
            // Ajustar bounds imediatamente após adicionar
            setTimeout(() => {
                adjustBrowserViews();
                // Forçar repaint da view
                if (view.webContents && !view.webContents.isDestroyed()) {
                    view.webContents.invalidate();
                }
            }, 50);
        } catch (error) {
            console.error(`Erro ao mostrar BrowserView ${aiType}:`, error);
        }
    } else {
        console.log(`BrowserView ${aiType} não encontrada`);
    }
}

// IPC Handlers
ipcMain.handle('create-ai-tab', async (event, aiType, url) => {
    console.log(`IPC: Criando aba para ${aiType}`);
    
    if (!browserViews.has(aiType)) {
        createBrowserView(aiType, url);
    }
    
    showBrowserView(aiType);
    return true;
});

ipcMain.handle('switch-ai-tab', async (event, aiType) => {
    console.log(`IPC: Alternando para ${aiType}`);
    showBrowserView(aiType);
    return true;
});

ipcMain.handle('close-ai-tab', async (event, aiType) => {
    console.log(`IPC: Fechando aba ${aiType}`);
    
    const view = browserViews.get(aiType);
    if (view) {
        try {
            mainWindow.removeBrowserView(view);
            if (typeof view.destroy === 'function') {
                view.destroy();
            }
            browserViews.delete(aiType);
            
            // Limpar activeAIType se esta era a aba ativa
            if (activeAIType === aiType) {
                activeAIType = null;
            }
        } catch (error) {
            console.error(`Erro ao fechar aba ${aiType}:`, error);
            browserViews.delete(aiType); // Remove do Map mesmo com erro
            if (activeAIType === aiType) {
                activeAIType = null;
            }
        }
    }
    
    return true;
});

ipcMain.handle('hide-all-views', async (event) => {
    browserViews.forEach((view) => {
        mainWindow.removeBrowserView(view);
    });
    return true;
});

// Nova função para ir para home (limpa activeAIType)
ipcMain.handle('go-to-home', async (event) => {
    console.log('Indo para home - limpando activeAIType');
    activeAIType = null; // Limpar aba ativa
    browserViews.forEach((view) => {
        mainWindow.removeBrowserView(view);
    });
    return true;
});

ipcMain.handle('minimize-window', async (event) => {
    if (mainWindow) {
        mainWindow.minimize();
    }
    return true;
});

ipcMain.handle('maximize-window', async (event) => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    }
    return true;
});

ipcMain.handle('close-window', async (event) => {
    if (mainWindow) {
        mainWindow.close();
    }
    return true;
});

// Handlers para controlar menu hambúrguer
ipcMain.handle('menu-opened', async (event) => {
    // Temporariamente ocultar todas as BrowserViews quando menu abrir
    const currentViews = Array.from(browserViews.values());
    currentViews.forEach(view => {
        if (mainWindow.getBrowserViews().includes(view)) {
            mainWindow.removeBrowserView(view);
        }
    });
    return true;
});

ipcMain.handle('menu-closed', async (event, activeTabType) => {
    // Restaurar BrowserView ativa quando menu fechar
    if (activeTabType && browserViews.has(activeTabType)) {
        const activeView = browserViews.get(activeTabType);
        mainWindow.addBrowserView(activeView);
        setTimeout(() => adjustBrowserViews(), 50);
    }
    return true;
});

// Este método será chamado quando o Electron tiver terminado a inicialização
app.whenReady().then(() => {
    createWindow();

    // No macOS, é comum recriar uma janela quando o ícone do dock é clicado
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Sair quando todas as janelas forem fechadas, exceto no macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Menu da aplicação
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Nova Aba',
                accelerator: 'CmdOrCtrl+T',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('new-tab');
                    }
                }
            },
            {
                label: 'Fechar Aba',
                accelerator: 'CmdOrCtrl+W',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('close-tab');
                    }
                }
            },
            { type: 'separator' },
            {
                label: 'Sair',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            { role: 'undo', label: 'Desfazer' },
            { role: 'redo', label: 'Refazer' },
            { type: 'separator' },
            { role: 'cut', label: 'Recortar' },
            { role: 'copy', label: 'Copiar' },
            { role: 'paste', label: 'Colar' },
            { role: 'selectall', label: 'Selecionar Tudo' }
        ]
    },
    {
        label: 'Visualizar',
        submenu: [
            { role: 'reload', label: 'Recarregar' },
            { role: 'forceReload', label: 'Forçar Recarregamento' },
            { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
            { type: 'separator' },
            { role: 'resetZoom', label: 'Zoom Normal' },
            { role: 'zoomIn', label: 'Aumentar Zoom' },
            { role: 'zoomOut', label: 'Diminuir Zoom' },
            { type: 'separator' },
            { role: 'togglefullscreen', label: 'Tela Cheia' }
        ]
    },
    {
        label: 'IAs',
        submenu: [
            {
                label: 'Grok',
                accelerator: 'CmdOrCtrl+1',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'grok');
                    }
                }
            },
            {
                label: 'ChatGPT',
                accelerator: 'CmdOrCtrl+2',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'chatgpt');
                    }
                }
            },
            {
                label: 'DeepSeek',
                accelerator: 'CmdOrCtrl+3',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'deepseek');
                    }
                }
            },
            {
                label: 'Claude',
                accelerator: 'CmdOrCtrl+4',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'claude');
                    }
                }
            },
            {
                label: 'Copilot',
                accelerator: 'CmdOrCtrl+5',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'copilot');
                    }
                }
            },
            {
                label: 'Gemini',
                accelerator: 'CmdOrCtrl+6',
                click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('open-ai', 'gemini');
                    }
                }
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre o AI Hub',
                click: () => {
                    const aboutWindow = new BrowserWindow({
                        width: 400,
                        height: 300,
                        modal: true,
                        parent: mainWindow,
                        webPreferences: {
                            nodeIntegration: false,
                            contextIsolation: true
                        }
                    });
                    aboutWindow.setMenu(null);
                    aboutWindow.loadFile('about.html');
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Limpeza antes de sair da aplicação
app.on('before-quit', () => {
    console.log('Limpando recursos antes de sair...');
    
    // Limpar todas as BrowserViews
    browserViews.forEach((view, aiType) => {
        try {
            if (view && typeof view.destroy === 'function') {
                console.log(`Destruindo BrowserView: ${aiType}`);
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.removeBrowserView(view);
                }
                view.destroy();
            }
        } catch (error) {
            console.error(`Erro ao destruir BrowserView ${aiType}:`, error);
        }
    });
    
    browserViews.clear();
    activeAIType = null; // Limpar aba ativa
    console.log('Limpeza concluída');
});

// Limpeza quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
    console.log('Todas as janelas fechadas');
    
    // Limpar BrowserViews restantes
    browserViews.forEach((view, aiType) => {
        try {
            if (view && typeof view.destroy === 'function') {
                view.destroy();
            }
        } catch (error) {
            console.error(`Erro na limpeza final de ${aiType}:`, error);
        }
    });
    
    browserViews.clear();
    activeAIType = null; // Limpar aba ativa
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
