const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            // preload: path.join(__dirname, 'renderer.js')
        }
    });

    win.setMenu(null);
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
