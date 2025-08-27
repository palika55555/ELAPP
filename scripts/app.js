// Main application JavaScript
class InventoryApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.products = [];
        this.categories = [];
        this.suppliers = [];
        this.currentStockType = 'in';
        this.editingProductId = null; // Track if we're editing a product
        this.editingSupplierId = null; // Track if we're editing a supplier
        this.settings = {
            theme: 'light',
            language: 'sk',
            backupPath: ''
        };
        
        // Inventory functionality
        this.inventoryData = [];
        this.inventoryActive = false;
        
        // Update functionality
        this.updateStatus = {
            isUpdateAvailable: false,
            updateInfo: null,
            isDownloading: false,
            downloadProgress: 0
        };
        
        console.log('InventoryApp constructor initialized');
        this.initializeApp();
    }

    async initializeApp() {
        console.log('Starting app initialization...');
        
        try {
            await this.loadSettings();
            console.log('Settings loaded');
            
            this.applySettings();
            console.log('Settings applied');
            
            this.setupEventListeners();
            console.log('Event listeners setup');
            
            await this.loadInitialData();
            console.log('Initial data loaded');
            
            // Force dashboard to be active
            console.log('Forcing dashboard page...');
            this.forceDashboardPage();
            
            // Initialize responsive features
            this.setupMobileFormHandling();
            this.optimizeImages();

            this.setupModalScaling();
    
            
            // Force scrollbar to appear
            this.forceScrollbarDisplay();
            
            // Setup update listeners
            this.setupUpdateListeners();
            
            // Load app version
            this.loadAppVersion();
            
            console.log('App initialization completed successfully');
        } catch (error) {
            console.error('Error during app initialization:', error);
        }
    }

    forceDashboardPage() {
        console.log('Force dashboard page called');
        
        // Remove all active states from pages
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.classList.remove('active');
            console.log('Removed active from page:', page.id);
        });
        
        // Remove all active states from navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            console.log('Removed active from nav item:', item.dataset.page);
        });
        
        // Show and activate dashboard
        const dashboardPage = document.getElementById('dashboard-page');
        const dashboardNav = document.querySelector('[data-page="dashboard"]');
        
        console.log('Dashboard nav found:', !!dashboardNav);
        console.log('Dashboard page found:', !!dashboardPage);
        
        if (dashboardPage) {
            dashboardPage.classList.add('active');
            console.log('Dashboard page activated');
        }
        
        if (dashboardNav) {
            dashboardNav.classList.add('active');
            console.log('Dashboard nav set to active');
        }
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = 'Dashboard';
            console.log('Page title updated to Dashboard');
        }
        
        this.currentPage = 'dashboard';
        console.log('Dashboard page forced to be active');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
                
                // On mobile, close sidebar after navigation
                if (window.innerWidth <= 768) {
                    this.toggleSidebar();
                }
            });
        });
        
        // Responsive sidebar toggle
        this.setupResponsiveSidebar();
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleWindowResize();
            this.optimizeLayoutForWindowSize();
        });
        
        // Remove tooltips when clicking anywhere
        document.addEventListener('click', () => {
            const existingTooltips = document.querySelectorAll('.custom-tooltip');
            existingTooltips.forEach(tooltip => tooltip.remove());
        });
        
        // Remove tooltips when scrolling
        document.addEventListener('scroll', () => {
            const existingTooltips = document.querySelectorAll('.custom-tooltip');
            existingTooltips.forEach(tooltip => tooltip.remove());
        }, true);

        // Search functionality
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });
        
        // Advanced filtering setup
        this.setupAdvancedFiltering();

        // Modal close buttons
        document.querySelectorAll('.close, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Product form
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // EAN validation
        const eanInput = document.getElementById('product-ean');
        let eanValidationTimeout;
        eanInput.addEventListener('input', (e) => {
            clearTimeout(eanValidationTimeout);
            const ean = e.target.value.trim();
            
            if (ean.length > 0) {
                eanValidationTimeout = setTimeout(async () => {
                    await this.validateEanField(ean);
                }, 500);
            } else {
                this.clearEanValidation();
            }
        });
        
        // VAT calculation setup
        this.setupVatCalculation();

        // Stock form
        document.getElementById('stock-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStockSubmit();
        });

        // Category form
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCategorySubmit();
        });

        // Supplier form
        document.getElementById('supplier-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSupplierSubmit();
        });

        // Button event listeners
        this.setupButtonListeners();
        
        // Settings event listeners
        this.handleSettingsChange();
    }

    setupButtonListeners() {
        // Add product buttons
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.openProductModal();
        });

        document.getElementById('new-product-btn').addEventListener('click', () => {
            this.openProductModal();
        });

        // Add supplier button
        document.getElementById('add-supplier-btn').addEventListener('click', () => {
            this.openSupplierModal();
        });



        // Category and supplier buttons
        document.getElementById('new-category-btn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        document.getElementById('new-supplier-btn').addEventListener('click', () => {
            this.openSupplierModal();
        });

        // Export button
        document.getElementById('export-products-btn').addEventListener('click', () => {
            this.exportProducts();
        });

        // Import button
        document.getElementById('import-products-btn').addEventListener('click', () => {
            this.openImportModal();
        });

        // Stock movement buttons
        document.getElementById('stock-in-btn').addEventListener('click', () => {
            this.openStockModal('in');
        });

        document.getElementById('stock-out-btn').addEventListener('click', () => {
            this.openStockModal('out');
        });

        document.getElementById('stock-adjustment-btn').addEventListener('click', () => {
            this.openStockModal('adjustment');
        });

        // Backup database button in system info
        const backupDbBtn = document.getElementById('backup-db-btn');
        if (backupDbBtn) {
            backupDbBtn.addEventListener('click', () => {
                this.backupDatabase();
            });
        }

        // Refresh system info button
        const refreshSystemInfoBtn = document.getElementById('refresh-system-info');
        if (refreshSystemInfoBtn) {
            refreshSystemInfoBtn.addEventListener('click', () => {
                this.updateSystemInfo();
            });
        }
    }

    async loadInitialData() {
        console.log('Loading initial data...');

        try {
            // Run migrations first to ensure database is up to date
            try {
                console.log('Running migrations...');
                await window.electronAPI.runMigrations();
                console.log('Migrations completed');
            } catch (migrationError) {
                console.log('Migration already up to date or not needed');
            }
            
            // Load all data in parallel
            console.log('Loading data from database...');
            const [products, categories, suppliers] = await Promise.all([
                window.electronAPI.getProducts(),
                window.electronAPI.getCategories(),
                window.electronAPI.getSuppliers()
            ]);

            this.products = products;
            this.categories = categories;
            this.suppliers = suppliers;

            console.log('Data loaded:', {
                products: products.length,
                categories: categories.length,
                suppliers: suppliers.length
            });

            // Populate dropdowns
            this.populateDropdowns();
            
            // Populate filter dropdowns
            this.populateFilterDropdowns();
            
            // Update dashboard
            await this.updateDashboard();
            
            // Update system information
            this.updateSystemInfo();
            
            console.log('Initial data loading completed');
            
            // Only force dashboard page if no specific page is active
            if (!this.currentPage || this.currentPage === 'dashboard') {
                setTimeout(() => {
                    this.forceDashboardPage();
                }, 50);
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showNotification('Error loading data', 'error');
        }
    }

    populateDropdowns() {
        // Populate category dropdown
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        // Populate supplier dropdown
        const supplierSelect = document.getElementById('product-supplier');
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        this.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });

        // Populate stock product dropdown
        const stockProductSelect = document.getElementById('stock-product');
        stockProductSelect.innerHTML = '<option value="">Select Product</option>';
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (${product.sku})`;
            stockProductSelect.appendChild(option);
        });
    }

    showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Remove all tooltips when changing pages
        const existingTooltips = document.querySelectorAll('.custom-tooltip');
        existingTooltips.forEach(tooltip => tooltip.remove());
        
        // Remove active from all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const navItem = document.querySelector(`[data-page="${pageName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        } else {
            console.error('Navigation item not found for page:', pageName);
        }

        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getTranslation(pageName);
        }

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            console.error('Page not found:', pageName);
        }

        this.currentPage = pageName;

        // Update search input and buttons based on current page
        this.updateSearchForPage(pageName);

        // Load page-specific data
        this.loadPageData(pageName);
        
        // Update page content with current language
        this.updatePageContent();
        
        // Force scrollbar display for products page
        if (pageName === 'products') {
            setTimeout(() => {
                this.forceScrollbarDisplay();
            }, 100);
        }
        
        console.log('Page shown successfully:', pageName);
    }

    async loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                await this.updateDashboard();
                break;
            case 'products':
                this.renderProducts();
                break;
            case 'categories':
                this.renderCategories();
                break;
            case 'suppliers':
                this.renderSuppliers();
                break;
            case 'stock':
                this.renderStockTable();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'settings':
                this.updateSettingsForm();
                this.updateSystemInfo();
                break;
        }
        
        // Update page content after loading data
        this.updatePageContent();
    }

    async updateDashboard() {
        try {
            const stats = await window.electronAPI.getDashboardStats();
            const lowStockProducts = await window.electronAPI.getLowStockProducts();

            // Update statistics
            document.getElementById('total-products').textContent = stats.totalProducts;
            document.getElementById('total-value').textContent = `€${stats.totalValue.toFixed(2)}`;
            document.getElementById('low-stock-count').textContent = stats.lowStockCount;
            document.getElementById('out-of-stock-count').textContent = stats.outOfStockCount;

            // Update recent movements
            this.renderRecentMovements(stats.recentMovements);

            // Update low stock alerts
            this.renderLowStockAlerts(lowStockProducts);

            // Update top products
            this.renderTopProducts();

            // Update category statistics
            this.renderCategoryStats();

            // Update dashboard content with current language
            this.updateDashboardContent();

            // Setup quick actions
            this.setupQuickActions();

        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    setupQuickActions() {
        const container = document.querySelector('.quick-actions-grid');
        if (!container) {
            console.error('Quick actions container not found');
            return;
        }

        console.log('Setting up quick actions...');

        container.innerHTML = `
            <button class="quick-action-btn" onclick="app.openProductModal()">
                <i class="fas fa-plus"></i>
                <span>${this.getTranslation('addProduct')}</span>
            </button>
            <button class="quick-action-btn" onclick="app.openImportModal()">
                <i class="fas fa-upload"></i>
                <span>${this.getTranslation('import')}</span>
            </button>
            <button class="quick-action-btn" onclick="app.exportProducts()">
                <i class="fas fa-download"></i>
                <span>${this.getTranslation('export')}</span>
            </button>
            <button class="quick-action-btn" onclick="app.backupDatabase()">
                <i class="fas fa-database"></i>
                <span>${this.getTranslation('backupDatabase')}</span>
            </button>
        `;

        console.log('Quick actions setup complete');
    }

    renderRecentMovements(movements) {
        const container = document.getElementById('recent-movements');
        container.innerHTML = '';

        if (movements.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>${this.getTranslation('noStockMovements')}</p></div>`;
            return;
        }

        movements.forEach(movement => {
            const item = document.createElement('div');
            item.className = 'movement-item';
            item.innerHTML = `
                <div class="movement-info">
                    <h4>${movement.product_name}</h4>
                    <p>${new Date(movement.created_at).toLocaleDateString()}</p>
                </div>
                <span class="movement-quantity ${movement.type}">
                    ${movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}${movement.quantity}
                </span>
            `;
            container.appendChild(item);
        });
    }

    renderLowStockAlerts(products) {
        const container = document.getElementById('low-stock-alerts');
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>${this.getTranslation('noLowStockAlerts')}</p></div>`;
            return;
        }

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.innerHTML = `
                <div class="movement-info">
                    <h4>${product.name}</h4>
                    <p>${this.getTranslation('currentStock')}: ${product.quantity} | ${this.getTranslation('reorderLevel')}: ${product.reorder_level}</p>
                </div>
                <span class="status-badge low-stock">${this.getTranslation('lowStockStatus')}</span>
            `;
            container.appendChild(item);
        });
    }

    renderTopProducts() {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        // Get top 5 products by value (price * quantity)
        const topProducts = this.products
            .map(product => ({
                ...product,
                value: (product.price || 0) * (product.quantity || 0)
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        if (topProducts.length === 0) {
            container.innerHTML = '<p>Žiadne produkty</p>';
            return;
        }

        container.innerHTML = topProducts.map(product => `
            <div class="top-product-item">
                <span class="product-name">${product.name}</span>
                <span class="product-value">€${product.value.toFixed(2)}</span>
            </div>
        `).join('');
    }

    renderCategoryStats() {
        const container = document.getElementById('category-stats-list');
        if (!container) return;

        // Count products by category
        const categoryStats = {};
        this.products.forEach(product => {
            const category = product.category_name || 'Bez kategórie';
            categoryStats[category] = (categoryStats[category] || 0) + 1;
        });

        // Sort by count and get top 5
        const topCategories = Object.entries(categoryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (topCategories.length === 0) {
            container.innerHTML = '<p>Žiadne kategórie</p>';
            return;
        }

        container.innerHTML = topCategories.map(([category, count]) => `
            <div class="category-stat-item">
                <span class="category-name">${category}</span>
                <span class="category-count">${count} produktov</span>
            </div>
        `).join('');
    }

    renderProducts() {
        // Use the new filtering system
        this.applyFilters();
        
        // Force scrollbar display after rendering
        setTimeout(() => {
            this.forceScrollbarDisplay();
        }, 50);
    }

    getProductStatus(product) {
        if (product.quantity === 0) {
            return { class: 'out-of-stock', text: this.getTranslation('outOfStockStatus') };
        } else if (product.quantity <= 10) {
            return { class: 'low-stock', text: this.getTranslation('lowStockStatus') };
        } else {
            return { class: 'in-stock', text: this.getTranslation('inStock') };
        }
    }

    renderCategories() {
        const container = document.getElementById('categories-grid');
        container.innerHTML = '';

        if (this.categories.length === 0) {
            container.innerHTML = `<div class="empty-state">${this.getTranslation('noCategories')}</div>`;
            return;
        }

        this.categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-content">
                    <h3>${category.name}</h3>
                    <p>${category.description || 'No description'}</p>
                </div>
                <div class="category-actions">
                    <button class="btn btn-sm btn-info" onclick="app.editCategory('${category.id}')" title="${this.getTranslation('edit')}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteCategory('${category.id}')" title="${this.getTranslation('delete')}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderSuppliers() {
        const cardsContainer = document.getElementById('suppliers-cards-container');
        cardsContainer.innerHTML = '';

        if (this.suppliers.length === 0) {
            cardsContainer.innerHTML = `<div class="empty-state">${this.getTranslation('noSuppliers')}</div>`;
            return;
        }

        this.suppliers.forEach(supplier => {
            const card = document.createElement('div');
            card.className = 'supplier-card';
            card.innerHTML = `
                <div class="supplier-card-header">
                    <div class="supplier-name">${supplier.name}</div>
                    <div class="supplier-ico">${supplier.ico || 'Bez IČO'}</div>
                </div>
                <div class="supplier-card-content">
                    <div class="supplier-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span class="contact-label">Email:</span>
                            <span class="contact-value">${supplier.email || 'Neuvedený'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span class="contact-label">Telefón:</span>
                            <span class="contact-value">${supplier.phone || 'Neuvedený'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="contact-label">Adresa:</span>
                            <span class="contact-value">${supplier.address || 'Neuvedená'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-id-card"></i>
                            <span class="contact-label">DIČ:</span>
                            <span class="contact-value">${supplier.dic || 'Neuvedené'}</span>
                        </div>
                    </div>
                </div>
                <div class="supplier-card-actions">
                    <button class="btn btn-sm btn-info" onclick="app.editSupplier('${supplier.id}')" title="Upraviť">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteSupplier('${supplier.id}')" title="Vymazať">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }



    renderStockTable() {
        const cardsContainer = document.getElementById('stock-cards-container');
        cardsContainer.innerHTML = '';

        if (this.products.length === 0) {
            cardsContainer.innerHTML = '<div class="empty-state">No products found</div>';
            return;
        }

        this.products.forEach(product => {
            // Calculate margin
            const cost = product.cost || 0;
            const price = product.price || 0;
            const priceWithVat = product.price_with_vat || price * 1.23;
            const costWithVat = product.cost_with_vat || cost * 1.23;
            const margin = priceWithVat > 0 ? ((priceWithVat - costWithVat) / priceWithVat * 100) : 0;
            const marginClass = margin >= 30 ? 'high' : margin >= 15 ? 'medium' : 'low';
            
            const card = document.createElement('div');
            card.className = 'stock-product-card';
            card.innerHTML = `
                <div class="stock-card-header">
                    <div class="stock-product-name">${product.name}</div>
                    <div class="stock-product-ean">${product.sku}</div>
                </div>
                <div class="stock-card-content">
                    <div class="stock-quantity">
                        <span class="quantity-label">Množstvo:</span>
                        <span class="quantity-value">${product.quantity || 0} ${product.unit || 'ks'}</span>
                    </div>
                    <div class="stock-margin">
                        <span class="margin-label">${this.getTranslation('stockMargin')}:</span>
                        <span class="margin-value ${marginClass}">${margin.toFixed(1)}%</span>
                    </div>
                    <div class="stock-last-movement">
                        <span class="movement-label">Posledný pohyb:</span>
                        <span class="movement-value">${new Date(product.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="stock-card-actions">
                    <button class="btn btn-sm btn-success" onclick="app.openStockModal('in', '${product.id}')" title="Príjem">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="app.openStockModal('out', '${product.id}')" title="Výdaj">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="app.openStockModal('adjustment', '${product.id}')" title="Skladová úprava">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="app.editProduct('${product.id}')" title="Upraviť produkt">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }

    renderReports() {
        console.log('Rendering reports...');
        this.renderStockValueReport();
        this.renderLowStockReport();
    }

    renderStockValueReport() {
        const container = document.getElementById('stock-value-chart');
        if (!container) return;

        // Calculate data for the report
        const totalValue = this.products.reduce((sum, product) => {
            return sum + ((product.quantity || 0) * (product.price || 0));
        }, 0);

        const totalProducts = this.products.length;
        const totalQuantity = this.products.reduce((sum, product) => {
            return sum + (product.quantity || 0);
        }, 0);

        // Calculate average price
        const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

        // Group by category
        const categoryStats = {};
        this.products.forEach(product => {
            const categoryName = product.category_name || 'Bez kategórie';
            if (!categoryStats[categoryName]) {
                categoryStats[categoryName] = {
                    count: 0,
                    value: 0,
                    quantity: 0,
                    avgPrice: 0
                };
            }
            categoryStats[categoryName].count++;
            categoryStats[categoryName].value += (product.quantity || 0) * (product.price || 0);
            categoryStats[categoryName].quantity += (product.quantity || 0);
        });

        // Calculate average prices per category
        Object.keys(categoryStats).forEach(category => {
            categoryStats[category].avgPrice = categoryStats[category].count > 0 
                ? categoryStats[category].value / categoryStats[category].count 
                : 0;
        });

        // Create HTML content
        container.innerHTML = `
            <div class="report-summary">
                <div class="summary-item">
                    <i class="fas fa-dollar-sign" style="font-size: 12px; margin-bottom: 2px; opacity: 0.8;"></i>
                    <h4>Hodnota</h4>
                    <p class="summary-value">€${totalValue.toFixed(0)}</p>
                </div>
                <div class="summary-item">
                    <i class="fas fa-box" style="font-size: 12px; margin-bottom: 2px; opacity: 0.8;"></i>
                    <h4>Produkty</h4>
                    <p class="summary-value">${totalProducts}</p>
                </div>
            </div>
            <div class="category-breakdown">
                <h4>Kategórie</h4>
                <div class="category-list">
                    ${Object.entries(categoryStats).map(([category, stats]) => `
                        <div class="category-item">
                            <div class="category-info">
                                <span class="category-name">
                                    <i class="fas fa-tag" style="margin-right: 4px; color: #667eea; font-size: 10px;"></i>
                                    ${category}
                                </span>
                                <span class="category-count">${stats.count} prod.</span>
                            </div>
                            <div class="category-stats">
                                <span class="category-value">€${stats.value.toFixed(0)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLowStockReport() {
        const container = document.getElementById('low-stock-report');
        if (!container) return;

        // Get low stock products (quantity <= 10)
        const lowStockProducts = this.products.filter(product => {
            return (product.quantity || 0) <= 10;
        });

        // Get out of stock products (quantity = 0)
        const outOfStockProducts = this.products.filter(product => {
            return (product.quantity || 0) === 0;
        });

        // Get critical stock products (quantity <= 5)
        const criticalStockProducts = this.products.filter(product => {
            return (product.quantity || 0) <= 5 && (product.quantity || 0) > 0;
        });

        // Calculate total value at risk
        const totalValueAtRisk = lowStockProducts.reduce((sum, product) => {
            return sum + ((product.quantity || 0) * (product.price || 0));
        }, 0);

        // Calculate potential revenue loss
        const potentialLoss = outOfStockProducts.reduce((sum, product) => {
            return sum + (product.price || 0);
        }, 0);

        // Create HTML content
        container.innerHTML = `
            <div class="low-stock-summary">
                <div class="summary-item warning">
                    <i class="fas fa-exclamation-triangle" style="font-size: 12px; margin-bottom: 2px; opacity: 0.8;"></i>
                    <h4>Nízky stav</h4>
                    <p class="summary-value">${lowStockProducts.length}</p>
                </div>
                <div class="summary-item danger">
                    <i class="fas fa-times-circle" style="font-size: 12px; margin-bottom: 2px; opacity: 0.8;"></i>
                    <h4>Vypredané</h4>
                    <p class="summary-value">${outOfStockProducts.length}</p>
                </div>
            </div>
            <div class="low-stock-list">
                <h4>Kritické produkty</h4>
                ${criticalStockProducts.length === 0 ? 
                    `<p class="empty-state">Žiadne kritické produkty</p>` :
                    criticalStockProducts.slice(0, 3).map(product => `
                        <div class="product-item ${product.quantity === 0 ? 'out-of-stock' : 'low-stock'}">
                            <div class="product-info">
                                <span class="product-name">
                                    <i class="fas fa-box" style="margin-right: 4px; color: ${product.quantity === 0 ? '#e74c3c' : '#f39c12'}; font-size: 10px;"></i>
                                    ${product.name}
                                </span>
                            </div>
                            <div class="product-stats">
                                <span class="product-quantity">${product.quantity || 0}</span>
                            </div>
                        </div>
                    `).join('') + (criticalStockProducts.length > 3 ? `<p style="text-align: center; font-size: 11px; color: #666; margin-top: 8px;">+${criticalStockProducts.length - 3} ďalších</p>` : '')
                }
            </div>
        `;
    }

    // Modal functions
    openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        // Clear EAN validation
        this.clearEanValidation();

        if (productId) {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                title.textContent = this.getTranslation('editProduct');
                this.populateProductForm(product);
                this.editingProductId = productId; // Set editing mode
            }
        } else {
            title.textContent = this.getTranslation('addProduct');
            form.reset();
            this.editingProductId = null; // Set add mode
        }

        // Update modal content with current language
        this.updateModalContent();

        this.showModal('product-modal');
    }

    openStockModal(type, productId = null) {
        const modal = document.getElementById('stock-modal');
        const title = document.getElementById('stock-modal-title');
        const form = document.getElementById('stock-form');
        const stockInFields = document.getElementById('stock-in-fields');

        this.currentStockType = type;
        const titles = {
            in: 'Príjem skladu',
            out: 'Výdaj skladu',
            adjustment: 'Úprava skladu'
        };
        title.textContent = titles[type];

        // Reset form first
        form.reset();

        // Show/hide additional fields based on type
        if (type === 'in') {
            stockInFields.style.display = 'block';
            this.populateSuppliersDropdown();
            this.setCurrentDateTime();
        } else {
            stockInFields.style.display = 'none';
        }

        // Populate products dropdown
        this.populateProductsDropdown();

        if (productId) {
            document.getElementById('stock-product').value = productId;
        }

        // Setup VAT calculation after form reset and field population
        if (type === 'in') {
            this.setupVatCalculation();
        }

        this.showModal('stock-modal');
    }

    populateProductsDropdown() {
        const productSelect = document.getElementById('stock-product');
        productSelect.innerHTML = '<option value="">Vyberte produkt</option>';
        
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (${product.sku || 'bez EAN'}) - ${product.quantity || 0} ks`;
            productSelect.appendChild(option);
        });
    }

    populateSuppliersDropdown() {
        const supplierSelect = document.getElementById('stock-supplier');
        supplierSelect.innerHTML = '<option value="">Vyberte dodávateľa</option>';
        
        this.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    }

    setupVatCalculation() {
        console.log('Setting up VAT calculation...');
        
        const costInput = document.getElementById('stock-cost-without-vat');
        const vatRateSelect = document.getElementById('stock-vat-rate');
        const customVatGroup = document.getElementById('stock-custom-vat-group');
        const customVatInput = document.getElementById('stock-custom-vat-rate');
        const vatAmountInput = document.getElementById('stock-vat-amount');
        const costWithVatInput = document.getElementById('stock-cost-with-vat');

        if (!costInput || !vatRateSelect || !vatAmountInput || !costWithVatInput) {
            console.error('Some VAT calculation elements not found');
            return;
        }

        const calculateVat = () => {
            const cost = parseFloat(costInput.value) || 0;
            let vatRate = 0;
            
            if (vatRateSelect.value === 'custom') {
                vatRate = parseFloat(customVatInput.value) || 0;
            } else {
                vatRate = parseFloat(vatRateSelect.value) || 0;
            }
            
            const vatAmount = cost * (vatRate / 100);
            const costWithVat = cost + vatAmount;
            
            console.log(`Calculating VAT: cost=${cost}, vatRate=${vatRate}, vatAmount=${vatAmount}, costWithVat=${costWithVat}`);
            
            vatAmountInput.value = vatAmount.toFixed(2);
            costWithVatInput.value = costWithVat.toFixed(2);
        };

        const handleVatRateChange = () => {
            if (vatRateSelect.value === 'custom') {
                customVatGroup.style.display = 'block';
                customVatInput.focus();
            } else {
                customVatGroup.style.display = 'none';
                calculateVat();
            }
        };

        // Add event listeners directly
        costInput.oninput = calculateVat;
        vatRateSelect.onchange = handleVatRateChange;
        customVatInput.oninput = calculateVat;

        console.log('VAT calculation setup complete');
        
        // Initial calculation
        calculateVat();
    }

    setCurrentDateTime() {
        const dateInput = document.getElementById('stock-movement-date');
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        dateInput.value = localDateTime;
    }

    openCategoryModal() {
        // Reset form and set to add mode
        document.getElementById('category-form').reset();
        this.editingCategoryId = null;
        
        // Update modal title and button
        document.getElementById('category-modal-title').textContent = this.getTranslation('addNewCategory');
        document.getElementById('save-category-btn').textContent = this.getTranslation('saveCategory');
        
        this.showModal('category-modal');
    }

    openSupplierModal(supplierId = null) {
        const modal = document.getElementById('supplier-modal');
        const title = document.getElementById('supplier-modal-title');
        const form = document.getElementById('supplier-form');

        if (supplierId) {
            // Edit mode
            this.editingSupplierId = supplierId;
            title.textContent = this.getTranslation('editSupplier');
            this.populateSupplierForm(supplierId);
        } else {
            // Add mode
            this.editingSupplierId = null;
            title.textContent = this.getTranslation('addNewSupplier');
            form.reset();
        }

        this.showModal('supplier-modal');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    populateProductForm(product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-ean').value = product.sku;
        document.getElementById('product-category').value = product.category_id || '';
        document.getElementById('product-supplier').value = product.supplier_id || '';
        document.getElementById('product-selling-price').value = product.price;
        document.getElementById('product-cost').value = product.cost;
        document.getElementById('product-quantity').value = product.quantity;
        
        document.getElementById('product-description').value = product.description || '';
        
        // Set VAT rate for existing products
        const vatRateSelect = document.getElementById('product-vat-rate');
        if (vatRateSelect && product.vat_rate !== undefined) {
            // Check if it's a standard rate
            const standardRates = ['0', '5', '10', '23'];
            if (standardRates.includes(product.vat_rate.toString())) {
                vatRateSelect.value = product.vat_rate.toString();
                console.log('Nastavujem štandardnú sadzbu DPH:', product.vat_rate + '%');
            } else {
                vatRateSelect.value = 'custom';
                document.getElementById('product-custom-vat').value = product.vat_rate;
                document.getElementById('custom-vat-group').style.display = 'block';
                console.log('Nastavujem vlastnú sadzbu DPH:', product.vat_rate + '%');
            }
        } else if (vatRateSelect) {
            vatRateSelect.value = '23'; // Default
            console.log('Nastavujem predvolenú sadzbu DPH: 23%');
        }
        
        // Set cost with VAT if available
        if (product.cost_with_vat !== undefined) {
            document.getElementById('product-cost-with-vat').value = product.cost_with_vat;
        }
        
        // Set price with VAT if available
        if (product.price_with_vat !== undefined && product.price_with_vat > 0) {
            document.getElementById('product-selling-price-with-vat').value = product.price_with_vat;
            console.log('Nastavujem cenu s DPH:', product.price_with_vat);
        } else if (product.price !== undefined && product.price > 0) {
            // Pre staré produkty bez uloženej ceny s DPH, nastavíme cenu bez DPH a dopočítame s DPH
            document.getElementById('product-selling-price').value = product.price;
            console.log('Nastavujem cenu bez DPH (starý produkt):', product.price);
        }
        
        // Calculate VAT for existing products
        this.calculateVat();
        
        // Pre existujúce produkty s uloženou cenou s DPH, dopočítame cenu bez DPH
        if (product.price_with_vat !== undefined && product.price_with_vat > 0) {
            console.log('Dopočítavam cenu bez DPH z ceny s DPH');
            this.calculateSellingPriceWithoutVAT();
        } else if (product.price !== undefined && product.price > 0) {
            // Pre staré produkty bez uloženej ceny s DPH, dopočítame cenu s DPH
            console.log('Dopočítavam cenu s DPH z ceny bez DPH');
            this.calculateSellingPriceWithVAT();
        }
    }

    async populateSupplierForm(supplierId) {
        try {
            const supplier = await window.electronAPI.getSupplier(supplierId);
            if (supplier) {
                document.getElementById('supplier-name').value = supplier.name;
                document.getElementById('supplier-email').value = supplier.email || '';
                document.getElementById('supplier-phone').value = supplier.phone || '';
                document.getElementById('supplier-address').value = supplier.address || '';
                document.getElementById('supplier-ico').value = supplier.ico || '';
                document.getElementById('supplier-dic').value = supplier.dic || '';
            }
        } catch (error) {
            console.error('Error loading supplier data:', error);
            this.showNotification('Error loading supplier data', 'error');
        }
    }

    // EAN validation function
    async checkEanAvailability(ean, excludeId = null) {
        try {
            const isAvailable = await window.electronAPI.checkEanAvailability(ean, excludeId);
            return isAvailable;
        } catch (error) {
            console.error('Error checking EAN availability:', error);
            return false;
        }
    }

    async validateEanField(ean) {
        const eanInput = document.getElementById('product-ean');
        const isEditing = this.editingProductId !== null;
        const isAvailable = await this.checkEanAvailability(ean, isEditing ? this.editingProductId : null);
        
        if (!isAvailable) {
            eanInput.classList.add('error');
            eanInput.setAttribute('title', 'EAN kód už existuje v systéme');
            this.showEanValidationMessage('EAN kód už existuje v systéme', 'error');
        } else {
            eanInput.classList.remove('error');
            eanInput.classList.add('valid');
            eanInput.setAttribute('title', 'EAN kód je dostupný');
            this.showEanValidationMessage('EAN kód je dostupný', 'success');
        }
    }

    clearEanValidation() {
        const eanInput = document.getElementById('product-ean');
        eanInput.classList.remove('error', 'valid');
        eanInput.removeAttribute('title');
        this.hideEanValidationMessage();
    }

    showEanValidationMessage(message, type) {
        let messageElement = document.getElementById('ean-validation-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'ean-validation-message';
            messageElement.className = 'validation-message';
            const eanInput = document.getElementById('product-ean');
            eanInput.parentNode.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `validation-message ${type}`;
        messageElement.style.display = 'block';
    }

    hideEanValidationMessage() {
        const messageElement = document.getElementById('ean-validation-message');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }

    // Form handlers
    async handleProductSubmit() {
        const formData = {
            name: document.getElementById('product-name').value,
            sku: document.getElementById('product-ean').value,
            plu: document.getElementById('product-plu').value,
            category_id: document.getElementById('product-category').value || null,
            supplier_id: document.getElementById('product-supplier').value || null,
            price: parseFloat(document.getElementById('product-selling-price').value) || 0,
            price_with_vat: parseFloat(document.getElementById('product-selling-price-with-vat').value) || 0,
            cost: parseFloat(document.getElementById('product-cost').value) || 0,
            cost_with_vat: parseFloat(document.getElementById('product-cost-with-vat').value) || 0,
            vat_rate: this.getSelectedVatRate(),
            quantity: parseInt(document.getElementById('product-quantity').value) || 0,
            description: document.getElementById('product-description').value
        };

        // Check if we're editing an existing product
        const isEditing = this.editingProductId !== null;
        
        // Validate EAN availability
        if (formData.sku && formData.sku.trim()) {
            const isEanAvailable = await this.checkEanAvailability(formData.sku, isEditing ? this.editingProductId : null);
            if (!isEanAvailable) {
                this.showNotification('EAN kód už existuje v systéme', 'error');
                return;
            }
        }
        
        try {
            if (isEditing) {
                // Update existing product
                formData.id = this.editingProductId;
                await window.electronAPI.updateProduct(formData);
                this.showNotification('Product updated successfully', 'success');
            } else {
                // Adding new product
                await window.electronAPI.addProduct(formData);
                this.showNotification('Product added successfully', 'success');
            }
            
            this.closeAllModals();
            this.editingProductId = null; // Reset editing mode
            await this.loadInitialData();
            this.renderProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification(isEditing ? 'Error updating product' : 'Error adding product', 'error');
        }
    }

    async handleStockSubmit() {
        const formData = {
            productId: document.getElementById('stock-product').value,
            quantity: parseInt(document.getElementById('stock-quantity').value),
            type: this.currentStockType,
            notes: document.getElementById('stock-notes').value
        };

        // Add additional fields for stock in
        if (this.currentStockType === 'in') {
            formData.costWithoutVat = parseFloat(document.getElementById('stock-cost-without-vat').value) || 0;
            formData.vatRate = parseFloat(document.getElementById('stock-vat-rate').value) || 0;
            formData.vatAmount = parseFloat(document.getElementById('stock-vat-amount').value) || 0;
            formData.supplierId = document.getElementById('stock-supplier').value || null;
            formData.movementDate = document.getElementById('stock-movement-date').value || new Date().toISOString();
        }

        try {
            await window.electronAPI.updateStock(formData.productId, formData.quantity, formData.type, formData);
            this.showNotification('Stock updated successfully', 'success');
            this.closeAllModals();
            await this.loadInitialData();
            this.renderStockTable();
        } catch (error) {
            console.error('Error updating stock:', error);
            
            // Check if it's a migration error
            if (error.message && error.message.includes('no column named')) {
                try {
                    console.log('Attempting to run database migrations...');
                    const result = await window.electronAPI.runMigrations();
                    if (result.success) {
                        this.showNotification('Database updated successfully. Please try again.', 'success');
                        // Retry the operation
                        setTimeout(async () => {
                            try {
                                await window.electronAPI.updateStock(formData.productId, formData.quantity, formData.type, formData);
                                this.showNotification('Stock updated successfully', 'success');
                                this.closeAllModals();
                                await this.loadInitialData();
                                this.renderStockTable();
                            } catch (retryError) {
                                console.error('Error after migration:', retryError);
                                this.showNotification('Error updating stock after migration', 'error');
                            }
                        }, 1000);
                    } else {
                        this.showNotification('Database migration failed. Please restart the application.', 'error');
                    }
                } catch (migrationError) {
                    console.error('Migration error:', migrationError);
                    this.showNotification('Database migration failed. Please restart the application.', 'error');
                }
            } else {
                this.showNotification('Error updating stock', 'error');
            }
        }
    }

    async resetDatabase() {
        try {
            const result = await window.electronAPI.resetDatabase();
            if (result.success) {
                this.showNotification('Database reset successfully. Please restart the application.', 'success');
                // Reload data after reset
                await this.loadInitialData();
            } else {
                this.showNotification('Database reset failed: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Database reset error:', error);
            this.showNotification('Database reset failed', 'error');
        }
    }

    async handleCategorySubmit() {
        const formData = {
            name: document.getElementById('category-name').value.trim(),
            description: document.getElementById('category-description').value.trim()
        };

        if (!formData.name) {
            this.showNotification('Názov kategórie je povinný', 'error');
            return;
        }

        // Check if we're editing an existing category
        const isEditing = this.editingCategoryId !== null;
        
        try {
            if (isEditing) {
                // Update existing category
                formData.id = this.editingCategoryId;
                const result = await window.electronAPI.updateCategory(formData);
                if (result.success) {
                    this.showNotification('Kategória bola úspešne aktualizovaná', 'success');
                } else {
                    this.showNotification('Chyba pri aktualizácii kategórie', 'error');
                    return;
                }
            } else {
                // Adding new category
                await window.electronAPI.addCategory(formData);
                this.showNotification('Kategória bola úspešne pridaná', 'success');
            }
            
            this.closeAllModals();
            this.editingCategoryId = null; // Reset editing mode
            await this.loadInitialData();
            this.renderCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            this.showNotification(isEditing ? 'Chyba pri aktualizácii kategórie' : 'Chyba pri pridávaní kategórie', 'error');
        }
    }

    async handleSupplierSubmit() {
        const formData = {
            name: document.getElementById('supplier-name').value,
            email: document.getElementById('supplier-email').value,
            phone: document.getElementById('supplier-phone').value,
            address: document.getElementById('supplier-address').value,
            ico: document.getElementById('supplier-ico').value,
            dic: document.getElementById('supplier-dic').value
        };

        // Check if we're editing an existing supplier
        const isEditing = this.editingSupplierId !== null;
        
        try {
            if (isEditing) {
                // Update existing supplier
                formData.id = this.editingSupplierId;
                await window.electronAPI.updateSupplier(formData);
                this.showNotification('Supplier updated successfully', 'success');
            } else {
                // Adding new supplier
                await window.electronAPI.addSupplier(formData);
                this.showNotification('Supplier added successfully', 'success');
            }
            
            this.closeAllModals();
            this.editingSupplierId = null; // Reset editing mode
            await this.loadInitialData();
            this.renderSuppliers();
        } catch (error) {
            console.error('Error saving supplier:', error);
            this.showNotification(isEditing ? 'Error updating supplier' : 'Error adding supplier', 'error');
        }
    }

    // Search functionality
    async handleSearch(searchTerm) {
        const currentPage = this.getCurrentPage();
        
        if (searchTerm.length < 2) {
            // Clear search and show all items based on current page
            if (currentPage === 'suppliers-page') {
                this.renderSuppliers();
            } else {
                this.renderProducts();
            }
            return;
        }

        try {
            if (currentPage === 'suppliers-page') {
                const results = await window.electronAPI.searchSuppliers(searchTerm);
                this.renderSupplierSearchResults(results);
            } else {
                const results = await window.electronAPI.searchProducts(searchTerm);
                this.renderSearchResults(results);
            }
        } catch (error) {
            console.error('Error searching:', error);
            // Fallback to showing all items on error
            if (currentPage === 'suppliers-page') {
                this.renderSuppliers();
            } else {
                this.renderProducts();
            }
        }
    }

    getCurrentPage() {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id : 'dashboard-page';
    }

    updateSearchForPage(pageName) {
        const searchInput = document.getElementById('search-input');
        const addProductBtn = document.getElementById('add-product-btn');
        const addSupplierBtn = document.getElementById('add-supplier-btn');

        if (pageName === 'suppliers') {
            // Update search placeholder for suppliers
            searchInput.placeholder = this.getTranslation('searchSuppliers');
            // Show supplier button, hide product button
            addProductBtn.style.display = 'none';
            addSupplierBtn.style.display = 'block';
        } else {
            // Update search placeholder for products (default)
            searchInput.placeholder = this.getTranslation('searchProducts');
            // Show product button, hide supplier button
            addProductBtn.style.display = 'block';
            addSupplierBtn.style.display = 'none';
        }
    }

    renderSearchResults(results) {
        const cardsContainer = document.getElementById('products-cards-container');
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = '';

        if (results.length === 0) {
            cardsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No products found</p>
                </div>`;
            return;
        }

        results.forEach(product => {
            const card = document.createElement('div');
            const status = this.getProductStatus(product);
            
            // Calculate margin
            const cost = product.cost || 0;
            const price = product.price || 0;
            const priceWithVat = product.price_with_vat || price * 1.23;
            const costWithVat = product.cost_with_vat || cost * 1.23;
            const margin = priceWithVat > 0 ? ((priceWithVat - costWithVat) / priceWithVat * 100) : 0;
            const marginClass = margin >= 30 ? 'high' : margin >= 15 ? 'medium' : 'low';
            
            // Determine quantity class
            const quantity = product.quantity || 0;
            let quantityClass = 'success';
            if (quantity === 0) quantityClass = 'danger';
            else if (quantity <= 5) quantityClass = 'warning';
            
            card.className = 'product-card collapsed';
            card.innerHTML = `
                <div class="product-card-header">
                    <h3>${product.name}</h3>
                    <div class="product-card-ean">EAN: ${product.sku}</div>
                    ${product.plu ? `<div class="product-card-plu">PLU: ${product.plu}</div>` : ''}
                </div>
                <div class="product-card-content">
                    <div class="product-info-grid">
                        <div class="product-info-item">
                            <div class="product-info-label">Kategória</div>
                            <div class="product-info-value">${product.category_name || 'Neuvedená'}</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Dodávateľ</div>
                            <div class="product-info-value">${product.supplier_name || 'Neuvedený'}</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Množstvo</div>
                            <div class="product-info-value ${quantityClass}">${quantity} ks</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Stav</div>
                            <div class="product-status">
                                <div class="status-indicator ${status.class}"></div>
                                <span class="status-text">${status.text}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-pricing">
                        <div class="pricing-row">
                            <span class="pricing-label">Predaj bez DPH:</span>
                            <span class="pricing-value">€${price.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Predaj s DPH:</span>
                            <span class="pricing-value">€${priceWithVat.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Nákup bez DPH:</span>
                            <span class="pricing-value">€${cost.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Nákup s DPH:</span>
                            <span class="pricing-value">€${costWithVat.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Marža:</span>
                            <span class="pricing-value margin ${marginClass}">${margin.toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    ${product.description ? `
                        <div class="product-description">
                            <div class="product-info-label">Popis</div>
                            <div class="product-info-value">${product.description}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="product-card-actions">
                    <button class="btn btn-info" onclick="app.editProduct('${product.id}')" title="Upraviť">
                        <i class="fas fa-edit"></i> Upraviť
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteProduct('${product.id}')" title="Vymazať">
                        <i class="fas fa-trash"></i> Vymazať
                    </button>
                </div>
                <div class="expand-indicator">
                    <span>Rozbaliť detaily</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            `;
            
            // Add click event for expanding/collapsing
            card.addEventListener('click', (e) => {
                // Don't expand if clicking on action buttons
                if (e.target.closest('.product-card-actions')) {
                    return;
                }
                this.toggleProductCard(card);
            });
            cardsContainer.appendChild(card);
        });
    }

    renderSupplierSearchResults(results) {
        const cardsContainer = document.getElementById('suppliers-cards-container');
        cardsContainer.innerHTML = '';

        if (results.length === 0) {
            cardsContainer.innerHTML = '<div class="empty-state">No suppliers found</div>';
            return;
        }

        results.forEach(supplier => {
            const card = document.createElement('div');
            card.className = 'supplier-card';
            card.innerHTML = `
                <div class="supplier-card-header">
                    <div class="supplier-name">${supplier.name}</div>
                    <div class="supplier-ico">${supplier.ico || 'Bez IČO'}</div>
                </div>
                <div class="supplier-card-content">
                    <div class="supplier-contact">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span class="contact-label">Email:</span>
                            <span class="contact-value">${supplier.email || 'Neuvedený'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span class="contact-label">Telefón:</span>
                            <span class="contact-value">${supplier.phone || 'Neuvedený'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="contact-label">Adresa:</span>
                            <span class="contact-value">${supplier.address || 'Neuvedená'}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-id-card"></i>
                            <span class="contact-label">DIČ:</span>
                            <span class="contact-value">${supplier.dic || 'Neuvedené'}</span>
                        </div>
                    </div>
                </div>
                <div class="supplier-card-actions">
                    <button class="btn btn-sm btn-info" onclick="app.editSupplier('${supplier.id}')" title="Upraviť">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteSupplier('${supplier.id}')" title="Vymazať">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }

    // Utility functions
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async exportProducts() {
        try {
            const result = await window.electronAPI.showSaveDialog({
                title: 'Export Products',
                defaultPath: 'products.csv',
                filters: [
                    { name: 'CSV Files', extensions: ['csv'] },
                    { name: 'Excel Files', extensions: ['xlsx'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (!result.canceled) {
                // Create CSV content with all product fields
                const headers = [
                    'Názov produktu', 'EAN', 'PLU', 'Kategória', 'Dodávateľ', 'Množstvo', 
                    'Predaj bez DPH (€)', 'Predaj s DPH (€)', 
                    'Nákup bez DPH (€)', 'Nákup s DPH (€)', 
                    'Sadzba DPH (%)', 'Marža (%)', 'Stav', 'Jednotka', 'Popis', 
                    'Dátum vytvorenia', 'Dátum aktualizácie'
                ];
                
                const csvContent = [
                    headers.join(';'),
                    ...this.products.map(product => {
                        // Calculate margin
                        const cost = product.cost || 0;
                        const price = product.price || 0;
                        const priceWithVat = product.price_with_vat || price * 1.23;
                        const margin = priceWithVat > 0 ? ((priceWithVat - cost) / priceWithVat * 100) : 0;
                        
                        return [
                            product.name || '',
                            product.sku || '',
                            product.plu || '',
                            product.category_name || '',
                            product.supplier_name || '',
                            product.quantity || 0,
                            (product.price || 0).toFixed(2),
                            (product.price_with_vat || price * 1.23).toFixed(2),
                            (product.cost || 0).toFixed(2),
                            (product.cost_with_vat || cost * 1.23).toFixed(2),
                            (product.vat_rate || 23).toFixed(1),
                            margin.toFixed(1),
                            this.getProductStatus(product).text,
                            product.unit || 'ks',
                            product.description || '',
                            new Date(product.created_at).toLocaleString('sk-SK'),
                            new Date(product.updated_at).toLocaleString('sk-SK')
                        ].join(';');
                    })
                ].join('\n');

                // Export to file
                await window.electronAPI.exportToFile(result.filePath, csvContent);
                
                // Show success message based on file type
                const fileExtension = result.filePath.split('.').pop().toLowerCase();
                if (fileExtension === 'xlsx') {
                    this.showNotification(this.getTranslation('exportSuccessExcel'), 'success');
                } else {
                    this.showNotification(this.getTranslation('exportSuccessCSV'), 'success');
                }
            }
        } catch (error) {
            console.error('Error exporting products:', error);
            this.showNotification('Chyba pri exportovaní produktov', 'error');
        }
    }

    openImportModal() {
        this.showModal('import-modal');
        this.setupImportModal();
    }

    setupImportModal() {
        const fileInput = document.getElementById('import-file');
        const importForm = document.getElementById('import-form');

        // Reset form
        fileInput.value = '';
        document.getElementById('import-preview').innerHTML = '';

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelect(file);
            }
        });

        // Form submit handler
        importForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleImportSubmit();
        });
    }

    async handleFileSelect(file) {
        try {
            console.log('File selected:', file.name); // Debug log
            const preview = document.getElementById('import-preview');
            preview.innerHTML = '<p>Načítavam súbor...</p>';

            const data = await this.readFileData(file);
            console.log('File data loaded, length:', data.length); // Debug log
            
            // Try to parse as Excel format first, fallback to CSV
            let products;
            try {
                products = this.parseExcelData(data);
            } catch (error) {
                console.log('Excel parsing failed, trying CSV:', error);
                products = this.parseCSVData(data);
            }
            
            console.log('Products parsed:', products.length); // Debug log
            
            this.showImportPreview(products.slice(0, 5));
        } catch (error) {
            console.error('Error reading file:', error);
            document.getElementById('import-preview').innerHTML = '<p class="error">Chyba pri načítaní súboru</p>';
        }
    }

    readFileData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    parseCSVData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];

        // Try to detect delimiter (comma or semicolon)
        const firstLine = lines[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const delimiter = commaCount > semicolonCount ? ',' : ';';

        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
            const product = {};
            
            headers.forEach((header, index) => {
                product[header.toLowerCase()] = values[index] || '';
            });
            
            products.push(product);
        }

        return products;
    }

    parseExcelData(data) {
        // Handle both CSV and Excel formats
        if (typeof data === 'string') {
            return this.parseCSVData(data);
        }
        
        // For Excel files, we expect a specific column structure
        const products = [];
        
        console.log('Parsing Excel data:', data);
        if (data.length > 0) {
            console.log('First row headers:', data[0]);
        }
        
        // Expected column mapping based on export format
        const columnMapping = {
            'názov produktu': 'name',
            'názov prod': 'name',
            'ean': 'sku',
            'plu': 'plu',
            'kategória': 'category_name',
            'dodávateľ': 'supplier_name',
            'množstvo': 'quantity',
            'predaj bez dph': 'price',
            'predaj bez': 'price',
            'predaj s dph': 'price_with_vat',
            'predaj s di': 'price_with_vat',
            'nákup bez dph': 'cost',
            'nákup bez': 'cost',
            'nákup s dph': 'cost_with_vat',
            'nákup s di': 'cost_with_vat',
            'sadzba dph': 'vat_rate',
            'sadzba dp': 'vat_rate',
            'marža (%)': 'margin',
            'stav': 'status',
            'jednotka': 'unit',
            'popis': 'description',
            'dátum vytvorenia': 'created_at',
            'dátum vyt': 'created_at',
            'dátum aktualizácie': 'updated_at'
        };

        // Process each row
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const product = {};
            
            // Map columns based on the expected structure
            Object.keys(columnMapping).forEach(key => {
                // Try to find the column by exact match or partial match
                let value = '';
                if (row[key] !== undefined) {
                    value = row[key];
                } else {
                    // Try partial matching for column names
                    const matchingKey = Object.keys(row).find(colKey => 
                        colKey.toLowerCase().includes(key.toLowerCase()) || 
                        key.toLowerCase().includes(colKey.toLowerCase())
                    );
                    if (matchingKey) {
                        value = row[matchingKey];
                    }
                }
                product[columnMapping[key]] = value;
            });
            
            // Clean and convert values
            if (product.quantity) {
                product.quantity = parseInt(product.quantity.toString().replace(/[^\d]/g, '')) || 0;
            }
            
            if (product.price) {
                product.price = parseFloat(product.price.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            }
            
            if (product.price_with_vat) {
                product.price_with_vat = parseFloat(product.price_with_vat.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            }
            
            if (product.cost) {
                product.cost = parseFloat(product.cost.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            }
            
            if (product.cost_with_vat) {
                product.cost_with_vat = parseFloat(product.cost_with_vat.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            }
            
            if (product.vat_rate) {
                product.vat_rate = parseFloat(product.vat_rate.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 23;
            }
            
            if (product.margin) {
                product.margin = parseFloat(product.margin.toString().replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            }
            
            // Debug logging for description mapping
            console.log(`Parsed product: ${product.name}, description: ${product.description || 'žiadny'}`);
            
            // Skip empty products - only name is required, EAN is optional
            if (product.name && product.name.trim() !== '') {
                products.push(product);
            }
        }

        return products;
    }

    showImportPreview(products) {
        console.log('Showing import preview for products:', products); // Debug log
        const preview = document.getElementById('import-preview');
        
        if (products.length === 0) {
            preview.innerHTML = '<p>Žiadne produkty na zobrazenie</p>';
            return;
        }

        const headers = ['Názov produktu', 'EAN', 'PLU', 'Kategória', 'Dodávateľ', 'Množstvo', 'Predaj bez DPH', 'Predaj s DPH', 'Nákup bez DPH', 'Nákup s DPH', 'Sadzba DPH', 'Marža (%)', 'Stav'];
        const table = `
            <table class="preview-table">
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.name || product['názov produktu'] || ''}</td>
                            <td>${product.sku || product.ean || 'bez EAN'}</td>
                            <td>${product.plu || ''}</td>
                            <td>${product.category_name || product.kategória || ''}</td>
                            <td>${product.supplier_name || product.dodávateľ || ''}</td>
                            <td>${product.quantity || product.množstvo || ''}</td>
                            <td>€${(product.price || 0).toFixed(2)}</td>
                            <td>€${(product.price_with_vat || 0).toFixed(2)}</td>
                            <td>€${(product.cost || 0).toFixed(2)}</td>
                            <td>€${(product.cost_with_vat || 0).toFixed(2)}</td>
                            <td>${(product.vat_rate || 23).toFixed(1)}%</td>
                            <td>${(product.margin || 0).toFixed(1)}%</td>
                            <td>${product.status || 'Na sklade'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        preview.innerHTML = table;
    }

    async handleImportSubmit() {
        const fileInput = document.getElementById('import-file');
        // Import logic is now fixed: add quantity to existing products, add new products if EAN doesn't exist
        const skipDuplicates = false;
        const updateExisting = false;
        const addQuantity = true;

        if (!fileInput.files[0]) {
            this.showNotification('Vyberte súbor pre import', 'error');
            return;
        }

        try {
            const data = await this.readFileData(fileInput.files[0]);
            
            // Try to parse as Excel format first, fallback to CSV
            let products;
            try {
                products = this.parseExcelData(data);
            } catch (error) {
                console.log('Excel parsing failed, trying CSV:', error);
                products = this.parseCSVData(data);
            }
            
            if (products.length === 0) {
                this.showNotification('Súbor neobsahuje žiadne produkty', 'error');
                return;
            }

            console.log('Import options:', { skipDuplicates, updateExisting, addQuantity });
            
            const result = await this.processImport(products, {
                skipDuplicates,
                updateExisting,
                addQuantity
            });

            console.log('Import result:', result);
            this.showNotification(`Import dokončený: ${result.added} pridané, ${result.updated} aktualizované, ${result.skipped} preskočené`, 'success');
            this.closeAllModals();
            
            // Update current page only
            if (this.currentPage === 'products') {
                this.renderProducts();
            } else if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            } else if (this.currentPage === 'stock') {
                this.renderStockTable();
            }
            
            // Update system info if on settings page
            if (this.currentPage === 'settings') {
                this.updateSystemInfo();
            }
        } catch (error) {
            console.error('Import error:', error);
            this.showNotification('Chyba pri importe', 'error');
        }
    }

    async processImport(products, options) {
        let added = 0, updated = 0, skipped = 0;
        
        console.log(`Processing ${products.length} products with options:`, options);

        for (const product of products) {
            try {
                // Map fields to expected field names
                const productName = product.name || product['názov produktu'];
                const productEAN = (product.sku || product.ean || '').trim() || null;
                
                console.log(`Processing product: ${productName} (EAN: ${productEAN || 'bez EAN'})`);
                console.log(`Product description from import: ${product.description || 'žiadny'}`);
                
                // Skip products with empty name
                if (!productName || productName.trim() === '') {
                    console.log(`Skipping product - empty name`);
                    skipped++;
                    continue;
                }
                
                // Find existing product by EAN if available, otherwise by name
                const existingProduct = productEAN 
                    ? this.products.find(p => p.sku === productEAN)
                    : this.products.find(p => p.name.toLowerCase() === productName.toLowerCase());
                
                console.log(`Looking for existing product by ${productEAN ? 'EAN' : 'name'}: ${productEAN || productName}`);
                console.log(`Found existing product: ${existingProduct ? existingProduct.name : 'nie'}`);
                
                if (existingProduct) {
                    // Product exists with same EAN - add quantity to existing stock
                    const currentQuantity = existingProduct.quantity || 0;
                    const addQuantity = parseInt(product.quantity || product.množstvo || '0') || 0;
                    const newQuantity = currentQuantity + addQuantity;
                    
                    console.log(`Adding quantity to existing product ${existingProduct.name}: ${currentQuantity} + ${addQuantity} = ${newQuantity}`);
                    console.log(`Updating description from '${existingProduct.description || 'žiadny'}' to '${product.description !== undefined ? product.description : existingProduct.description || 'žiadny'}'`);
                    
                    // Update product with new quantity and other fields if provided
                    const updatedProduct = {
                        ...existingProduct,
                        quantity: newQuantity,
                        price: product.price || existingProduct.price,
                        price_with_vat: product.price_with_vat || existingProduct.price_with_vat,
                        cost: product.cost || existingProduct.cost,
                        cost_with_vat: product.cost_with_vat || existingProduct.cost_with_vat,
                        category_name: product.category_name || existingProduct.category_name,
                        supplier_name: product.supplier_name || existingProduct.supplier_name,
                        description: product.description !== undefined ? product.description : existingProduct.description
                    };
                    
                    await window.electronAPI.updateProduct(updatedProduct);
                    
                    // Update the local products array immediately
                    const productIndex = this.products.findIndex(p => p.id === existingProduct.id);
                    if (productIndex !== -1) {
                        this.products[productIndex] = updatedProduct;
                    }
                    
                    // Immediately update UI if on products page
                    if (this.currentPage === 'products') {
                        this.renderProducts();
                    }
                    
                    updated++;
                } else {
                    // New product - add it with all available fields
                    const newProduct = {
                        name: productName,
                        sku: productEAN,
                        plu: product.plu || '',
                        category_name: product.category_name || product.kategória || '',
                        supplier_name: product.supplier_name || product.dodávateľ || '',
                        quantity: parseInt(product.quantity || product.množstvo || '0') || 0,
                        price: parseFloat(product.price || '0') || 0,
                        price_with_vat: parseFloat(product.price_with_vat || '0') || 0,
                        cost: parseFloat(product.cost || '0') || 0,
                        cost_with_vat: parseFloat(product.cost_with_vat || '0') || 0,
                        description: product.description || product.popis || ''
                    };
                    
                    console.log(`Adding new product: ${newProduct.name} with EAN: ${newProduct.sku || 'bez EAN'}, description: ${newProduct.description || 'žiadny'}`);
                    await window.electronAPI.addProduct(newProduct);
                    added++;
                }
            } catch (error) {
                console.error('Error processing product:', product, error);
                skipped++;
            }
        }

        return { added, updated, skipped };
    }

    async backupDatabase() {
        try {
            const result = await window.electronAPI.backupDatabase();
            if (result.success) {
                this.showNotification('Database backed up successfully', 'success');
                this.updateSystemInfo(); // Update system info after backup
            } else {
                this.showNotification('Failed to backup database', 'error');
            }
        } catch (error) {
            console.error('Error backing up database:', error);
            this.showNotification('Error backing up database', 'error');
        }
    }

    updateSystemInfo() {
        console.log('Updating system info...');
        console.log('Products count:', this.products.length);
        console.log('Categories count:', this.categories.length);
        console.log('Suppliers count:', this.suppliers.length);
        
        // Update product count
        const totalProducts = document.getElementById('system-total-products');
        if (totalProducts) {
            totalProducts.textContent = this.products.length;
            console.log('Updated system-total-products element with:', this.products.length);
        } else {
            console.log('system-total-products element not found');
        }

        // Update category count
        const totalCategories = document.getElementById('system-total-categories');
        if (totalCategories) {
            totalCategories.textContent = this.categories.length;
        }

        // Update supplier count
        const totalSuppliers = document.getElementById('system-total-suppliers');
        if (totalSuppliers) {
            totalSuppliers.textContent = this.suppliers.length;
        }

        // Calculate total stock value
        const totalStockValue = document.getElementById('system-total-stock-value');
        if (totalStockValue) {
            const totalValue = this.products.reduce((sum, product) => {
                return sum + ((product.quantity || 0) * (product.price || 0));
            }, 0);
            totalStockValue.textContent = `€${totalValue.toFixed(2)}`;
        }

        // Count low stock products
        const lowStockCount = document.getElementById('system-low-stock-count');
        if (lowStockCount) {
            const lowStockProducts = this.products.filter(product => {
                return (product.quantity || 0) <= 10;
            });
            lowStockCount.textContent = lowStockProducts.length;
        }

        // Update last backup info
        const lastBackup = document.getElementById('last-backup');
        if (lastBackup) {
            // For now, show current time as last backup
            lastBackup.textContent = new Date().toLocaleString('sk-SK');
        }
    }

    // Edit and delete functions (to be implemented)
    editProduct(productId) {
        this.openProductModal(productId);
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await window.electronAPI.deleteProduct(productId);
                this.showNotification('Product deleted successfully', 'success');
                
                // Update local data
                this.products = this.products.filter(p => p.id !== productId);
                
                // Update current page only
                if (this.currentPage === 'products') {
                    this.renderProducts();
                } else if (this.currentPage === 'dashboard') {
                    this.updateDashboard();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                this.showNotification('Error deleting product', 'error');
            }
        }
    }

    editSupplier(supplierId) {
        this.openSupplierModal(supplierId);
    }

    async deleteSupplier(supplierId) {
        if (confirm(this.getTranslation('confirmDeleteSupplier'))) {
            try {
                await window.electronAPI.deleteSupplier(supplierId);
                this.showNotification('Supplier deleted successfully', 'success');
                
                // Update local data
                this.suppliers = this.suppliers.filter(s => s.id !== supplierId);
                
                // Update current page only
                if (this.currentPage === 'suppliers') {
                    this.renderSuppliers();
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                this.showNotification('Error deleting supplier', 'error');
            }
        }
    }
    
    async deleteCategory(categoryId) {
        try {
            // Check if category is used by any products
            const productsInCategory = this.products.filter(product => product.category_id === categoryId);
            
            if (productsInCategory.length > 0) {
                const message = this.getTranslation('categoryInUseMessage').replace('{count}', productsInCategory.length);
                const result = await window.electronAPI.showMessageBox({
                    type: 'warning',
                    title: this.getTranslation('categoryInUse'),
                    message: message,
                    buttons: ['Zrušiť', 'Vymazať']
                });
                
                if (result.response !== 1) {
                    return;
                }
            } else {
                const result = await window.electronAPI.showMessageBox({
                    type: 'question',
                    title: 'Potvrdiť vymazanie',
                    message: this.getTranslation('confirmDeleteCategory'),
                    buttons: ['Zrušiť', 'Vymazať']
                });
                
                if (result.response !== 1) {
                    return;
                }
            }
            
            await window.electronAPI.deleteCategory(categoryId);
            this.showNotification('Kategória bola úspešne vymazaná', 'success');
            
            // Update local data
            this.categories = this.categories.filter(c => c.id !== categoryId);
            
            // Update current page only
            if (this.currentPage === 'categories') {
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            this.showNotification('Chyba pri vymazávaní kategórie', 'error');
        }
    }

    editCategory(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category) {
            this.showNotification('Kategória nebola nájdená', 'error');
            return;
        }

        // Fill the form with category data
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description || '';
        
        // Set editing mode
        this.editingCategoryId = categoryId;
        
        // Update form title and button
        document.getElementById('category-modal-title').textContent = this.getTranslation('editCategory');
        document.getElementById('save-category-btn').textContent = this.getTranslation('update');
        
        // Show the modal
        this.showModal('category-modal');
    }

    async updateCategory(categoryId) {
        try {
            const formData = {
                name: document.getElementById('category-name').value.trim(),
                description: document.getElementById('category-description').value.trim()
            };

            if (!formData.name) {
                this.showNotification('Názov kategórie je povinný', 'error');
                return;
            }

            // Check if name already exists (excluding current category)
            const existingCategory = this.categories.find(cat => 
                cat.name.toLowerCase() === formData.name.toLowerCase() && cat.id !== categoryId
            );
            
            if (existingCategory) {
                this.showNotification('Kategória s týmto názvom už existuje', 'error');
                return;
            }

            const result = await window.electronAPI.updateCategory({ id: categoryId, ...formData });
            
            if (result.success) {
                this.showNotification('Kategória bola úspešne aktualizovaná', 'success');
                this.closeModal('category-modal');
                await this.loadInitialData();
                this.renderCategories();
            } else {
                this.showNotification('Chyba pri aktualizácii kategórie', 'error');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            this.showNotification('Chyba pri aktualizácii kategórie', 'error');
        }
    }

    // Settings methods
    async loadSettings() {
        try {
            const result = await window.electronAPI.getSettings();
            if (result.success) {
                this.settings = { ...this.settings, ...result.settings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            const result = await window.electronAPI.saveSettings(this.settings);
            if (!result.success) {
                console.error('Error saving settings:', result.error);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    applySettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        // Apply language
        this.updateLanguage(this.settings.language);
        
        // Update settings form
        this.updateSettingsForm();
        
        // Update quick actions if on dashboard
        if (this.currentPage === 'dashboard') {
            this.setupQuickActions();
        }
    }

    updateLanguage(language) {
        this.settings.language = language;
        
        // Update navigation
        document.querySelectorAll('[data-page="dashboard"] span').forEach(el => el.textContent = this.getTranslation('dashboard'));
        document.querySelectorAll('[data-page="products"] span').forEach(el => el.textContent = this.getTranslation('products'));
        document.querySelectorAll('[data-page="categories"] span').forEach(el => el.textContent = this.getTranslation('categories'));
        document.querySelectorAll('[data-page="suppliers"] span').forEach(el => el.textContent = this.getTranslation('suppliers'));
        document.querySelectorAll('[data-page="stock"] span').forEach(el => el.textContent = this.getTranslation('stock'));
        document.querySelectorAll('[data-page="reports"] span').forEach(el => el.textContent = this.getTranslation('reports'));
        document.querySelectorAll('[data-page="settings"] span').forEach(el => el.textContent = this.getTranslation('settings'));
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getTranslation(this.currentPage);
        }
        
        // Update buttons
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) addProductBtn.innerHTML = `<i class="fas fa-plus"></i> ${this.getTranslation('addProduct')}`;
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.placeholder = this.getTranslation('searchProducts');
        
        // Update form labels and buttons
        this.updateFormTranslations();
        
        // Update all content in current page
        this.updatePageContent();
        
        // Update dashboard cards
        this.updateDashboardContent();
        
        // Update table headers and content
        this.updateTableContent();
        
        // Update modal content
        this.updateModalContent();
        
        // Update button texts
        this.updateButtonTexts();
        
        // Update quick actions if on dashboard
        if (this.currentPage === 'dashboard') {
            this.setupQuickActions();
        }
    }

    getTranslation(key) {
        // Use the global getTranslation function from translations.js
        if (typeof getTranslation === 'function') {
            return getTranslation(key, this.settings.language);
        }
        
        // Fallback to local translations if global function is not available
        const translations = {
            sk: {
                dashboard: "Dashboard",
                products: "Produkty",
                categories: "Kategórie",
                suppliers: "Dodávatelia",
                stock: "Sklad",
                reports: "Reporty",
                settings: "Nastavenia",
                addProduct: "Pridať produkt",
                searchProducts: "Hľadať produkty...",
        searchSuppliers: "Hľadať dodávateľov...",
                saveSettings: "Uložiť nastavenia",
                resetDefaults: "Obnoviť predvolené",
                settingsSaved: "Nastavenia boli úspešne uložené",
                productName: "Názov produktu",
                ean: "EAN",
                category: "Kategória",
                supplier: "Dodávateľ",
                price: "Cena",
                cost: "Náklady",
                margin: "Marža",
                quantity: "Množstvo",
                reorderLevel: "Úroveň objednávky",
                description: "Popis",
                selectCategory: "Vybrať kategóriu",
                selectSupplier: "Vybrať dodávateľa"
            },
            en: {
                dashboard: "Dashboard",
                products: "Products",
                categories: "Categories",
                suppliers: "Suppliers",
                stock: "Stock",
                reports: "Reports",
                settings: "Settings",
                addProduct: "Add Product",
                searchProducts: "Search products...",
        searchSuppliers: "Search suppliers...",
                saveSettings: "Save Settings",
                resetDefaults: "Reset to Defaults",
                settingsSaved: "Settings saved successfully",
                productName: "Product Name",
                ean: "EAN",
                category: "Category",
                supplier: "Supplier",
                price: "Price",
                cost: "Cost",
                margin: "Margin",
                quantity: "Quantity",
                reorderLevel: "Reorder Level",
                description: "Description",
                selectCategory: "Select Category",
                selectSupplier: "Select Supplier"
            }
        };
        
        return translations[this.settings.language][key] || key;
    }

    updateFormTranslations() {
        // Update form labels
        const labels = {
            'product-name': this.getTranslation('productName'),
            'product-ean': this.getTranslation('ean'),
            'product-category': this.getTranslation('category'),
            'product-supplier': this.getTranslation('supplier'),
            'product-price': this.getTranslation('price'),
            'product-cost': this.getTranslation('cost'),
            'product-quantity': this.getTranslation('quantity'),
            'product-reorder': this.getTranslation('reorderLevel'),
            'product-description': this.getTranslation('description')
        };
        
        Object.keys(labels).forEach(id => {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) label.textContent = labels[id];
        });
        
        // Update select placeholders
        const selects = {
            'product-category': this.getTranslation('selectCategory'),
            'product-supplier': this.getTranslation('selectSupplier')
        };
        
        Object.keys(selects).forEach(id => {
            const select = document.getElementById(id);
            if (select && select.options.length > 0) {
                select.options[0].textContent = selects[id];
            }
        });
    }

    updatePageContent() {
        // Update page-specific content based on current page
        switch(this.currentPage) {
            case 'dashboard':
                this.updateDashboardContent();
                break;
            case 'products':
                this.updateProductsContent();
                break;
            case 'categories':
                this.updateCategoriesContent();
                break;
            case 'suppliers':
                this.updateSuppliersContent();
                break;
            case 'stock':
                this.updateStockContent();
                break;
            case 'reports':
                this.updateReportsContent();
                break;
            case 'settings':
                this.updateSettingsContent();
                break;
        }
    }

    updateDashboardContent() {
        // Update dashboard card labels
        const totalProductsLabel = document.getElementById('total-products-label');
        if (totalProductsLabel) totalProductsLabel.textContent = this.getTranslation('totalProducts');
        
        const totalValueLabel = document.getElementById('total-value-label');
        if (totalValueLabel) totalValueLabel.textContent = this.getTranslation('totalValue');
        
        const lowStockLabel = document.getElementById('low-stock-label');
        if (lowStockLabel) lowStockLabel.textContent = this.getTranslation('lowStock');
        
        const outOfStockLabel = document.getElementById('out-of-stock-label');
        if (outOfStockLabel) outOfStockLabel.textContent = this.getTranslation('outOfStock');
        
        // Update section titles
        const recentMovementsTitle = document.getElementById('recent-movements-title');
        if (recentMovementsTitle) recentMovementsTitle.textContent = this.getTranslation('recentMovements');
        
        const lowStockAlertsTitle = document.getElementById('low-stock-alerts-title');
        if (lowStockAlertsTitle) lowStockAlertsTitle.textContent = this.getTranslation('lowStockAlerts');
        
        // Update empty state messages
        const noMovements = document.querySelector('#recent-movements .empty-state');
        if (noMovements) noMovements.textContent = this.getTranslation('noStockMovements');
        
        const noAlerts = document.querySelector('#low-stock-alerts .empty-state');
        if (noAlerts) noAlerts.textContent = this.getTranslation('noLowStockAlerts');
    }

    updateProductsContent() {
        // Update table headers
        const productNameHeader = document.getElementById('product-name-header');
        if (productNameHeader) productNameHeader.textContent = this.getTranslation('productName');
        
        const productSkuHeader = document.getElementById('product-sku-header');
        if (productSkuHeader) productSkuHeader.textContent = this.getTranslation('ean');
        
        const productCategoryHeader = document.getElementById('product-category-header');
        if (productCategoryHeader) productCategoryHeader.textContent = this.getTranslation('category');
        
        const productQuantityHeader = document.getElementById('product-quantity-header');
        if (productQuantityHeader) productQuantityHeader.textContent = this.getTranslation('quantity');
        
        const productPriceHeader = document.getElementById('product-price-header');
        if (productPriceHeader) productPriceHeader.textContent = this.getTranslation('price');
        
        const productCostHeader = document.getElementById('product-cost-header');
        if (productCostHeader) productCostHeader.textContent = this.getTranslation('cost');
        
        const productMarginHeader = document.getElementById('product-margin-header');
        if (productMarginHeader) productMarginHeader.textContent = this.getTranslation('margin');
        
        const productStatusHeader = document.getElementById('product-status-header');
        if (productStatusHeader) productStatusHeader.textContent = this.getTranslation('status');
        
        const productActionsHeader = document.getElementById('product-actions-header');
        if (productActionsHeader) productActionsHeader.textContent = this.getTranslation('actions');
        
        // Update empty state
        const emptyState = document.querySelector('#products-table .empty-state');
        if (emptyState) emptyState.textContent = this.getTranslation('noProducts');
    }

    updateCategoriesContent() {
        // Update empty state
        const emptyState = document.querySelector('#categories-grid .empty-state');
        if (emptyState) emptyState.textContent = this.getTranslation('noCategories');
    }

    updateSuppliersContent() {
        // Update table headers
        const supplierNameHeader = document.getElementById('supplier-name-header');
        if (supplierNameHeader) supplierNameHeader.textContent = this.getTranslation('supplierName');
        
        const supplierEmailHeader = document.getElementById('supplier-email-header');
        if (supplierEmailHeader) supplierEmailHeader.textContent = this.getTranslation('email');
        
        const supplierPhoneHeader = document.getElementById('supplier-phone-header');
        if (supplierPhoneHeader) supplierPhoneHeader.textContent = this.getTranslation('phone');
        
        const supplierAddressHeader = document.getElementById('supplier-address-header');
        if (supplierAddressHeader) supplierAddressHeader.textContent = this.getTranslation('address');
        
        const supplierIcoHeader = document.getElementById('supplier-ico-header');
        if (supplierIcoHeader) supplierIcoHeader.textContent = this.getTranslation('ico');
        
        const supplierDicHeader = document.getElementById('supplier-dic-header');
        if (supplierDicHeader) supplierDicHeader.textContent = this.getTranslation('dic');
        
        const supplierActionsHeader = document.getElementById('supplier-actions-header');
        if (supplierActionsHeader) supplierActionsHeader.textContent = this.getTranslation('actions');
        
        // Update empty state
        const emptyState = document.querySelector('#suppliers-table .empty-state');
        if (emptyState) emptyState.textContent = this.getTranslation('noSuppliers');
    }

    updateStockContent() {
        // Update table headers
        const stockProductHeader = document.getElementById('stock-product-header');
        if (stockProductHeader) stockProductHeader.textContent = this.getTranslation('productName');
        
        const stockCurrentHeader = document.getElementById('stock-current-header');
        if (stockCurrentHeader) stockCurrentHeader.textContent = this.getTranslation('currentStock');
        
        const stockReorderHeader = document.getElementById('stock-reorder-header');
        if (stockReorderHeader) stockReorderHeader.textContent = this.getTranslation('reorderLevel');
        
        const stockLastHeader = document.getElementById('stock-last-header');
        if (stockLastHeader) stockLastHeader.textContent = this.getTranslation('lastMovement');
        
        const stockActionsHeader = document.getElementById('stock-actions-header');
        if (stockActionsHeader) stockActionsHeader.textContent = this.getTranslation('actions');
    }

    updateReportsContent() {
        // Update report titles
        const stockValueTitle = document.getElementById('stock-value-report-title');
        if (stockValueTitle) stockValueTitle.textContent = this.getTranslation('stockValueReport');
        
        const lowStockTitle = document.getElementById('low-stock-report-title');
        if (lowStockTitle) lowStockTitle.textContent = this.getTranslation('lowStockReport');
        
        // Update chart placeholder
        const chartPlaceholder = document.getElementById('chart-placeholder-text');
        if (chartPlaceholder) chartPlaceholder.textContent = this.getTranslation('chartWillBeDisplayed');
    }

    updateSettingsContent() {
        // Update settings section titles
        const appearanceTitle = document.querySelector('.settings-section h3');
        if (appearanceTitle) appearanceTitle.textContent = this.getTranslation('appearance');
        
        const languageTitle = document.querySelector('.settings-section:nth-child(2) h3');
        if (languageTitle) languageTitle.textContent = this.getTranslation('language');
        
        const appInfoTitle = document.querySelector('.settings-section:nth-child(3) h3');
        if (appInfoTitle) appInfoTitle.textContent = this.getTranslation('appInfo');
        
        // Update labels
        const themeLabel = document.querySelector('label[for="theme-select"]');
        if (themeLabel) themeLabel.textContent = this.getTranslation('theme');
        
        const languageLabel = document.querySelector('label[for="language-select"]');
        if (languageLabel) languageLabel.textContent = this.getTranslation('appLanguage');
        
        // Update button texts
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) saveBtn.textContent = this.getTranslation('saveSettings');
        
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) resetBtn.textContent = this.getTranslation('resetDefaults');
    }

    updateTableContent() {
        // Update all table headers and content based on current page
        this.updateProductsContent();
        this.updateCategoriesContent();
        this.updateSuppliersContent();
        this.updateStockContent();
    }

    updateModalContent() {
        // Update modal titles
        const productModalTitle = document.getElementById('product-modal-title');
        if (productModalTitle) productModalTitle.textContent = this.getTranslation('addProduct');
        
        const categoryModalTitle = document.getElementById('category-modal-title');
        if (categoryModalTitle) categoryModalTitle.textContent = this.getTranslation('newCategory');
        
        const supplierModalTitle = document.getElementById('supplier-modal-title');
        if (supplierModalTitle) supplierModalTitle.textContent = this.getTranslation('newSupplier');
        
        const stockModalTitle = document.getElementById('stock-modal-title');
        if (stockModalTitle) stockModalTitle.textContent = this.getTranslation('stockMovement');
        
        // Update modal form labels
        this.updateModalFormLabels();
        
        // Update modal buttons
        this.updateModalButtons();
    }

    updateModalFormLabels() {
        // Product modal labels
        const productNameLabel = document.getElementById('product-name-label');
        if (productNameLabel) productNameLabel.textContent = this.getTranslation('productName') + ' *';
        
        const productEanLabel = document.getElementById('product-ean-label');
        if (productEanLabel) productEanLabel.textContent = this.getTranslation('ean') + ' *';
        
        const productCategoryLabel = document.getElementById('product-category-label');
        if (productCategoryLabel) productCategoryLabel.textContent = this.getTranslation('category');
        
        const productSupplierLabel = document.getElementById('product-supplier-label');
        if (productSupplierLabel) productSupplierLabel.textContent = this.getTranslation('supplier');
        
        const productPriceLabel = document.getElementById('product-price-label');
        if (productPriceLabel) productPriceLabel.textContent = this.getTranslation('price');
        
        const productCostLabel = document.getElementById('product-cost-label');
        if (productCostLabel) productCostLabel.textContent = this.getTranslation('cost');
        
        const productQuantityLabel = document.getElementById('product-quantity-label');
        if (productQuantityLabel) productQuantityLabel.textContent = this.getTranslation('initialQuantity');
        
        const productReorderLabel = document.getElementById('product-reorder-label');
        if (productReorderLabel) productReorderLabel.textContent = this.getTranslation('reorderLevel');
        
        const productDescriptionLabel = document.getElementById('product-description-label');
        if (productDescriptionLabel) productDescriptionLabel.textContent = this.getTranslation('description');
        
        // Stock modal labels
        const stockProductLabel = document.getElementById('stock-product-label');
        if (stockProductLabel) stockProductLabel.textContent = this.getTranslation('productName');
        
        const stockQuantityLabel = document.getElementById('stock-quantity-label');
        if (stockQuantityLabel) stockQuantityLabel.textContent = this.getTranslation('quantity');
        
        const stockNotesLabel = document.getElementById('stock-notes-label');
        if (stockNotesLabel) stockNotesLabel.textContent = this.getTranslation('notes');
        
        // Category modal labels
        const categoryNameLabel = document.getElementById('category-name-label');
        if (categoryNameLabel) categoryNameLabel.textContent = this.getTranslation('categoryName') + ' *';
        
        const categoryDescriptionLabel = document.getElementById('category-description-label');
        if (categoryDescriptionLabel) categoryDescriptionLabel.textContent = this.getTranslation('description');
        
        // Supplier modal labels
        const supplierNameLabel = document.getElementById('supplier-name-label');
        if (supplierNameLabel) supplierNameLabel.textContent = this.getTranslation('supplierName') + ' *';
        
        const supplierEmailLabel = document.getElementById('supplier-email-label');
        if (supplierEmailLabel) supplierEmailLabel.textContent = this.getTranslation('email');
        
        const supplierPhoneLabel = document.getElementById('supplier-phone-label');
        if (supplierPhoneLabel) supplierPhoneLabel.textContent = this.getTranslation('phone');
        
        const supplierAddressLabel = document.getElementById('supplier-address-label');
        if (supplierAddressLabel) supplierAddressLabel.textContent = this.getTranslation('address');
        
        // Update select placeholders
        const selectCategoryOption = document.getElementById('select-category-option');
        if (selectCategoryOption) selectCategoryOption.textContent = this.getTranslation('selectCategory');
        
        const selectSupplierOption = document.getElementById('select-supplier-option');
        if (selectSupplierOption) selectSupplierOption.textContent = this.getTranslation('selectSupplier');
        
        const selectProductOption = document.getElementById('select-product-option');
        if (selectProductOption) selectProductOption.textContent = this.getTranslation('selectProduct');
    }

    updateModalButtons() {
        // Update save buttons
        const saveProductBtn = document.getElementById('save-product-btn');
        if (saveProductBtn) saveProductBtn.textContent = this.getTranslation('saveProduct');
        
        const saveCategoryBtn = document.getElementById('save-category-btn');
        if (saveCategoryBtn) saveCategoryBtn.textContent = this.getTranslation('saveCategory');
        
        const saveSupplierBtn = document.getElementById('save-supplier-btn');
        if (saveSupplierBtn) saveSupplierBtn.textContent = this.getTranslation('saveSupplier');
        
        const saveMovementBtn = document.getElementById('save-movement-btn');
        if (saveMovementBtn) saveMovementBtn.textContent = this.getTranslation('saveMovement');
        
        // Update cancel buttons
        const cancelButtons = document.querySelectorAll('.modal .btn-secondary');
        cancelButtons.forEach(btn => {
            if (btn.textContent.includes('Cancel') || btn.textContent.includes('Zrušiť')) {
                btn.textContent = this.getTranslation('cancel');
            }
        });
    }

    updateButtonTexts() {
        // Update button texts
        const newProductText = document.getElementById('new-product-text');
        if (newProductText) newProductText.textContent = this.getTranslation('newProduct');
        
        const exportText = document.getElementById('export-text');
        if (exportText) exportText.textContent = this.getTranslation('export');
        
        const newCategoryText = document.getElementById('new-category-text');
        if (newCategoryText) newCategoryText.textContent = this.getTranslation('newCategory');
        
        const newSupplierText = document.getElementById('new-supplier-text');
        if (newSupplierText) newSupplierText.textContent = this.getTranslation('newSupplier');
        
        const stockInText = document.getElementById('stock-in-text');
        if (stockInText) stockInText.textContent = this.getTranslation('stockIn');
        
        const stockOutText = document.getElementById('stock-out-text');
        if (stockOutText) stockOutText.textContent = this.getTranslation('stockOut');
        
        const stockAdjustmentText = document.getElementById('stock-adjustment-text');
        if (stockAdjustmentText) stockAdjustmentText.textContent = this.getTranslation('stockAdjustment');
    }

    updateSettingsForm() {
        const themeSelect = document.getElementById('theme-select');
        const languageSelect = document.getElementById('language-select');
        const backupPathInput = document.getElementById('backup-path');
        
        if (themeSelect) themeSelect.value = this.settings.theme;
        if (languageSelect) languageSelect.value = this.settings.language;
        
        // Set backup path from settings
        if (backupPathInput) {
            backupPathInput.value = this.settings.backupPath || '';
        }
    }

    handleSettingsChange() {
        const themeSelect = document.getElementById('theme-select');
        const languageSelect = document.getElementById('language-select');
        
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applySettings();
            });
        }
        
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.updateLanguage(e.target.value);
            });
        }
        
        // Save settings button
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
                this.showNotification(this.getTranslation('settingsSaved'));
            });
        }
        
        // Reset settings button
        const resetSettingsBtn = document.getElementById('reset-settings');
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => {
                this.settings = { theme: 'light', language: 'sk', backupPath: '' };
                this.applySettings();
                this.saveSettings();
                this.showNotification('Nastavenia boli obnovené na predvolené');
            });
        }

        // Backup settings buttons
        const testBackupPathBtn = document.getElementById('test-backup-path');
        if (testBackupPathBtn) {
            testBackupPathBtn.addEventListener('click', async () => {
                try {
                    const backupPath = document.getElementById('backup-path').value;
                    if (!backupPath) {
                        this.showNotification('Najprv nastavte cestu k zálohám', 'warning');
                        return;
                    }
                    
                    const result = await window.electronAPI.testBackupPath(backupPath);
                    if (result.success) {
                        this.showNotification('Cesta k zálohám je platná', 'success');
                    } else {
                        this.showNotification('Cesta k zálohám nie je platná', 'error');
                    }
                } catch (error) {
                    console.error('Error testing backup path:', error);
                    this.showNotification('Chyba pri testovaní cesty', 'error');
                }
            });
        }

        const cleanupOldBackupsBtn = document.getElementById('cleanup-old-backups');
        if (cleanupOldBackupsBtn) {
            cleanupOldBackupsBtn.addEventListener('click', async () => {
                try {
                    const result = await window.electronAPI.cleanupOldBackups();
                    if (result.success) {
                        this.showNotification(`Vyčistené ${result.deletedCount} starých záloh`, 'success');
                    } else {
                        this.showNotification('Chyba pri čistení starých záloh', 'error');
                    }
                } catch (error) {
                    console.error('Error cleaning up old backups:', error);
                    this.showNotification('Chyba pri čistení starých záloh', 'error');
                }
            });
        }

        const viewBackupFolderBtn = document.getElementById('view-backup-folder');
        if (viewBackupFolderBtn) {
            viewBackupFolderBtn.addEventListener('click', async () => {
                try {
                    const backupPath = document.getElementById('backup-path').value;
                    if (!backupPath) {
                        this.showNotification('Najprv nastavte cestu k zálohám', 'warning');
                        return;
                    }
                    
                    await window.electronAPI.openBackupFolder(backupPath);
                } catch (error) {
                    console.error('Error opening backup folder:', error);
                    this.showNotification('Chyba pri otváraní priečinka', 'error');
                }
            });
        }

        const changeBackupPathBtn = document.getElementById('change-backup-path');
        if (changeBackupPathBtn) {
            changeBackupPathBtn.addEventListener('click', async () => {
                try {
                    const result = await window.electronAPI.selectBackupPath();
                    if (!result.success || !result.filePaths || result.filePaths.length === 0) {
                        this.showNotification('Nebola vybraná žiadna cesta', 'warning');
                        return;
                    }
                    
                    const selectedPath = result.filePaths[0];
                    document.getElementById('backup-path').value = selectedPath;
                    
                    // Save backup path to settings
                    this.settings.backupPath = selectedPath;
                    this.saveSettings();
                    
                    this.showNotification('Cesta k zálohám bola zmenená', 'success');
                } catch (error) {
                    console.error('Error selecting backup path:', error);
                    this.showNotification('Chyba pri výbere cesty', 'error');
                }
            });
        }
    }
    
    // ===== RESPONSIVE DESIGN METHODS =====
    
    setupResponsiveSidebar() {
        // Add hamburger menu button for mobile
        const header = document.querySelector('.header');
        if (header && window.innerWidth <= 768) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'hamburger-btn';
            hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
            hamburgerBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
            
            // Insert at the beginning of header-left
            const headerLeft = header.querySelector('.header-left');
            if (headerLeft) {
                headerLeft.insertBefore(hamburgerBtn, headerLeft.firstChild);
            }
        }
        
        // Add overlay for mobile sidebar
        this.createSidebarOverlay();
    }
    
    createSidebarOverlay() {
        if (window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => {
                this.toggleSidebar();
            });
            document.body.appendChild(overlay);
        }
    }
    
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
        
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }
    
    handleWindowResize() {
        const width = window.innerWidth;
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        // Remove mobile-specific elements on larger screens
        if (width > 768) {
            if (sidebar) {
                sidebar.classList.remove('collapsed');
            }
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            // Remove hamburger button
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            if (hamburgerBtn) {
                hamburgerBtn.remove();
            }
        } else {
            // Ensure sidebar overlay exists on mobile
            if (!overlay) {
                this.createSidebarOverlay();
            }
            
            // Ensure hamburger button exists
            if (!document.querySelector('.hamburger-btn')) {
                this.setupResponsiveSidebar();
            }
        }
        
        // Adjust table scrolling on resize

    }
    
    adjustTableScrolling() {
        // This function is no longer needed for card layout
        // Keeping it for potential future use
    }
    
    // Enhanced modal handling for mobile
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            
            // Add mobile-specific modal handling
            if (window.innerWidth <= 768) {
                modal.classList.add('mobile-modal');
                
                // Close modal on backdrop click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modalId);
                    }
                });
            }
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('mobile-modal');
        }
    }
    
    // Enhanced form handling for mobile
    setupMobileFormHandling() {
        if (window.innerWidth <= 768) {
            // Add swipe gestures for form navigation
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                let startX = 0;
                let startY = 0;
                
                form.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                });
                
                form.addEventListener('touchend', (e) => {
                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const diffX = startX - endX;
                    const diffY = startY - endY;
                    
                    // Swipe left to close modal
                    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                        const modal = form.closest('.modal');
                        if (modal) {
                            this.closeModal(modal.id);
                        }
                    }
                });
            });
        }
    }
    
    // Optimize images for different screen densities
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (window.devicePixelRatio > 1) {
                // For high DPI displays, ensure images are crisp
                img.style.imageRendering = 'crisp-edges';
            }
        });
    }
    
    // Setup modal scaling for responsive design
    setupModalScaling() {
        // Handle modal scaling based on window size and zoom
        const handleModalScaling = () => {
            const modals = document.querySelectorAll('.modal-content');
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            modals.forEach(modal => {
                const modalRect = modal.getBoundingClientRect();
                const modalWidth = modalRect.width;
                const modalHeight = modalRect.height;
                
                // Check if modal is too large for viewport
                if (modalWidth > windowWidth * 0.95 || modalHeight > windowHeight * 0.95) {
                    const scaleX = (windowWidth * 0.9) / modalWidth;
                    const scaleY = (windowHeight * 0.9) / modalHeight;
                    const scale = Math.min(scaleX, scaleY, 1);
                    
                    modal.style.transform = `scale(${scale})`;
                    modal.style.transformOrigin = 'center center';
                } else {
                    modal.style.transform = 'scale(1)';
                }
            });
        };
        
        // Initial scaling
        handleModalScaling();
        
        // Handle window resize
        window.addEventListener('resize', handleModalScaling);
        
        // Handle zoom changes
        window.addEventListener('zoom', handleModalScaling);
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(handleModalScaling, 100);
        });
    }
    
    // ===== ADVANCED FILTERING =====
    
    setupAdvancedFiltering() {
        // Initialize filter state
        this.filterState = {
            search: '',
            category: '',
            supplier: '',
            status: '',
            priceMin: '',
            priceMax: '',
            quantityMin: '',
            quantityMax: '',
            marginMin: '',
            marginMax: '',
            sortBy: 'name'
        };
        
        // Setup filter toggle
        const toggleBtn = document.getElementById('toggle-filters');
        const filterContent = document.getElementById('filter-content');
        
        if (toggleBtn && filterContent) {
            toggleBtn.addEventListener('click', () => {
                this.toggleFilterPanel();
            });
        }
        
        // Setup filter inputs
        this.setupFilterInputs();
        
        // Setup filter actions
        this.setupFilterActions();
        
        // Populate filter dropdowns
        this.populateFilterDropdowns();
    }
    
    setupFilterInputs() {
        // Search filter
        const searchFilter = document.getElementById('filter-search');
        if (searchFilter) {
            let searchTimeout;
            searchFilter.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterState.search = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterState.category = e.target.value;
                this.applyFilters();
            });
        }
        
        // Supplier filter
        const supplierFilter = document.getElementById('filter-supplier');
        if (supplierFilter) {
            supplierFilter.addEventListener('change', (e) => {
                this.filterState.supplier = e.target.value;
                this.applyFilters();
            });
        }
        
        // Status filter
        const statusFilter = document.getElementById('filter-status');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterState.status = e.target.value;
                this.applyFilters();
            });
        }
        
        // Price range filters
        const priceMinFilter = document.getElementById('filter-price-min');
        const priceMaxFilter = document.getElementById('filter-price-max');
        
        if (priceMinFilter) {
            priceMinFilter.addEventListener('input', (e) => {
                this.filterState.priceMin = e.target.value;
                this.applyFilters();
            });
        }
        
        if (priceMaxFilter) {
            priceMaxFilter.addEventListener('input', (e) => {
                this.filterState.priceMax = e.target.value;
                this.applyFilters();
            });
        }
        
        // Quantity range filters
        const quantityMinFilter = document.getElementById('filter-quantity-min');
        const quantityMaxFilter = document.getElementById('filter-quantity-max');
        
        if (quantityMinFilter) {
            quantityMinFilter.addEventListener('input', (e) => {
                this.filterState.quantityMin = e.target.value;
                this.applyFilters();
            });
        }
        
        if (quantityMaxFilter) {
            quantityMaxFilter.addEventListener('input', (e) => {
                this.filterState.quantityMax = e.target.value;
                this.applyFilters();
            });
        }
        
        // Margin range filters
        const marginMinFilter = document.getElementById('filter-margin-min');
        const marginMaxFilter = document.getElementById('filter-margin-max');
        
        if (marginMinFilter) {
            marginMinFilter.addEventListener('input', (e) => {
                this.filterState.marginMin = e.target.value;
                this.applyFilters();
            });
        }
        
        if (marginMaxFilter) {
            marginMaxFilter.addEventListener('input', (e) => {
                this.filterState.marginMax = e.target.value;
                this.applyFilters();
            });
        }
        
        // Sort filter
        const sortFilter = document.getElementById('filter-sort');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filterState.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    }
    
    setupFilterActions() {
        // Apply filters button
        const applyBtn = document.getElementById('apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Clear filters button
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Save filters button
        const saveBtn = document.getElementById('save-filters');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveFilters();
            });
        }
    }
    
    populateFilterDropdowns() {
        // Populate category dropdown
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter && this.categories.length > 0) {
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }
        
        // Populate supplier dropdown
        const supplierFilter = document.getElementById('filter-supplier');
        if (supplierFilter && this.suppliers.length > 0) {
            this.suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                supplierFilter.appendChild(option);
            });
        }
    }
    
    toggleFilterPanel() {
        const filterContent = document.getElementById('filter-content');
        const toggleBtn = document.getElementById('toggle-filters');
        const toggleText = toggleBtn.querySelector('span');
        const toggleIcon = toggleBtn.querySelector('i');
        
        if (filterContent.classList.contains('expanded')) {
            filterContent.classList.remove('expanded');
            toggleText.textContent = this.getTranslation('showFilters');
            toggleIcon.className = 'fas fa-chevron-down';
        } else {
            filterContent.classList.add('expanded');
            toggleText.textContent = this.getTranslation('hideFilters');
            toggleIcon.className = 'fas fa-chevron-up';
        }
    }
    
    applyFilters() {
        let filteredProducts = [...this.products];
        
        // Apply search filter
        if (this.filterState.search) {
            const searchTerm = this.filterState.search.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                (product.plu && product.plu.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply category filter
        if (this.filterState.category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category_id === this.filterState.category
            );
        }
        
        // Apply supplier filter
        if (this.filterState.supplier) {
            filteredProducts = filteredProducts.filter(product => 
                product.supplier_id === this.filterState.supplier
            );
        }
        
        // Apply status filter
        if (this.filterState.status) {
            filteredProducts = filteredProducts.filter(product => {
                const status = this.getProductStatus(product);
                return status.class === this.filterState.status;
            });
        }
        
        // Apply price range filter
        if (this.filterState.priceMin) {
            filteredProducts = filteredProducts.filter(product => 
                (product.price || 0) >= parseFloat(this.filterState.priceMin)
            );
        }
        
        if (this.filterState.priceMax) {
            filteredProducts = filteredProducts.filter(product => 
                (product.price || 0) <= parseFloat(this.filterState.priceMax)
            );
        }
        
        // Apply quantity range filter
        if (this.filterState.quantityMin) {
            filteredProducts = filteredProducts.filter(product => 
                (product.quantity || 0) >= parseInt(this.filterState.quantityMin)
            );
        }
        
        if (this.filterState.quantityMax) {
            filteredProducts = filteredProducts.filter(product => 
                (product.quantity || 0) <= parseInt(this.filterState.quantityMax)
            );
        }
        
        // Apply margin range filter
        if (this.filterState.marginMin || this.filterState.marginMax) {
            filteredProducts = filteredProducts.filter(product => {
                const cost = product.cost || 0;
                const price = product.price || 0;
                const margin = price > 0 ? ((price - cost) / price * 100) : 0;
                
                if (this.filterState.marginMin && margin < parseFloat(this.filterState.marginMin)) {
                    return false;
                }
                
                if (this.filterState.marginMax && margin > parseFloat(this.filterState.marginMax)) {
                    return false;
                }
                
                return true;
            });
        }
        
        // Apply sorting
        filteredProducts = this.sortProducts(filteredProducts, this.filterState.sortBy);
        
        // Update display
        this.displayFilteredProducts(filteredProducts);
        this.updateFilterResults(filteredProducts.length);
        this.showActiveFilters();
    }
    
    sortProducts(products, sortBy) {
        return products.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price':
                    return (a.price || 0) - (b.price || 0);
                case 'price-desc':
                    return (b.price || 0) - (a.price || 0);
                case 'quantity':
                    return (a.quantity || 0) - (b.quantity || 0);
                case 'quantity-desc':
                    return (b.quantity || 0) - (a.quantity || 0);
                case 'margin':
                    const marginA = a.price > 0 ? ((a.price - (a.cost || 0)) / a.price * 100) : 0;
                    const marginB = b.price > 0 ? ((b.price - (b.cost || 0)) / b.price * 100) : 0;
                    return marginA - marginB;
                case 'margin-desc':
                    const marginA2 = a.price > 0 ? ((a.price - (a.cost || 0)) / a.price * 100) : 0;
                    const marginB2 = b.price > 0 ? ((b.price - (b.cost || 0)) / b.price * 100) : 0;
                    return marginB2 - marginA2;
                case 'updated':
                    return new Date(b.updated_at) - new Date(a.updated_at);
                default:
                    return 0;
            }
        });
    }
    
    displayFilteredProducts(filteredProducts) {
        // Store filtered products for other methods to use
        this.filteredProducts = filteredProducts;
        
        // Update the products display
        const cardsContainer = document.getElementById('products-cards-container');
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            cardsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>${this.getTranslation('noProductsFound')}</p>
                </div>`;
            return;
        }
        
        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            const status = this.getProductStatus(product);
            
            // Calculate margin
            const cost = product.cost || 0;
            const price = product.price || 0;
            const priceWithVat = product.price_with_vat || price * 1.23;
            const costWithVat = product.cost_with_vat || cost * 1.23;
            const margin = priceWithVat > 0 ? ((priceWithVat - costWithVat) / priceWithVat * 100) : 0;
            const marginClass = margin >= 30 ? 'high' : margin >= 15 ? 'medium' : 'low';
            
            // Determine quantity class
            const quantity = product.quantity || 0;
            let quantityClass = 'success';
            if (quantity === 0) quantityClass = 'danger';
            else if (quantity <= 5) quantityClass = 'warning';
            
            card.className = 'product-card collapsed';
            card.innerHTML = `
                <div class="product-card-header">
                    <h3>${product.name}</h3>
                    <div class="product-card-ean">EAN: ${product.sku}</div>
                    ${product.plu ? `<div class="product-card-plu">PLU: ${product.plu}</div>` : ''}
                </div>
                <div class="product-card-content">
                    <div class="product-info-grid">
                        <div class="product-info-item">
                            <div class="product-info-label">Kategória</div>
                            <div class="product-info-value">${product.category_name || 'Neuvedená'}</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Dodávateľ</div>
                            <div class="product-info-value">${product.supplier_name || 'Neuvedený'}</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Množstvo</div>
                            <div class="product-info-value ${quantityClass}">${quantity} ks</div>
                        </div>
                        <div class="product-info-item">
                            <div class="product-info-label">Stav</div>
                            <div class="product-status">
                                <div class="status-indicator ${status.class}"></div>
                                <span class="status-text">${status.text}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-pricing">
                        <div class="pricing-row">
                            <span class="pricing-label">Predaj bez DPH:</span>
                            <span class="pricing-value">€${price.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Predaj s DPH:</span>
                            <span class="pricing-value">€${priceWithVat.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Nákup bez DPH:</span>
                            <span class="pricing-value">€${cost.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Nákup s DPH:</span>
                            <span class="pricing-value">€${costWithVat.toFixed(2)}</span>
                        </div>
                        <div class="pricing-row">
                            <span class="pricing-label">Marža:</span>
                            <span class="pricing-value margin ${marginClass}">${margin.toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    ${product.description ? `
                        <div class="product-description">
                            <div class="product-info-label">Popis</div>
                            <div class="product-info-value">${product.description}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="product-card-actions">
                    <button class="btn btn-info" onclick="app.editProduct('${product.id}')" title="Upraviť">
                        <i class="fas fa-edit"></i> Upraviť
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteProduct('${product.id}')" title="Vymazať">
                        <i class="fas fa-trash"></i> Vymazať
                    </button>
                </div>
                <div class="expand-indicator">
                    <span>Rozbaliť detaily</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            `;
            
            // Add click event for expanding/collapsing
            card.addEventListener('click', (e) => {
                // Don't expand if clicking on action buttons
                if (e.target.closest('.product-card-actions')) {
                    return;
                }
                this.toggleProductCard(card);
            });
            cardsContainer.appendChild(card);
        });
    }
    
    updateFilterResults(count) {
        const resultsElement = document.getElementById('filter-results-count');
        if (resultsElement) {
            const total = this.products.length;
            const text = this.getTranslation('showingResults')
                .replace('{count}', count)
                .replace('{total}', total);
            resultsElement.textContent = text;
        }
    }
    
    showActiveFilters() {
        // Remove existing active filters display
        let activeFiltersContainer = document.querySelector('.active-filters');
        if (activeFiltersContainer) {
            activeFiltersContainer.remove();
        }
        
        // Create new active filters display
        const activeFilters = [];
        
        if (this.filterState.search) {
            activeFilters.push({
                type: 'search',
                label: `Hľadanie: "${this.filterState.search}"`,
                value: this.filterState.search
            });
        }
        
        if (this.filterState.category) {
            const category = this.categories.find(c => c.id === this.filterState.category);
            if (category) {
                activeFilters.push({
                    type: 'category',
                    label: `Kategória: ${category.name}`,
                    value: this.filterState.category
                });
            }
        }
        
        if (this.filterState.supplier) {
            const supplier = this.suppliers.find(s => s.id === this.filterState.supplier);
            if (supplier) {
                activeFilters.push({
                    type: 'supplier',
                    label: `Dodávateľ: ${supplier.name}`,
                    value: this.filterState.supplier
                });
            }
        }
        
        if (this.filterState.status) {
            const statusLabels = {
                'in-stock': 'Na sklade',
                'low-stock': 'Nízky stav',
                'out-of-stock': 'Vypredané'
            };
            activeFilters.push({
                type: 'status',
                label: `Stav: ${statusLabels[this.filterState.status]}`,
                value: this.filterState.status
            });
        }
        
        if (this.filterState.priceMin || this.filterState.priceMax) {
            const priceRange = `${this.filterState.priceMin || '0'} - ${this.filterState.priceMax || '∞'} €`;
            activeFilters.push({
                type: 'price',
                label: `Cena: ${priceRange}`,
                value: { min: this.filterState.priceMin, max: this.filterState.priceMax }
            });
        }
        
        if (this.filterState.quantityMin || this.filterState.quantityMax) {
            const quantityRange = `${this.filterState.quantityMin || '0'} - ${this.filterState.quantityMax || '∞'}`;
            activeFilters.push({
                type: 'quantity',
                label: `Množstvo: ${quantityRange}`,
                value: { min: this.filterState.quantityMin, max: this.filterState.quantityMax }
            });
        }
        
        if (this.filterState.marginMin || this.filterState.marginMax) {
            const marginRange = `${this.filterState.marginMin || '0'}% - ${this.filterState.marginMax || '100'}%`;
            activeFilters.push({
                type: 'margin',
                label: `Marža: ${marginRange}`,
                value: { min: this.filterState.marginMin, max: this.filterState.marginMax }
            });
        }
        
        // Create and display active filters
        if (activeFilters.length > 0) {
            const filterContent = document.getElementById('filter-content');
            if (filterContent) {
                activeFiltersContainer = document.createElement('div');
                activeFiltersContainer.className = 'active-filters';
                
                activeFilters.forEach(filter => {
                    const filterTag = document.createElement('div');
                    filterTag.className = 'filter-tag';
                    filterTag.innerHTML = `
                        <span>${filter.label}</span>
                        <i class="fas fa-times" onclick="app.removeFilter('${filter.type}')"></i>
                    `;
                    activeFiltersContainer.appendChild(filterTag);
                });
                
                filterContent.appendChild(activeFiltersContainer);
            }
        }
    }
    
    removeFilter(filterType) {
        switch (filterType) {
            case 'search':
                this.filterState.search = '';
                document.getElementById('filter-search').value = '';
                break;
            case 'category':
                this.filterState.category = '';
                document.getElementById('filter-category').value = '';
                break;
            case 'supplier':
                this.filterState.supplier = '';
                document.getElementById('filter-supplier').value = '';
                break;
            case 'status':
                this.filterState.status = '';
                document.getElementById('filter-status').value = '';
                break;
            case 'price':
                this.filterState.priceMin = '';
                this.filterState.priceMax = '';
                document.getElementById('filter-price-min').value = '';
                document.getElementById('filter-price-max').value = '';
                break;
            case 'quantity':
                this.filterState.quantityMin = '';
                this.filterState.quantityMax = '';
                document.getElementById('filter-quantity-min').value = '';
                document.getElementById('filter-quantity-max').value = '';
                break;
            case 'margin':
                this.filterState.marginMin = '';
                this.filterState.marginMax = '';
                document.getElementById('filter-margin-min').value = '';
                document.getElementById('filter-margin-max').value = '';
                break;
        }
        
        this.applyFilters();
    }
    
    clearFilters() {
        // Reset filter state
        this.filterState = {
            search: '',
            category: '',
            supplier: '',
            status: '',
            priceMin: '',
            priceMax: '',
            quantityMin: '',
            quantityMax: '',
            marginMin: '',
            marginMax: '',
            sortBy: 'name'
        };
        
        // Clear all filter inputs
        const filterInputs = [
            'filter-search', 'filter-category', 'filter-supplier', 'filter-status',
            'filter-price-min', 'filter-price-max', 'filter-quantity-min', 'filter-quantity-max',
            'filter-margin-min', 'filter-margin-max'
        ];
        
        filterInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = '';
            }
        });
        
        // Reset sort
        const sortFilter = document.getElementById('filter-sort');
        if (sortFilter) {
            sortFilter.value = 'name';
        }
        
        // Apply filters to show all products
        this.applyFilters();
        
        this.showNotification('Filtre boli vyčistené', 'success');
    }
    
    saveFilters() {
        try {
            const savedFilters = JSON.parse(localStorage.getItem('savedFilters') || '[]');
            const filterName = prompt('Zadajte názov pre uloženie filtrov:');
            
            if (filterName) {
                const filterToSave = {
                    name: filterName,
                    filters: { ...this.filterState },
                    timestamp: new Date().toISOString()
                };
                
                savedFilters.push(filterToSave);
                localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                
                this.showNotification('Filtre boli úspešne uložené', 'success');
            }
        } catch (error) {
            console.error('Error saving filters:', error);
            this.showNotification('Chyba pri ukladaní filtrov', 'error');
        }
    }
    
    // ===== VAT CALCULATION =====
    
    setupVatCalculation() {
        const costInput = document.getElementById('product-cost');
        const vatRateSelect = document.getElementById('product-vat-rate');
        const customVatInput = document.getElementById('product-custom-vat');
        const costWithVatInput = document.getElementById('product-cost-with-vat');
        
        if (costInput) {
            costInput.addEventListener('input', () => {
                this.calculateVat();
            });
        }
        
        if (vatRateSelect) {
            vatRateSelect.addEventListener('change', () => {
                this.handleVatRateChange();
                this.calculateSellingPriceWithoutVAT();
            });
        }
        
        if (customVatInput) {
            customVatInput.addEventListener('input', () => {
                this.calculateVat();
                this.calculateSellingPriceWithoutVAT();
            });
        }
        
        // Add event listener for selling price with VAT to update price without VAT and margin
        const sellingPriceWithVatInput = document.getElementById('product-selling-price-with-vat');
        if (sellingPriceWithVatInput) {
            sellingPriceWithVatInput.addEventListener('input', () => {
                console.log('Zmena predajnej ceny s DPH:', sellingPriceWithVatInput.value);
                this.calculateSellingPriceWithoutVAT();
                this.updateMarginCalculation();
            });
        }
    }
    
    handleVatRateChange() {
        const vatRateSelect = document.getElementById('product-vat-rate');
        const customVatGroup = document.getElementById('custom-vat-group');
        const customVatInput = document.getElementById('product-custom-vat');
        
        if (vatRateSelect.value === 'custom') {
            customVatGroup.style.display = 'block';
            customVatInput.focus();
        } else {
            customVatGroup.style.display = 'none';
            customVatInput.value = '';
        }
        
        this.calculateVat();
    }
    
    calculateVat() {
        const costInput = document.getElementById('product-cost');
        const vatRateSelect = document.getElementById('product-vat-rate');
        const customVatInput = document.getElementById('product-custom-vat');
        const costWithVatInput = document.getElementById('product-cost-with-vat');
        
        if (!costInput || !costWithVatInput) return;
        
        const costWithoutVat = parseFloat(costInput.value) || 0;
        let vatRate = 0;
        
        if (vatRateSelect.value === 'custom') {
            vatRate = parseFloat(customVatInput.value) || 0;
        } else {
            vatRate = parseFloat(vatRateSelect.value) || 0;
        }
        
        const vatMultiplier = 1 + (vatRate / 100);
        const costWithVat = costWithoutVat * vatMultiplier;
        
        costWithVatInput.value = costWithVat.toFixed(2);
        
        // Update margin calculation if selling price is set
        this.updateMarginCalculation();
    }
    
    calculateSellingPriceWithoutVAT() {
        const sellingPriceInput = document.getElementById('product-selling-price');
        const sellingPriceWithVatInput = document.getElementById('product-selling-price-with-vat');
        
        if (!sellingPriceInput || !sellingPriceWithVatInput) return;
        
        const sellingPriceWithVat = parseFloat(sellingPriceWithVatInput.value) || 0;
        const vatRate = this.getSelectedVatRate();
        
        console.log('Aktuálna sadzba DPH:', vatRate + '%');
        
        // Správny výpočet: Predaj bez DPH = Predaj s DPH / (1 + DPH/100)
        // Pre 23% DPH: 123€ / 1.23 = 100€
        const vatMultiplier = 1 + (vatRate / 100);
        const sellingPriceWithoutVat = sellingPriceWithVat / vatMultiplier;
        
        console.log(`Výpočet: ${sellingPriceWithVat}€ / ${vatMultiplier} = ${sellingPriceWithoutVat.toFixed(2)}€`);
        
        sellingPriceInput.value = sellingPriceWithoutVat.toFixed(2);
    }
    
    calculateSellingPriceWithVAT() {
        const sellingPriceInput = document.getElementById('product-selling-price');
        const sellingPriceWithVatInput = document.getElementById('product-selling-price-with-vat');
        
        if (!sellingPriceInput || !sellingPriceWithVatInput) return;
        
        const sellingPriceWithoutVat = parseFloat(sellingPriceInput.value) || 0;
        const vatRate = this.getSelectedVatRate();
        
        // Správny výpočet: Predaj s DPH = Predaj bez DPH * (1 + DPH/100)
        // Pre 23% DPH: 100€ * 1.23 = 123€
        const vatMultiplier = 1 + (vatRate / 100);
        const sellingPriceWithVat = sellingPriceWithoutVat * vatMultiplier;
        
        console.log(`Výpočet: ${sellingPriceWithoutVat}€ * ${vatMultiplier} = ${sellingPriceWithVat.toFixed(2)}€`);
        
        sellingPriceWithVatInput.value = sellingPriceWithVat.toFixed(2);
    }
    
    updateMarginCalculation() {
        const costWithVatInput = document.getElementById('product-cost-with-vat');
        const sellingPriceWithVatInput = document.getElementById('product-selling-price-with-vat');
        
        if (!costWithVatInput || !sellingPriceWithVatInput) return;
        
        const costWithVat = parseFloat(costWithVatInput.value) || 0;
        const sellingPriceWithVat = parseFloat(sellingPriceWithVatInput.value) || 0;
        
        if (sellingPriceWithVat > 0 && costWithVat > 0) {
            const margin = ((sellingPriceWithVat - costWithVat) / sellingPriceWithVat * 100);
            // You can display this margin somewhere if needed
            console.log('Margin:', margin.toFixed(2) + '%');
        }
    }
    

    
    forceScrollbarDisplay() {
        // Setup tooltip positioning
        this.setupTooltipPositioning();
        
        // Optimize layout for window size
        this.optimizeLayoutForWindowSize();
    }
    
    optimizeLayoutForWindowSize() {
        const isMaximized = window.innerWidth >= 1920;
        const isUltraWide = window.innerWidth >= 2560;
        
        document.body.classList.toggle('maximized', isMaximized);
        document.body.classList.toggle('ultra-wide', isUltraWide);
        
        // Adjust content height for better fit
        const content = document.querySelector('.content');
        if (content) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const availableHeight = window.innerHeight - headerHeight;
            content.style.height = `${availableHeight}px`;
        }
    }
    
    setupTooltipPositioning() {
        // Remove any existing tooltips first
        const existingTooltips = document.querySelectorAll('.custom-tooltip');
        existingTooltips.forEach(tooltip => tooltip.remove());
        
        const productCells = document.querySelectorAll('.product-name-cell[data-tooltip]');
        
        productCells.forEach(cell => {
            // Remove existing event listeners
            cell.removeEventListener('mouseenter', cell.tooltipEnterHandler);
            cell.removeEventListener('mouseleave', cell.tooltipLeaveHandler);
            
            cell.tooltipEnterHandler = (e) => {
                // Remove any existing tooltips
                const existingTooltips = document.querySelectorAll('.custom-tooltip');
                existingTooltips.forEach(tooltip => tooltip.remove());
                
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                tooltip.style.position = 'fixed';
                tooltip.style.zIndex = '9999';
                tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '8px 12px';
                tooltip.style.borderRadius = '6px';
                tooltip.style.fontSize = '12px';
                tooltip.style.maxWidth = '300px';
                tooltip.style.wordWrap = 'break-word';
                tooltip.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.2s ease';
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = e.target.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top - tooltipRect.height - 10;
                
                // Adjust if tooltip goes off screen
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) {
                    top = rect.bottom + 10;
                }
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                tooltip.style.opacity = '1';
                
                // Store tooltip reference
                e.target.tooltip = tooltip;
            };
            
            cell.tooltipLeaveHandler = (e) => {
                if (e.target.tooltip) {
                    e.target.tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (e.target.tooltip && e.target.tooltip.parentNode) {
                            e.target.tooltip.remove();
                            e.target.tooltip = null;
                        }
                    }, 100);
                }
            };
            
            // Add new event listeners
            cell.addEventListener('mouseenter', cell.tooltipEnterHandler);
            cell.addEventListener('mouseleave', cell.tooltipLeaveHandler);
        });
    }
    

    
    getSelectedVatRate() {
        const vatRateSelect = document.getElementById('product-vat-rate');
        const customVatInput = document.getElementById('product-custom-vat');
        
        if (vatRateSelect.value === 'custom') {
            return parseFloat(customVatInput.value) || 0;
        } else {
            return parseFloat(vatRateSelect.value) || 0;
        }
    }

    // Update functionality methods
    setupUpdateListeners() {
        // Listen for update status from main process
        if (window.electronAPI && window.electronAPI.onUpdateStatus) {
            window.electronAPI.onUpdateStatus((event, data) => {
                this.handleUpdateStatus(data);
            });
        }
    }

    handleUpdateStatus(data) {
        console.log('Update status received:', data);
        
        const updateStatusElement = document.getElementById('update-status');
        if (updateStatusElement) {
            updateStatusElement.textContent = data.message;
        }
        
        if (data.message === 'Dostupná aktualizácia') {
            this.updateStatus.isUpdateAvailable = true;
            this.updateStatus.updateInfo = data.data;
            this.showUpdateNotification(data.data);
        } else if (data.message === 'Sťahujem aktualizáciu...') {
            this.updateStatus.isDownloading = true;
            this.updateStatus.downloadProgress = data.data.percent || 0;
            this.updateDownloadProgress(data.data);
        } else if (data.message === 'Aktualizácia pripravená na inštaláciu') {
            this.updateStatus.isDownloading = false;
            this.showInstallNotification(data.data);
        }
        
        this.updateUpdateUI();
    }

    showUpdateNotification(updateInfo) {
        const notification = document.createElement('div');
        notification.className = 'notification update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-download"></i>
                <div class="update-text">
                    <strong>Dostupná aktualizácia v${updateInfo.version}</strong>
                    <button class="btn btn-sm btn-primary" onclick="app.downloadUpdate()">
                        Stiahnuť
                    </button>
                </div>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    showInstallNotification(updateInfo) {
        const notification = document.createElement('div');
        notification.className = 'notification install-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-check-circle"></i>
                <div class="update-text">
                    <strong>Aktualizácia pripravená</strong>
                    <button class="btn btn-sm btn-success" onclick="app.installUpdate()">
                        Inštalovať
                    </button>
                </div>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);
    }

    updateDownloadProgress(progress) {
        const progressBar = document.querySelector('.update-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress.percent}%`;
            progressBar.textContent = `${Math.round(progress.percent)}%`;
        }
    }

    updateUpdateUI() {
        const updateBtn = document.getElementById('check-updates-btn');
        if (updateBtn) {
            if (this.updateStatus.isUpdateAvailable) {
                updateBtn.innerHTML = '<i class="fas fa-download"></i> Aktualizácia dostupná';
                updateBtn.className = 'btn btn-warning';
            } else if (this.updateStatus.isDownloading) {
                updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sťahujem...';
                updateBtn.disabled = true;
            } else {
                updateBtn.innerHTML = '<i class="fas fa-sync"></i> Kontrolovať aktualizácie';
                updateBtn.className = 'btn btn-secondary';
                updateBtn.disabled = false;
            }
        }
    }

    async checkForUpdates() {
        try {
            const result = await window.electronAPI.checkForUpdates();
            if (result.success) {
                this.showNotification('Kontrola aktualizácií dokončená', 'success');
            } else {
                this.showNotification('Chyba pri kontrole aktualizácií', 'error');
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
            this.showNotification('Chyba pri kontrole aktualizácií', 'error');
        }
    }

    async downloadUpdate() {
        try {
            const result = await window.electronAPI.downloadUpdate();
            if (result.success) {
                this.showNotification('Sťahovanie aktualizácie spustené', 'success');
            } else {
                this.showNotification('Chyba pri sťahovaní aktualizácie', 'error');
            }
        } catch (error) {
            console.error('Error downloading update:', error);
            this.showNotification('Chyba pri sťahovaní aktualizácie', 'error');
        }
    }

    async installUpdate() {
        try {
            const result = await window.electronAPI.installUpdate();
            if (result.success) {
                this.showNotification('Inštalácia aktualizácie spustená', 'success');
            } else {
                this.showNotification('Chyba pri inštalácii aktualizácie', 'error');
            }
        } catch (error) {
            console.error('Error installing update:', error);
            this.showNotification('Chyba pri inštalácii aktualizácie', 'error');
        }
    }

    async loadAppVersion() {
        try {
            if (window.electronAPI && window.electronAPI.getAppVersion) {
                const version = await window.electronAPI.getAppVersion();
                const versionElement = document.getElementById('current-version');
                if (versionElement) {
                    versionElement.textContent = version;
                }
            }
        } catch (error) {
            console.error('Error loading app version:', error);
            const versionElement = document.getElementById('current-version');
            if (versionElement) {
                versionElement.textContent = 'Chyba';
            }
        }
    }

    toggleProductCard(card) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse the card
            card.classList.remove('expanded');
            card.classList.add('collapsed');
            
            // Update the expand indicator
            const expandIndicator = card.querySelector('.expand-indicator');
            if (expandIndicator) {
                expandIndicator.innerHTML = `
                    <span>Rozbaliť detaily</span>
                    <i class="fas fa-chevron-down"></i>
                `;
            }
        } else {
            // Expand the card
            card.classList.remove('collapsed');
            card.classList.add('expanded');
            
            // Update the expand indicator
            const expandIndicator = card.querySelector('.expand-indicator');
            if (expandIndicator) {
                expandIndicator.innerHTML = `
                    <span>Zbaliť detaily</span>
                    <i class="fas fa-chevron-up"></i>
                `;
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
        
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }

    // Inventory functions
    startInventory() {
        this.inventoryData = [];
        this.inventoryActive = true;
        
        // Create inventory data from current products
        this.inventoryData = this.products.map(product => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
            currentQuantity: product.quantity || 0,
            countedQuantity: product.quantity || 0,
            category: product.category_name || 'Neuvedená',
            supplier: product.supplier_name || 'Neuvedený',
            status: 'pending'
        }));
        
        this.renderInventory();
        this.updateInventoryControls();
        this.showNotification(this.getTranslation('inventoryStarted'), 'success');
    }

    renderInventory() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;

        // Add summary
        const summary = this.calculateInventorySummary();
        inventoryList.innerHTML = `
            <div class="inventory-summary">
                <div class="inventory-summary-grid">
                    <div class="inventory-summary-item">
                        <div class="inventory-summary-label">Celkovo produktov</div>
                        <div class="inventory-summary-value total">${summary.total}</div>
                    </div>
                    <div class="inventory-summary-item">
                        <div class="inventory-summary-label">Zhodné</div>
                        <div class="inventory-summary-value">${summary.matches}</div>
                    </div>
                    <div class="inventory-summary-item">
                        <div class="inventory-summary-label">Rozdiely</div>
                        <div class="inventory-summary-value differences">${summary.differences}</div>
                    </div>
                    <div class="inventory-summary-item">
                        <div class="inventory-summary-label">Nezapočítané</div>
                        <div class="inventory-summary-value pending">${summary.pending}</div>
                    </div>
                </div>
            </div>
        `;

        // Add inventory items
        this.inventoryData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            
            const statusClass = item.status === 'match' ? 'match' : 
                              item.status === 'difference' ? 'difference' : 'pending';
            
            itemElement.innerHTML = `
                <div class="inventory-item-info">
                    <div class="inventory-item-name">${item.name}</div>
                    <div class="inventory-item-details">
                        <span>EAN: ${item.sku}</span>
                        <span>Kategória: ${item.category}</span>
                        <span>Dodávateľ: ${item.supplier}</span>
                    </div>
                </div>
                <div class="inventory-item-quantity">
                    <span>Systém: ${item.currentQuantity}</span>
                    <input type="number" 
                           value="${item.countedQuantity}" 
                           min="0" 
                           onchange="app.updateInventoryQuantity('${item.id}', this.value)"
                           placeholder="Počet">
                    <div class="inventory-item-status ${statusClass}">
                        <i class="fas fa-${item.status === 'match' ? 'check' : item.status === 'difference' ? 'exclamation-triangle' : 'clock'}"></i>
                        <span>${item.status === 'match' ? 'Zhodné' : item.status === 'difference' ? 'Rozdiel' : 'Nezapočítané'}</span>
                    </div>
                </div>
            `;
            
            inventoryList.appendChild(itemElement);
        });
    }

    updateInventoryQuantity(productId, newQuantity) {
        const item = this.inventoryData.find(item => item.id === productId);
        if (!item) return;

        const countedQuantity = parseInt(newQuantity) || 0;
        item.countedQuantity = countedQuantity;
        
        // Update status
        if (countedQuantity === item.currentQuantity) {
            item.status = 'match';
        } else if (countedQuantity !== item.currentQuantity) {
            item.status = 'difference';
        } else {
            item.status = 'pending';
        }
        
        this.renderInventory();
    }

    calculateInventorySummary() {
        const summary = {
            total: this.inventoryData.length,
            matches: 0,
            differences: 0,
            pending: 0
        };

        this.inventoryData.forEach(item => {
            if (item.status === 'match') summary.matches++;
            else if (item.status === 'difference') summary.differences++;
            else summary.pending++;
        });

        return summary;
    }

    updateInventoryControls() {
        const startBtn = document.querySelector('button[onclick="app.startInventory()"]');
        const exportBtn = document.querySelector('button[onclick="app.exportInventory()"]');
        const pdfBtn = document.querySelector('button[onclick="app.exportInventoryToPDF()"]');
        const finishBtn = document.querySelector('button[onclick="app.finishInventory()"]');

        if (startBtn) startBtn.style.display = this.inventoryActive ? 'none' : 'block';
        if (exportBtn) exportBtn.style.display = this.inventoryActive ? 'block' : 'none';
        if (pdfBtn) pdfBtn.style.display = this.inventoryActive ? 'block' : 'none';
        if (finishBtn) finishBtn.style.display = this.inventoryActive ? 'block' : 'none';
    }

    exportInventory() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            this.showNotification(this.getTranslation('noDataToExport'), 'warning');
            return;
        }

        const summary = this.calculateInventorySummary();
        const differences = this.inventoryData.filter(item => item.status === 'difference');
        
        // Create properly formatted CSV with separate columns
        let csvContent = 'Názov produktu,EAN,Systémové množstvo,Skutočné množstvo,Rozdiel,Kategória,Dodávateľ,Stav\n';
        
        this.inventoryData.forEach(item => {
            const difference = item.countedQuantity - item.currentQuantity;
            const status = item.status === 'match' ? 'Zhodné' : item.status === 'difference' ? 'Rozdiel' : 'Nezapočítané';
            csvContent += `"${item.name}","${item.sku}",${item.currentQuantity},${item.countedQuantity},${difference},"${item.category}","${item.supplier}","${status}"\n`;
        });

        // Add summary section with proper spacing
        csvContent += '\n';
        csvContent += 'Súhrn inventúry\n';
        csvContent += 'Kategória,Hodnota\n';
        csvContent += `Celkovo produktov,${summary.total}\n`;
        csvContent += `Zhodné,${summary.matches}\n`;
        csvContent += `Rozdiely,${summary.differences}\n`;
        csvContent += `Nezapočítané,${summary.pending}\n`;

        // Save inventory to database
        this.saveInventoryToDatabase();

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `inventura_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification(this.getTranslation('inventoryExported'), 'success');
    }

    exportInventoryToPDF() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            this.showNotification(this.getTranslation('noDataToExport'), 'warning');
            return;
        }

        const summary = this.calculateInventorySummary();
        const differences = this.inventoryData.filter(item => item.status === 'difference');
        
        // Create PDF content
        let pdfContent = `
            <html>
            <head>
                <meta charset="utf-8">
                <title>Inventúra produktov</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .summary { margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
                    .summary h3 { margin-top: 0; }
                    .summary-item { margin: 10px 0; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .header h1 { color: #2c3e50; }
                    .status-match { color: #27ae60; }
                    .status-difference { color: #e74c3c; }
                    .status-pending { color: #f39c12; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Inventúra produktov</h1>
                    <p>Dátum: ${new Date().toLocaleDateString('sk-SK')}</p>
                </div>
                
                <div class="summary">
                    <h3>Súhrn inventúry</h3>
                    <div class="summary-item">Celkovo produktov: ${summary.total}</div>
                    <div class="summary-item">Zhodné: ${summary.matches}</div>
                    <div class="summary-item">Rozdiely: ${summary.differences}</div>
                    <div class="summary-item">Nezapočítané: ${summary.pending}</div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Názov produktu</th>
                            <th>EAN</th>
                            <th>Systémové množstvo</th>
                            <th>Skutočné množstvo</th>
                            <th>Rozdiel</th>
                            <th>Kategória</th>
                            <th>Dodávateľ</th>
                            <th>Stav</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.inventoryData.forEach(item => {
            const difference = item.countedQuantity - item.currentQuantity;
            const statusClass = item.status === 'match' ? 'status-match' : item.status === 'difference' ? 'status-difference' : 'status-pending';
            const status = item.status === 'match' ? 'Zhodné' : item.status === 'difference' ? 'Rozdiel' : 'Nezapočítané';
            
            pdfContent += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.currentQuantity}</td>
                    <td>${item.countedQuantity}</td>
                    <td>${difference}</td>
                    <td>${item.category}</td>
                    <td>${item.supplier}</td>
                    <td class="${statusClass}">${status}</td>
                </tr>
            `;
        });
        
        pdfContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Save inventory to database
        this.saveInventoryToDatabase();

        // Create PDF using browser print functionality
        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };

        this.showNotification(this.getTranslation('inventoryExportedPDF'), 'success');
    }

    saveInventoryToDatabase() {
        if (!this.inventoryData || this.inventoryData.length === 0) return;

        const inventoryRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            summary: this.calculateInventorySummary(),
            items: this.inventoryData,
            totalProducts: this.inventoryData.length,
            differences: this.inventoryData.filter(item => item.status === 'difference').length,
            matches: this.inventoryData.filter(item => item.status === 'match').length,
            pending: this.inventoryData.filter(item => item.status === 'pending').length
        };

        // Save to localStorage for now (in real app, save to database)
        let savedInventories = JSON.parse(localStorage.getItem('savedInventories') || '[]');
        savedInventories.push(inventoryRecord);
        localStorage.setItem('savedInventories', JSON.stringify(savedInventories));
    }

    loadSavedInventories() {
        const savedInventories = JSON.parse(localStorage.getItem('savedInventories') || '[]');
        return savedInventories.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    showSavedInventories() {
        const savedInventories = this.loadSavedInventories();
        const inventoryList = document.getElementById('inventory-list');
        
        if (savedInventories.length === 0) {
            inventoryList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>${this.getTranslation('noSavedInventories')}</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="saved-inventories-header">
                <h3>Uložené inventúry</h3>
                <button class="btn btn-sm btn-danger" onclick="app.clearSavedInventories()">
                    <i class="fas fa-trash"></i> Vymazať všetky
                </button>
            </div>
        `;

        savedInventories.forEach(inventory => {
            const date = new Date(inventory.date).toLocaleDateString('sk-SK');
            const time = new Date(inventory.date).toLocaleTimeString('sk-SK');
            
            html += `
                <div class="saved-inventory-item">
                    <div class="saved-inventory-header">
                        <div class="saved-inventory-info">
                            <h4>Inventúra z ${date} ${time}</h4>
                            <div class="saved-inventory-stats">
                                <span class="stat-item">
                                    <i class="fas fa-box"></i> ${inventory.totalProducts} produktov
                                </span>
                                <span class="stat-item match">
                                    <i class="fas fa-check"></i> ${inventory.matches} zhodné
                                </span>
                                <span class="stat-item difference">
                                    <i class="fas fa-exclamation-triangle"></i> ${inventory.differences} rozdiely
                                </span>
                                <span class="stat-item pending">
                                    <i class="fas fa-clock"></i> ${inventory.pending} nezačítané
                                </span>
                            </div>
                        </div>
                        <div class="saved-inventory-actions">
                            <button class="btn btn-sm btn-info" onclick="app.viewSavedInventory('${inventory.id}')" title="Zobraziť">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="app.exportSavedInventory('${inventory.id}')" title="Exportovať">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteSavedInventory('${inventory.id}')" title="Vymazať">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        inventoryList.innerHTML = html;
    }

    viewSavedInventory(inventoryId) {
        const savedInventories = this.loadSavedInventories();
        const inventory = savedInventories.find(inv => inv.id === inventoryId);
        
        if (!inventory) {
            this.showNotification(this.getTranslation('inventoryNotFound'), 'error');
            return;
        }

        // Load inventory data for viewing
        this.inventoryData = inventory.items;
        this.inventoryActive = true;
        this.renderInventory();
        this.updateInventoryControls();
        
        this.showNotification(this.getTranslation('inventoryLoaded'), 'success');
    }

    exportSavedInventory(inventoryId) {
        const savedInventories = this.loadSavedInventories();
        const inventory = savedInventories.find(inv => inv.id === inventoryId);
        
        if (!inventory) {
            this.showNotification(this.getTranslation('inventoryNotFound'), 'error');
            return;
        }

        // Temporarily set inventory data and export
        const originalData = this.inventoryData;
        this.inventoryData = inventory.items;
        this.exportInventory();
        this.inventoryData = originalData;
    }

    deleteSavedInventory(inventoryId) {
        if (!confirm(this.getTranslation('confirmDeleteInventory'))) return;

        let savedInventories = this.loadSavedInventories();
        savedInventories = savedInventories.filter(inv => inv.id !== inventoryId);
        localStorage.setItem('savedInventories', JSON.stringify(savedInventories));
        
        this.showSavedInventories();
        this.showNotification(this.getTranslation('inventoryDeleted'), 'success');
    }

    clearSavedInventories() {
        if (!confirm(this.getTranslation('confirmClearInventories'))) return;

        localStorage.removeItem('savedInventories');
        this.showSavedInventories();
        this.showNotification(this.getTranslation('allInventoriesDeleted'), 'success');
    }

    finishInventory() {
        if (!this.inventoryData || this.inventoryData.length === 0) {
            this.showNotification(this.getTranslation('noInventoryData'), 'warning');
            return;
        }

        const differences = this.inventoryData.filter(item => item.status === 'difference');
        
        if (differences.length > 0) {
            const confirmMessage = this.getTranslation('confirmFinishInventory').replace('{count}', differences.length);
            if (!confirm(confirmMessage)) {
                return;
            }
        }

        // Apply inventory differences to database
        differences.forEach(async (item) => {
            try {
                const difference = item.countedQuantity - item.currentQuantity;
                const type = difference > 0 ? 'in' : 'out';
                const quantity = Math.abs(difference);
                
                await window.electronAPI.updateStock(item.id, quantity, type, {
                    reference: 'Inventúra',
                    notes: `Korekcia inventúry: ${item.currentQuantity} → ${item.countedQuantity}`
                });
            } catch (error) {
                console.error('Error updating stock for inventory:', error);
            }
        });

        // Reset inventory
        this.inventoryData = [];
        this.inventoryActive = false;
        this.renderInventory();
        this.updateInventoryControls();
        
        // Reload products to reflect changes
        this.loadInitialData();
        
        this.showNotification(this.getTranslation('inventoryFinished'), 'success');
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM ready, creating app instance...');
        window.app = new InventoryApp();
    });
} else {
    console.log('DOM already ready, creating app instance...');
    window.app = new InventoryApp();
}




