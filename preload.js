const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getProducts: () => ipcRenderer.invoke('db-get-products'),
  addProduct: (product) => ipcRenderer.invoke('db-add-product', product),
  updateProduct: (product) => ipcRenderer.invoke('db-update-product', product),
  deleteProduct: (id) => ipcRenderer.invoke('db-delete-product', id),
  checkEanAvailability: (ean, excludeId) => ipcRenderer.invoke('db-check-ean-availability', ean, excludeId),
  
  getCategories: () => ipcRenderer.invoke('db-get-categories'),
  addCategory: (category) => ipcRenderer.invoke('db-add-category', category),
  updateCategory: (category) => ipcRenderer.invoke('db-update-category', category),
  
  getSuppliers: () => ipcRenderer.invoke('db-get-suppliers'),
  addSupplier: (supplier) => ipcRenderer.invoke('db-add-supplier', supplier),
  getSupplier: (id) => ipcRenderer.invoke('db-get-supplier', id),
  updateSupplier: (supplier) => ipcRenderer.invoke('db-update-supplier', supplier),
      deleteSupplier: (id) => ipcRenderer.invoke('db-delete-supplier', id),
    deleteCategory: (id) => ipcRenderer.invoke('db-delete-category', id),
  
  updateStock: (productId, quantity, type, additionalData = {}) => ipcRenderer.invoke('db-update-stock', { productId, quantity, type, additionalData }),
  getStockHistory: (productId) => ipcRenderer.invoke('db-get-stock-history', productId),
  
  searchProducts: (searchTerm) => ipcRenderer.invoke('db-search-products', searchTerm),
  searchSuppliers: (searchTerm) => ipcRenderer.invoke('db-search-suppliers', searchTerm),
  getLowStockProducts: () => ipcRenderer.invoke('db-get-low-stock-products'),
  getDashboardStats: () => ipcRenderer.invoke('db-get-dashboard-stats'),
  
  // File dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  exportToFile: (filePath, content) => ipcRenderer.invoke('export-to-file', filePath, content),
  
  // Settings operations
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  
  // Backup operations
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  getDatabaseInfo: () => ipcRenderer.invoke('get-database-info'),
  testBackupPath: (path) => ipcRenderer.invoke('test-backup-path', path),
  cleanupOldBackups: () => ipcRenderer.invoke('cleanup-old-backups'),
  openBackupFolder: (path) => ipcRenderer.invoke('open-path', path),
  selectBackupPath: () => ipcRenderer.invoke('select-directory'),
  openPath: (path) => ipcRenderer.invoke('open-path', path),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Database maintenance
  runMigrations: () => ipcRenderer.invoke('run-migrations'),
  resetDatabase: () => ipcRenderer.invoke('reset-database'),
  
  // Update operations
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getUpdateStatus: () => ipcRenderer.invoke('get-update-status'),
  
  // Update event listener
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
  removeUpdateStatusListener: () => ipcRenderer.removeAllListeners('update-status')
});

