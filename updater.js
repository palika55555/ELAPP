const { autoUpdater } = require('electron-updater');
const { app, dialog, ipcMain } = require('electron');

class UpdateManager {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.isUpdateAvailable = false;
        this.updateInfo = null;
        
        // Konfigurácia updater - vypneme automatické sťahovanie
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = false;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Updater events
        autoUpdater.on('checking-for-update', () => {
            console.log('Checking for updates...');
            this.sendStatusToWindow('Kontrolujem aktualizácie...');
        });

        autoUpdater.on('update-available', (info) => {
            console.log('Update available:', info);
            this.isUpdateAvailable = true;
            this.updateInfo = info;
            this.sendStatusToWindow('Dostupná aktualizácia', info);
            this.showUpdateDialog(info);
        });

        autoUpdater.on('update-not-available', (info) => {
            console.log('No update available:', info);
            this.sendStatusToWindow('Aplikácia je aktuálna', info);
        });

        autoUpdater.on('error', (err) => {
            console.error('Updater error:', err);
            this.sendStatusToWindow('Chyba pri kontrole aktualizácií', err);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            console.log('Download progress:', progressObj);
            this.sendStatusToWindow('Sťahujem aktualizáciu...', progressObj);
        });

        autoUpdater.on('update-downloaded', (info) => {
            console.log('Update downloaded:', info);
            this.sendStatusToWindow('Aktualizácia pripravená na inštaláciu', info);
            this.showInstallDialog(info);
        });

        // IPC handlers
        ipcMain.handle('check-for-updates', () => {
            return this.checkForUpdates();
        });

        ipcMain.handle('download-update', () => {
            return this.downloadUpdate();
        });

        ipcMain.handle('install-update', () => {
            return this.installUpdate();
        });

        ipcMain.handle('get-update-status', () => {
            return {
                isUpdateAvailable: this.isUpdateAvailable,
                updateInfo: this.updateInfo
            };
        });
    }

    sendStatusToWindow(message, data = null) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('update-status', { message, data });
        }
    }

    async checkForUpdates() {
        try {
            console.log('Checking for updates...');
            await autoUpdater.checkForUpdates();
            return { success: true };
        } catch (error) {
            console.error('Error checking for updates:', error);
            return { success: false, error: error.message };
        }
    }

    async downloadUpdate() {
        try {
            console.log('Downloading update...');
            await autoUpdater.downloadUpdate();
            return { success: true };
        } catch (error) {
            console.error('Error downloading update:', error);
            return { success: false, error: error.message };
        }
    }

    async installUpdate() {
        try {
            console.log('Installing update...');
            autoUpdater.quitAndInstall();
            return { success: true };
        } catch (error) {
            console.error('Error installing update:', error);
            return { success: false, error: error.message };
        }
    }

    async showUpdateDialog(info) {
        const result = await dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'Dostupná aktualizácia',
            message: `Dostupná je nová verzia aplikácie: ${info.version}`,
            detail: `Aktuálna verzia: ${app.getVersion()}\nNová verzia: ${info.version}\n\nChcete stiahnuť aktualizáciu?`,
            buttons: ['Stiahnuť', 'Neskôr'],
            defaultId: 0,
            cancelId: 1
        });

        if (result.response === 0) {
            this.downloadUpdate();
        }
    }

    async showInstallDialog(info) {
        const result = await dialog.showMessageBox(this.mainWindow, {
            type: 'info',
            title: 'Aktualizácia pripravená',
            message: 'Aktualizácia bola úspešne stiahnutá',
            detail: `Verzia ${info.version} je pripravená na inštaláciu. Aplikácia sa reštartuje po inštalácii.`,
            buttons: ['Inštalovať teraz', 'Neskôr'],
            defaultId: 0,
            cancelId: 1
        });

        if (result.response === 0) {
            this.installUpdate();
        }
    }

    // Spustenie kontroly aktualizácií
    startUpdateCheck() {
        // Počkáme 5 sekúnd po spustení aplikácie
        setTimeout(() => {
            this.checkForUpdates();
        }, 5000);
    }
}

module.exports = UpdateManager;
