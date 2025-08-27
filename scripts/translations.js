// Translations for the Inventory Management System
const translations = {
    sk: {
        // Navigation
        dashboard: "Dashboard",
        products: "Produkty",
        categories: "Kategórie",
        suppliers: "Dodávatelia",
        stock: "Sklad",
        reports: "Reporty",
        settings: "Nastavenia",
        
        // Dashboard
        totalProducts: "Celkovo produktov",
        totalValue: "Celková hodnota",
        lowStock: "Nízky stav",
        outOfStock: "Vypredané",
        recentMovements: "Posledné pohyby",
        lowStockAlerts: "Upozornenia na nízky stav",
        
        // Products
        addProduct: "Pridať produkt",
        newProduct: "Nový produkt",
        export: "Exportovať",
        import: "Importovať",
        name: "Názov",
        productName: "Názov produktu",
        ean: "EAN",
        plu: "PLU",
        category: "Kategória",
        supplier: "Dodávateľ",
        quantity: "Množstvo",
        price: "Cena",
        status: "Stav",
        actions: "Akcie",
        columns: "Stĺpce",
        columnVisibility: "Zobrazenie stĺpcov",
        showAll: "Zobraziť všetky",
        hideAll: "Skryť všetky",
        edit: "Upraviť",
        delete: "Vymazať",
        saveProduct: "Uložiť produkt",
        editProduct: "Upraviť produkt",
        cancel: "Zrušiť",
        selectCategory: "Vybrať kategóriu",
        selectSupplier: "Vybrať dodávateľa",
        selectProduct: "Vybrať produkt",
        cost: "Nákup bez DPH",
        costWithoutVAT: "Nákup bez DPH",
        costWithVAT: "Nákup s DPH",
        vatRate: "Sadzba DPH (%)",
        vat23: "23% (štandardná)",
        vat10: "10% (znížená)",
        vat5: "5% (znížená)",
        vat0: "0% (nulová)",
        vatCustom: "Vlastná sadzba",
        customVatRate: "Vlastná sadzba DPH (%)",
        sellingPrice: "Predajná cena",
        sellingPriceWithoutVAT: "Predaj bez DPH",
        sellingPriceWithVAT: "Predaj s DPH",
        margin: "Marža",
        initialQuantity: "Množstvo",
        reorderLevel: "Úroveň objednávky",
        description: "Popis",
        
        // Categories
        newCategory: "Nová kategória",
        categoryName: "Názov kategórie",
        saveCategory: "Uložiť kategóriu",
        addNewCategory: "Pridať novú kategóriu",
        
        // Suppliers
        newSupplier: "Nový dodávateľ",
        supplierName: "Názov dodávateľa",
        addNewSupplier: "Pridať nového dodávateľa",
        editSupplier: "Upraviť dodávateľa",
        email: "Email",
        phone: "Telefón",
        address: "Adresa",
        ico: "IČO",
        dic: "DIČ",
        saveSupplier: "Uložiť dodávateľa",
        confirmDeleteSupplier: "Naozaj chcete vymazať tohto dodávateľa?",
    confirmDeleteCategory: "Naozaj chcete vymazať túto kategóriu?",
    categoryInUse: "Kategória sa používa",
    categoryInUseMessage: "Táto kategória sa používa v {count} produktoch. Naozaj chcete vymazať kategóriu? Produkty zostanú bez kategórie.",
        
        // Stock
        stockIn: "Príjem",
        stockOut: "Výdaj",
        stockAdjustment: "Úprava skladu",
        stockMovement: "Pohyb skladu",
        currentStock: "Aktuálny stav",
        reorderLevel: "Úroveň objednávky",
        lastMovement: "Posledný pohyb",
        notes: "Poznámky",
        saveMovement: "Uložiť pohyb",
        history: "História",
        
        // Reports
        stockValueReport: "Report hodnoty skladu",
        lowStockReport: "Report nízkeho stavu",
        chartWillBeDisplayed: "Graf sa zobrazí tu",
        totalStockValue: "Celková hodnota skladu",
        totalProducts: "Počet produktov",
        totalQuantity: "Celkové množstvo",
        categoryBreakdown: "Rozdelenie podľa kategórií",
        productsCount: "produktov",
        lowStockProducts: "Produkty s nízkym stavom",
        outOfStockProducts: "Vypredané produkty",
        valueAtRisk: "Hodnota v riziku",
        productsNeedingRestock: "Produkty vyžadujúce doplnenie",
        noLowStockProducts: "Žiadne produkty s nízkym stavom",
        
        // Settings
        appearance: "Vzhľad",
        theme: "Motív",
        light: "Svetlý",
        dark: "Tmavý",
        language: "Jazyk",
        appLanguage: "Jazyk aplikácie",
        slovak: "Slovenský",
        english: "English",
        appInfo: "Informácie o aplikácii",
        appName: "Názov",
        version: "Verzia",
        author: "Autor",
        inventorySystem: "Systém správy skladu",
        saveSettings: "Uložiť nastavenia",
        resetDefaults: "Obnoviť predvolené",
        
        // Status
        inStock: "Na sklade",
        lowStockStatus: "Nízky",
        outOfStockStatus: "Vypredané",
        
        // Messages
        productAdded: "Produkt bol úspešne pridaný",
        productUpdated: "Produkt bol úspešne aktualizovaný",
        productDeleted: "Produkt bol úspešne vymazaný",
        categoryAdded: "Kategória bola úspešne pridaná",
        supplierAdded: "Dodávateľ bol úspešne pridaný",
        stockUpdated: "Stav skladu bol úspešne aktualizovaný",
        settingsSaved: "Nastavenia boli úspešne uložené",
        errorOccurred: "Nastala chyba",
        errorSavingSettings: "Chyba pri ukladaní nastavení",
        confirmDelete: "Naozaj chcete vymazať tento záznam?",
        errorSavingProduct: "Chyba pri ukladaní produktu",
        errorUpdatingStock: "Chyba pri aktualizácii skladu",
        errorSavingCategory: "Chyba pri ukladaní kategórie",
        errorSavingSupplier: "Chyba pri ukladaní dodávateľa",
        eanExists: "Produkt s týmto EAN kódom už existuje",
        
        // Import
        importProducts: "Importovať produkty",
        selectFile: "Vybrať Excel/CSV súbor",
        importOptions: "Možnosti importu",
        skipDuplicates: "Preskočiť duplikáty (podľa EAN)",
        updateExisting: "Aktualizovať existujúce produkty",
        addQuantity: "Pridať množstvo k existujúcim produktom",
        previewTitle: "Náhľad (prvých 5 riadkov)",
        startImport: "Spustiť import",
        importSuccess: "Import úspešne dokončený",
        importError: "Chyba pri importe",
        fileRequired: "Vyberte súbor",
        invalidFile: "Neplatný súbor",
            exportSuccess: "Export úspešne dokončený",
    exportSuccessExcel: "Produkty boli úspešne exportované do Excel súboru",
    exportSuccessCSV: "Produkty boli úspešne exportované do CSV súboru",
    errorExporting: "Chyba pri exporte",
        errorImporting: "Chyba pri importe",
        
        // Search
        searchProducts: "Hľadať produkty...",
        searchSuppliers: "Hľadať dodávateľov...",
        
        // Empty states
        noProducts: "Žiadne produkty",
        errorLoadingProducts: "Chyba pri načítaní produktov",
        noCategories: "Žiadne kategórie",
        noSuppliers: "Žiadni dodávatelia",
        noProductsFound: "Nenašli sa žiadne produkty",
        noStockMovements: "Žiadne pohyby skladu",
        noLowStockAlerts: "Žiadne upozornenia na nízky stav",
        
        // Dashboard Enhancements
        topProducts: "Top produkty podľa hodnoty",
        categoryStats: "Štatistiky kategórií",
        quickActions: "Rýchle akcie",
        systemInfo: "Systémové informácie",
        addProduct: "Pridať produkt",
        stockIn: "Príjem skladu",
        exportData: "Exportovať dáta",
        importData: "Importovať dáta",
        lastBackup: "Posledná záloha",
        databaseSize: "Veľkosť databázy",
        totalCategories: "Celkovo kategórií",
        totalSuppliers: "Celkovo dodávateľov",
        backupDatabase: "Zálohovať databázu",
        backupSuccess: "Databáza bola úspešne zálohovaná",
        backupError: "Chyba pri zálohovaní databázy",
        backupInProgress: "Zálohovanie v priebehu...",
        
        // Backup Settings
        backupSettings: "Nastavenia zálohovania",
        backupPath: "Cesta k zálohám",
        changeBackupPath: "Zmeniť cestu",
        autoBackupEnabled: "Automatické zálohovanie",
        autoBackupDescription: "Zálohovať automaticky pri každom spustení aplikácie",
        backupRetentionDays: "Uchovávať zálohy (dni)",
        backupRetentionDescription: "Staršie zálohy sa automaticky vymažú",
        backupCompression: "Kompresia záloh",
        backupCompressionDescription: "Zmenšiť veľkosť zálohových súborov",
        backupNotifications: "Notifikácie o zálohovaní",
        backupNotificationsDescription: "Zobrazovať upozornenia o úspešnom zálohovaní",
        testBackupPath: "Testovať cestu",
        cleanupOldBackups: "Vyčistiť staré zálohy",
        viewBackupFolder: "Zobraziť priečinok",
        noCompression: "Bez kompresie",
        zipCompression: "ZIP kompresia",
        backupPathTestSuccess: "Cesta k zálohám je dostupná",
        backupPathTestError: "Chyba pri prístupe k ceste záloh",
        oldBackupsCleaned: "Staré zálohy boli vyčistené",
        backupFolderOpened: "Priečinok záloh bol otvorený",
        
        // Settings additional
        saveSettings: "Uložiť nastavenia",
        resetSettings: "Obnoviť predvolené",
        settingsSaved: "Nastavenia boli uložené",
        settingsReset: "Nastavenia boli obnovené na predvolené",
        errorSavingSettings: "Chyba pri ukladaní nastavení",
        errorResettingSettings: "Chyba pri obnovovaní nastavení",
        
        // Advanced Filtering
        advancedFilters: "Pokročilé filtrovanie",
        showFilters: "Zobraziť filtre",
        hideFilters: "Skryť filtre",
        allCategories: "Všetky kategórie",
        allSuppliers: "Všetci dodávatelia",
        allStatuses: "Všetky stavy",
        priceRange: "Rozsah ceny",
        quantityRange: "Rozsah množstva",
        marginRange: "Rozsah marže",
        sortBy: "Zoradiť podľa",
        sortByName: "Názov (A-Z)",
        sortByNameDesc: "Názov (Z-A)",
        sortByPrice: "Cena (najnižšia)",
        sortByPriceDesc: "Cena (najvyššia)",
        sortByQuantity: "Množstvo (najnižšie)",
        sortByQuantityDesc: "Množstvo (najvyššie)",
        sortByMargin: "Marža (najnižšia)",
        sortByMarginDesc: "Marža (najvyššia)",
        sortByUpdated: "Posledná aktualizácia",
        applyFilters: "Aplikovať filtre",
        clearFilters: "Vyčistiť filtre",
        saveFilters: "Uložiť filtre",
        showingResults: "Zobrazuje sa {count} z {total} produktov",
        activeFilters: "Aktívne filtre",
        removeFilter: "Odobrať filter"
        
    },
    
    en: {
        // Navigation
        dashboard: "Dashboard",
        products: "Products",
        categories: "Categories",
        suppliers: "Suppliers",
        stock: "Stock",
        reports: "Reports",
        settings: "Settings",
        
        // Dashboard
        totalProducts: "Total Products",
        totalValue: "Total Value",
        lowStock: "Low Stock",
        outOfStock: "Out of Stock",
        recentMovements: "Recent Movements",
        lowStockAlerts: "Low Stock Alerts",
        
        // Products
        addProduct: "Add Product",
        newProduct: "New Product",
        export: "Export",
        import: "Import",
        name: "Name",
        productName: "Product Name",
        ean: "EAN",
        plu: "PLU",
        category: "Category",
        supplier: "Supplier",
        quantity: "Quantity",
        price: "Price",
        status: "Status",
        actions: "Actions",
        columns: "Columns",
        columnVisibility: "Column Visibility",
        showAll: "Show All",
        hideAll: "Hide All",
        edit: "Edit",
        delete: "Delete",
        saveProduct: "Save Product",
        editProduct: "Edit Product",
        cancel: "Cancel",
        selectCategory: "Select Category",
        selectSupplier: "Select Supplier",
        selectProduct: "Select Product",
        cost: "Purchase without VAT",
        costWithoutVAT: "Purchase without VAT",
        costWithVAT: "Purchase with VAT",
        vatRate: "VAT Rate (%)",
        vat23: "23% (standard)",
        vat10: "10% (reduced)",
        vat5: "5% (reduced)",
        vat0: "0% (zero)",
        vatCustom: "Custom rate",
        customVatRate: "Custom VAT Rate (%)",
        sellingPrice: "Selling Price",
        sellingPriceWithoutVAT: "Selling without VAT",
        sellingPriceWithVAT: "Selling with VAT",
        margin: "Margin",
        initialQuantity: "Quantity",
        reorderLevel: "Reorder Level",
        description: "Description",
        
        // Categories
        newCategory: "New Category",
        categoryName: "Category Name",
        saveCategory: "Save Category",
        addNewCategory: "Add New Category",
        
        // Suppliers
        newSupplier: "New Supplier",
        supplierName: "Supplier Name",
        addNewSupplier: "Add New Supplier",
        editSupplier: "Edit Supplier",
        email: "Email",
        phone: "Phone",
        address: "Address",
        ico: "ICO",
        dic: "DIC",
        saveSupplier: "Save Supplier",
        confirmDeleteSupplier: "Are you sure you want to delete this supplier?",
    confirmDeleteCategory: "Are you sure you want to delete this category?",
    categoryInUse: "Category in use",
    categoryInUseMessage: "This category is used in {count} products. Do you really want to delete the category? Products will remain without category.",
        
        // Stock
        stockIn: "Stock In",
        stockOut: "Stock Out",
        stockAdjustment: "Stock Adjustment",
        stockMovement: "Stock Movement",
        currentStock: "Current Stock",
        reorderLevel: "Reorder Level",
        lastMovement: "Last Movement",
        notes: "Notes",
        saveMovement: "Save Movement",
        history: "History",
        
        // Reports
        stockValueReport: "Stock Value Report",
        lowStockReport: "Low Stock Report",
        chartWillBeDisplayed: "Chart will be displayed here",
        totalStockValue: "Total Stock Value",
        totalProducts: "Total Products",
        totalQuantity: "Total Quantity",
        categoryBreakdown: "Category Breakdown",
        productsCount: "products",
        lowStockProducts: "Low Stock Products",
        outOfStockProducts: "Out of Stock Products",
        valueAtRisk: "Value at Risk",
        productsNeedingRestock: "Products Needing Restock",
        noLowStockProducts: "No low stock products",
        
        // Settings
        appearance: "Appearance",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        language: "Language",
        appLanguage: "Application Language",
        slovak: "Slovak",
        english: "English",
        appInfo: "Application Information",
        appName: "Name",
        version: "Version",
        author: "Author",
        inventorySystem: "Inventory Management System",
        saveSettings: "Save Settings",
        resetDefaults: "Reset to Defaults",
        
        // Status
        inStock: "In Stock",
        lowStockStatus: "Low",
        outOfStockStatus: "Out of Stock",
        
        // Messages
        productAdded: "Product added successfully",
        productUpdated: "Product updated successfully",
        productDeleted: "Product deleted successfully",
        categoryAdded: "Category added successfully",
        supplierAdded: "Supplier added successfully",
        stockUpdated: "Stock updated successfully",
        settingsSaved: "Settings saved successfully",
        errorOccurred: "An error occurred",
        errorSavingSettings: "Error saving settings",
        confirmDelete: "Are you sure you want to delete this record?",
        errorSavingProduct: "Error saving product",
        errorUpdatingStock: "Error updating stock",
        errorSavingCategory: "Error saving category",
        errorSavingSupplier: "Error saving supplier",
        eanExists: "Product with this EAN code already exists",
        
        // Import
        importProducts: "Import Products",
        selectFile: "Select Excel/CSV File",
        importOptions: "Import Options",
        skipDuplicates: "Skip duplicates (by EAN)",
        updateExisting: "Update existing products",
        addQuantity: "Add quantity to existing products",
        previewTitle: "Preview (first 5 rows)",
        startImport: "Start Import",
        importSuccess: "Import completed successfully",
        importError: "Import error",
        fileRequired: "Please select a file",
        invalidFile: "Invalid file",
            exportSuccess: "Export completed successfully",
    exportSuccessExcel: "Products successfully exported to Excel file",
    exportSuccessCSV: "Products successfully exported to CSV file",
    errorExporting: "Error exporting",
        errorImporting: "Error importing",
        
        // Search
        searchProducts: "Search products...",
        searchSuppliers: "Search suppliers...",
        
        // Empty states
        noProducts: "No products",
        errorLoadingProducts: "Error loading products",
        noCategories: "No categories",
        noSuppliers: "No suppliers",
        noProductsFound: "No products found",
        noStockMovements: "No stock movements",
        noLowStockAlerts: "No low stock alerts",
        
        // Dashboard Enhancements
        topProducts: "Top Products by Value",
        categoryStats: "Category Statistics",
        quickActions: "Quick Actions",
        systemInfo: "System Information",
        addProduct: "Add Product",
        stockIn: "Stock In",
        exportData: "Export Data",
        importData: "Import Data",
        lastBackup: "Last Backup",
        databaseSize: "Database Size",
        totalCategories: "Total Categories",
        totalSuppliers: "Total Suppliers",
        backupDatabase: "Backup Database",
        backupSuccess: "Database backed up successfully",
        backupError: "Error backing up database",
        backupInProgress: "Backup in progress...",
        
        // Backup Settings
        backupSettings: "Backup Settings",
        backupPath: "Backup Path",
        changeBackupPath: "Change Path",
        autoBackupEnabled: "Auto Backup",
        autoBackupDescription: "Backup automatically on app startup",
        backupRetentionDays: "Keep Backups (days)",
        backupRetentionDescription: "Older backups will be automatically deleted",
        backupCompression: "Backup Compression",
        backupCompressionDescription: "Reduce backup file size",
        backupNotifications: "Backup Notifications",
        backupNotificationsDescription: "Show notifications for successful backups",
        testBackupPath: "Test Path",
        cleanupOldBackups: "Clean Old Backups",
        viewBackupFolder: "View Folder",
        noCompression: "No Compression",
        zipCompression: "ZIP Compression",
        backupPathTestSuccess: "Backup path is accessible",
        backupPathTestError: "Error accessing backup path",
        oldBackupsCleaned: "Old backups cleaned",
        backupFolderOpened: "Backup folder opened",
        
        // Settings additional
        saveSettings: "Save Settings",
        resetSettings: "Reset to Defaults",
        settingsSaved: "Settings saved successfully",
        settingsReset: "Settings reset to defaults",
        errorSavingSettings: "Error saving settings",
        errorResettingSettings: "Error resetting settings",
        
        // Advanced Filtering
        advancedFilters: "Advanced Filtering",
        showFilters: "Show Filters",
        hideFilters: "Hide Filters",
        allCategories: "All Categories",
        allSuppliers: "All Suppliers",
        allStatuses: "All Statuses",
        priceRange: "Price Range",
        quantityRange: "Quantity Range",
        marginRange: "Margin Range",
        sortBy: "Sort By",
        sortByName: "Name (A-Z)",
        sortByNameDesc: "Name (Z-A)",
        sortByPrice: "Price (Lowest)",
        sortByPriceDesc: "Price (Highest)",
        sortByQuantity: "Quantity (Lowest)",
        sortByQuantityDesc: "Quantity (Highest)",
        sortByMargin: "Margin (Lowest)",
        sortByMarginDesc: "Margin (Highest)",
        sortByUpdated: "Last Updated",
        applyFilters: "Apply Filters",
        clearFilters: "Clear Filters",
        saveFilters: "Save Filters",
        showingResults: "Showing {count} of {total} products",
        activeFilters: "Active Filters",
        removeFilter: "Remove Filter"
        
    }
};

// Function to get translation
function getTranslation(key, language = 'sk') {
    return translations[language][key] || key;
}

// Function to update all text in the application
function updateLanguage(language) {
    // Update navigation
    document.querySelectorAll('[data-page="dashboard"] span').forEach(el => el.textContent = getTranslation('dashboard', language));
    document.querySelectorAll('[data-page="products"] span').forEach(el => el.textContent = getTranslation('products', language));
    document.querySelectorAll('[data-page="categories"] span').forEach(el => el.textContent = getTranslation('categories', language));
    document.querySelectorAll('[data-page="suppliers"] span').forEach(el => el.textContent = getTranslation('suppliers', language));
    document.querySelectorAll('[data-page="stock"] span').forEach(el => el.textContent = getTranslation('stock', language));
    document.querySelectorAll('[data-page="reports"] span').forEach(el => el.textContent = getTranslation('reports', language));
    document.querySelectorAll('[data-page="settings"] span').forEach(el => el.textContent = getTranslation('settings', language));
    
    // Update page titles
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const currentPage = document.querySelector('.nav-item.active').getAttribute('data-page');
        pageTitle.textContent = getTranslation(currentPage, language);
    }
    
    // Update buttons and other elements
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) addProductBtn.innerHTML = `<i class="fas fa-plus"></i> ${getTranslation('addProduct', language)}`;
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = getTranslation('searchProducts', language);
    
    // Update modal titles and buttons
    const productModalTitle = document.getElementById('product-modal-title');
    if (productModalTitle) productModalTitle.textContent = getTranslation('addProduct', language);
    
    // Update form labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        const key = label.getAttribute('data-translate');
        if (key) {
            label.textContent = getTranslation(key, language);
        }
    });
    
    // Update placeholders
    const placeholders = document.querySelectorAll('[data-translate-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (key) {
            element.placeholder = getTranslation(key, language);
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, getTranslation, updateLanguage };
}

// Expose functions globally for browser use
if (typeof window !== 'undefined') {
    window.getTranslation = getTranslation;
    window.updateLanguage = updateLanguage;
    window.translations = translations;
}

