const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Temporal para debugging
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Determinar la ruta correcta dependiendo de si está empaquetado o no
  const isDev = !app.isPackaged;
  const indexPath = isDev
    ? path.join(__dirname, 'dist', 'index.html')
    : path.join(process.resourcesPath, 'dist', 'index.html');

  console.log('Loading from:', indexPath);
  mainWindow.loadFile(indexPath);

  // Abrir DevTools para debugging
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});