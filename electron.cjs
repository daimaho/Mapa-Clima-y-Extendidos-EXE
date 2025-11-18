const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Permitir cargar archivos locales
    },
  });

  const isDev = !app.isPackaged;
  
  // Registrar protocolo personalizado para servir archivos
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6); // Quitar 'app://'
    const filePath = path.normalize(`${__dirname}/dist/${url}`);
    callback({ path: filePath });
  });

  if (isDev) {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    console.log('Loading from (dev):', indexPath);
    mainWindow.loadFile(indexPath);
  } else {
    const indexPath = path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html');
    console.log('Loading from (prod):', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // Registrar protocolo antes de crear la ventana
  protocol.registerFileProtocol('local', (request, callback) => {
    const url = request.url.replace('local://', '');
    const isDev = !app.isPackaged;
    const basePath = isDev ? __dirname : process.resourcesPath;
    const filePath = path.join(basePath, 'dist', url);
    
    console.log('Requested:', url);
    console.log('Resolved to:', filePath);
    
    callback({ path: filePath });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});