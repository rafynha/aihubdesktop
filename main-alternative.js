const { app, BrowserWindow, BrowserView, Menu, shell, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let browserViews = new Map();

function createWindow() {
    // Criar a janela principal - versão alternativa com frame nativo
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
        // Configuração para manter frame nativo mas com cor personalizada
        titleBarStyle: 'default',
        backgroundColor: '#667eea',
        show: false,
        // Configurações específicas para Windows
        ...(process.platform === 'win32' && {
            // Tenta aplicar cor na barra de título nativa
            vibrancy: false,
            backgroundMaterial: 'auto'
        })
    });

    // Carregar o arquivo HTML principal
    mainWindow.loadFile('index-alternative.html');
    
    // Definir título da janela
    mainWindow.setTitle('🚀 AI Hub Desktop - Frame Nativo');

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
        browserViews.forEach(view => view.destroy());
        browserViews.clear();
    });

    // Ajustar BrowserViews quando a janela for redimensionada ou movida
    mainWindow.on('resize', () => {
        setTimeout(() => adjustBrowserViews(), 100);
    });
    
    mainWindow.on('move', () => {
        setTimeout(() => adjustBrowserViews(), 100);
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
    const bounds = mainWindow.getContentBounds();
    const headerHeight = 120; // Apenas header, sem barra de título personalizada
    
    console.log('Ajustando BrowserViews (frame nativo):', {
        windowBounds: bounds,
        headerHeight,
        viewBounds: {
            x: 0,
            y: headerHeight,
            width: bounds.width,
            height: bounds.height - headerHeight
        }
    });
    
    browserViews.forEach((view, aiType) => {
        const viewBounds = {
            x: 0,
            y: headerHeight,
            width: bounds.width,
            height: bounds.height - headerHeight
        };
        
        view.setBounds(viewBounds);
        console.log(`BrowserView ${aiType} ajustada para:`, viewBounds);
    });
}

function showBrowserView(aiType) {
    // Esconder todas as views
    browserViews.forEach((view) => {
        mainWindow.removeBrowserView(view);
    });

    // Mostrar a view solicitada
    const view = browserViews.get(aiType);
    if (view) {
        mainWindow.addBrowserView(view);
        // Ajustar bounds imediatamente após adicionar
        setTimeout(() => adjustBrowserViews(), 50);
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
        mainWindow.removeBrowserView(view);
        view.destroy();
        browserViews.delete(aiType);
    }
    
    return true;
});

ipcMain.handle('hide-all-views', async (event) => {
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
