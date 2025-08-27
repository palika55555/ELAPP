const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const DatabaseManager = require('./database/database');
const UpdateManager = require('./updater');

let mainWindow;
let db;
let updateManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    titleBarStyle: 'default',
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Inicializácia updater po zobrazení okna
    updateManager = new UpdateManager(mainWindow);
    updateManager.startUpdateCheck();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  // Initialize database
  db = new DatabaseManager();
  db.initialize();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for database operations
ipcMain.handle('db-get-products', async () => {
  return await db.getProducts();
});

ipcMain.handle('db-add-product', async (event, product) => {
  return await db.addProduct(product);
});

ipcMain.handle('db-update-product', async (event, product) => {
  return await db.updateProduct(product);
});

ipcMain.handle('db-delete-product', async (event, id) => {
  return await db.deleteProduct(id);
});

ipcMain.handle('db-get-categories', async () => {
  return await db.getCategories();
});

ipcMain.handle('db-add-category', async (event, category) => {
  return await db.addCategory(category);
});

ipcMain.handle('db-update-category', async (event, category) => {
  return await db.updateCategory(category);
});

ipcMain.handle('db-get-suppliers', async () => {
  return await db.getSuppliers();
});

ipcMain.handle('db-add-supplier', async (event, supplier) => {
  return await db.addSupplier(supplier);
});

ipcMain.handle('db-get-supplier', async (event, id) => {
  return await db.getSupplier(id);
});

ipcMain.handle('db-update-supplier', async (event, supplier) => {
  return await db.updateSupplier(supplier);
});

ipcMain.handle('db-delete-supplier', async (event, id) => {
  return await db.deleteSupplier(id);
});

ipcMain.handle('db-delete-category', async (event, id) => {
  return await db.deleteCategory(id);
});

ipcMain.handle('db-check-ean-availability', async (event, ean, excludeId) => {
  return await db.checkEanAvailability(ean, excludeId);
});

ipcMain.handle('db-update-stock', async (event, { productId, quantity, type, additionalData }) => {
  return await db.updateStock(productId, quantity, type, additionalData);
});

ipcMain.handle('db-get-stock-history', async (event, productId) => {
  return await db.getStockHistory(productId);
});

ipcMain.handle('db-search-products', async (event, searchTerm) => {
  return await db.searchProducts(searchTerm);
});

ipcMain.handle('db-search-suppliers', async (event, searchTerm) => {
  return await db.searchSuppliers(searchTerm);
});

ipcMain.handle('db-get-low-stock-products', async () => {
  return await db.getLowStockProducts();
});

ipcMain.handle('db-get-dashboard-stats', async () => {
  return await db.getDashboardStats();
});

ipcMain.handle('run-migrations', async () => {
  try {
    console.log('Starting database migrations...');
    await db.runMigrations();
    console.log('Database migrations completed successfully');
    return { success: true, message: 'Migrations completed successfully' };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reset-database', async () => {
  try {
    console.log('Resetting database...');
    await db.close();
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, 'database', 'inventory.db');
    
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Database file deleted');
    }
    
    // Reinitialize database
    db = new Database();
    await db.initialize();
    console.log('Database reset and reinitialized successfully');
    return { success: true, message: 'Database reset successfully' };
  } catch (error) {
    console.error('Database reset error:', error);
    return { success: false, error: error.message };
  }
});

// File dialog handlers
ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// File export handler
ipcMain.handle('export-to-file', async (event, filePath, content) => {
  const fs = require('fs');
  try {
    // Pridať BOM pre správne zobrazenie slovenských znakov v Excel
    const BOM = '\uFEFF';
    await fs.promises.writeFile(filePath, BOM + content, 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

// Settings handlers
ipcMain.handle('get-settings', async (event) => {
  try {
    const settingsPath = path.join(__dirname, 'settings.json');
    let settings = {
      theme: 'light',
      language: 'sk',
      backupPath: path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'InventoryBackup')
    };
    
    try {
      const savedSettings = await fs.promises.readFile(settingsPath, 'utf8');
      settings = { ...settings, ...JSON.parse(savedSettings) };
    } catch (error) {
      // Settings file doesn't exist, use defaults
    }
    
    return { success: true, settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    const settingsPath = path.join(__dirname, 'settings.json');
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Database backup and info handlers
ipcMain.handle('backup-database', async (event) => {
  try {
    const dbPath = db.getDatabasePath();
    const stats = await fs.promises.stat(dbPath);
    const dbSize = stats.size;
    
    // Get backup path from settings
    const settingsPath = path.join(__dirname, 'settings.json');
    let backupDir = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'InventoryBackup');
    
    try {
      const savedSettings = await fs.promises.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(savedSettings);
      if (settings.backupPath) {
        backupDir = settings.backupPath;
      }
    } catch (error) {
      // Use default backup directory
    }
    
    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Ensure backup directory exists
    await fs.promises.mkdir(backupDir, { recursive: true });
    
    const backupPath = path.join(backupDir, `inventory_backup_${timestamp}.db`);
    
    // Copy database file
    await fs.promises.copyFile(dbPath, backupPath);
    
    // Save backup info
    const backupInfo = {
      timestamp: new Date().toISOString(),
      path: backupPath,
      size: dbSize,
      originalSize: dbSize
    };
    
    const backupInfoPath = path.join(backupDir, 'backup-info.json');
    await fs.promises.writeFile(backupInfoPath, JSON.stringify(backupInfo, null, 2));
    
    return { 
      success: true, 
      backupPath: backupPath,
      timestamp: backupInfo.timestamp,
      size: dbSize
    };
  } catch (error) {
    console.error('Error backing up database:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-database-info', async (event) => {
  try {
    const dbPath = db.getDatabasePath();
    const stats = await fs.promises.stat(dbPath);
    const dbSize = stats.size;
    
    // Get backup path from settings
    const settingsPath = path.join(__dirname, 'settings.json');
    let backupDir = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'InventoryBackup');
    
    try {
      const savedSettings = await fs.promises.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(savedSettings);
      if (settings.backupPath) {
        backupDir = settings.backupPath;
      }
    } catch (error) {
      // Use default backup directory
    }
    
    // Get last backup info
    const backupInfoPath = path.join(backupDir, 'backup-info.json');
    let lastBackup = 'Never';
    let lastBackupSize = 0;
    
    try {
      const backupInfo = JSON.parse(await fs.promises.readFile(backupInfoPath, 'utf8'));
      lastBackup = backupInfo.timestamp;
      lastBackupSize = backupInfo.size;
    } catch (error) {
      // No backup info file exists
    }
    
    return {
      size: dbSize,
      lastBackup: lastBackup,
      lastBackupSize: lastBackupSize
    };
  } catch (error) {
    console.error('Error getting database info:', error);
    return { 
      size: 0, 
      lastBackup: 'Error', 
      lastBackupSize: 0 
    };
  }
});

// Backup settings handlers
ipcMain.handle('test-backup-path', async (event, backupPath) => {
  try {
    await fs.promises.access(backupPath, fs.constants.W_OK);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('cleanup-old-backups', async (event) => {
  try {
    // Get backup path from settings
    const settingsPath = path.join(__dirname, 'settings.json');
    let backupPath = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'InventoryBackup');
    
    try {
      const savedSettings = await fs.promises.readFile(settingsPath, 'utf8');
      const settings = JSON.parse(savedSettings);
      if (settings.backupPath) {
        backupPath = settings.backupPath;
      }
    } catch (error) {
      // Use default backup directory
    }
    
    const retentionDays = 30;
    
    const files = await fs.promises.readdir(backupPath);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.db') && file.startsWith('inventory_backup_')) {
        const filePath = path.join(backupPath, file);
        const stats = await fs.promises.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.promises.unlink(filePath);
          deletedCount++;
        }
      }
    }
    
    return { success: true, cleanedCount: deletedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-path', async (event, path) => {
  try {
    const { shell } = require('electron');
    await shell.openPath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-directory', async (event) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Directory'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, filePaths: result.filePaths };
    } else {
      return { success: false, error: 'No directory selected' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Update handlers sú už registrované v UpdateManager

// Get app version handler
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

