const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Check if we're in development mode
const isDev = process.env.ELECTRON_IS_DEV === '1' || !app.isPackaged;

let mainWindow;
let backendProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../build/logo192.png'),
    title: 'Hotel Mini ERP'
  });

  const startUrl = isDev ? 'http://localhost:3000' : null;

  if (isDev) {
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
    return;
  }

  // In production: we'll wait for the backend to be ready before loading the UI
  const indexPath = `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL('about:blank');

  waitForBackend(5253, 30000)
    .then(() => {
      mainWindow.loadURL(indexPath);
    })
    .catch((err) => {
      console.error('Backend did not become ready in time:', err);
      // Still try to load the UI so user can see errors
      mainWindow.loadURL(indexPath);
    });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Start bundled backend when running a packaged app
  if (!isDev) {
    const exeName = process.platform === 'win32' ? 'HotelMiniERP.API.exe' : 'HotelMiniERP.API';
    const exePath = path.join(process.resourcesPath, 'backend', exeName);
    try {
      backendProcess = spawn(exePath, [], { windowsHide: true });
      backendProcess.stdout?.on('data', data => console.log(`[backend] ${data}`));
      backendProcess.stderr?.on('data', data => console.error(`[backend] ${data}`));
      backendProcess.on('close', code => console.log(`Backend exited with code ${code}`));
    } catch (err) {
      console.error('Failed to start backend executable:', err);
    }
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function waitForBackend(port, timeoutMs) {
  const start = Date.now();
  const url = `http://127.0.0.1:${port}/`;

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        // any response is acceptable
        res.resume();
        resolve();
      });

      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error('timeout'));
        } else {
          setTimeout(check, 500);
        }
      });

      req.setTimeout(2000, () => {
        req.abort();
      });
    };

    check();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch (e) {
      console.error('Error killing backend process', e);
    }
  }
});

