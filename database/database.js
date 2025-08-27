const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'inventory.db');
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database initialization error:', err);
          reject(err);
        } else {
          this.createTables()
            .then(() => resolve(true))
            .catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        ico TEXT,
        dic TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sku TEXT UNIQUE,
        plu TEXT,
        description TEXT,
        category_id TEXT,
        supplier_id TEXT,
        price REAL DEFAULT 0,
        price_with_vat REAL DEFAULT 0,
        cost REAL DEFAULT 0,
        cost_with_vat REAL DEFAULT 0,
        vat_rate REAL DEFAULT 23,
        quantity INTEGER DEFAULT 0,
        reorder_level INTEGER DEFAULT 10,
        unit TEXT DEFAULT 'pcs',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
        reference TEXT,
        notes TEXT,
        cost_without_vat REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        supplier_id TEXT,
        movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Insert default categories
    await this.insertDefaultData();
    
    // Run migrations
    await this.runMigrations();
  }

  async insertDefaultData() {
    const defaultCategories = [
      { id: uuidv4(), name: 'Electronics', description: 'Electronic devices and components' },
      { id: uuidv4(), name: 'Clothing', description: 'Apparel and accessories' },
      { id: uuidv4(), name: 'Books', description: 'Books and publications' },
      { id: uuidv4(), name: 'Home & Garden', description: 'Home improvement and garden items' },
      { id: uuidv4(), name: 'Sports', description: 'Sports equipment and accessories' }
    ];

    for (const category of defaultCategories) {
      await this.run(
        'INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)',
        [category.id, category.name, category.description]
      );
    }
  }

  async runMigrations() {
    try {
      // Check if ico column exists in suppliers table
      const icoExists = await this.get("PRAGMA table_info(suppliers)");
      const columns = await this.all("PRAGMA table_info(suppliers)");
      const hasIco = columns.some(col => col.name === 'ico');
      const hasDic = columns.some(col => col.name === 'dic');

      if (!hasIco) {
        await this.run('ALTER TABLE suppliers ADD COLUMN ico TEXT');
      }
      if (!hasDic) {
        await this.run('ALTER TABLE suppliers ADD COLUMN dic TEXT');
      }
      
      // Check if VAT columns exist in products table
      const productColumns = await this.all("PRAGMA table_info(products)");
      const hasCostWithVat = productColumns.some(col => col.name === 'cost_with_vat');
      const hasVatRate = productColumns.some(col => col.name === 'vat_rate');

      if (!hasCostWithVat) {
        await this.run('ALTER TABLE products ADD COLUMN cost_with_vat REAL DEFAULT 0');
      }
      if (!hasVatRate) {
        await this.run('ALTER TABLE products ADD COLUMN vat_rate REAL DEFAULT 23');
      }
      
      // Check if price_with_vat column exists
      const hasPriceWithVat = productColumns.some(col => col.name === 'price_with_vat');
      if (!hasPriceWithVat) {
        await this.run('ALTER TABLE products ADD COLUMN price_with_vat REAL DEFAULT 0');
      }
      
      // Check if stock_movements new columns exist
      const stockMovementsColumns = await this.all("PRAGMA table_info(stock_movements)");
      console.log('Stock movements columns:', stockMovementsColumns.map(col => col.name));
      
      const hasCostWithoutVat = stockMovementsColumns.some(col => col.name === 'cost_without_vat');
      const hasVatAmount = stockMovementsColumns.some(col => col.name === 'vat_amount');
      const hasSupplierId = stockMovementsColumns.some(col => col.name === 'supplier_id');
      const hasMovementDate = stockMovementsColumns.some(col => col.name === 'movement_date');

      console.log('Migration status:', {
        hasCostWithoutVat,
        hasVatAmount,
        hasSupplierId,
        hasMovementDate
      });

      if (!hasCostWithoutVat) {
        console.log('Adding cost_without_vat column...');
        await this.run('ALTER TABLE stock_movements ADD COLUMN cost_without_vat REAL DEFAULT 0');
      }
      if (!hasVatAmount) {
        console.log('Adding vat_amount column...');
        await this.run('ALTER TABLE stock_movements ADD COLUMN vat_amount REAL DEFAULT 0');
      }
      if (!hasSupplierId) {
        console.log('Adding supplier_id column...');
        await this.run('ALTER TABLE stock_movements ADD COLUMN supplier_id TEXT');
      }
      if (!hasMovementDate) {
        console.log('Adding movement_date column...');
        await this.run('ALTER TABLE stock_movements ADD COLUMN movement_date DATETIME');
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Product operations
  async getProducts() {
    const sql = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.name
    `;
    return await this.all(sql);
  }

  async addProduct(product) {
    const id = uuidv4();
    const sql = `
      INSERT INTO products (id, name, sku, plu, description, category_id, supplier_id, price, price_with_vat, cost, cost_with_vat, vat_rate, quantity, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.run(sql, [
      id, product.name, product.sku, product.plu, product.description, product.category_id,
      product.supplier_id, product.price, product.price_with_vat || 0, product.cost, product.cost_with_vat || 0, product.vat_rate || 23, product.quantity, product.unit
    ]);
    return id;
  }

  async checkEanAvailability(ean, excludeId = null) {
    let query = 'SELECT COUNT(*) as count FROM products WHERE sku = ?';
    let params = [ean];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const result = await this.get(query, params);
    return result.count === 0;
  }

  async updateProduct(product) {
    const sql = `
      UPDATE products 
      SET name = ?, sku = ?, plu = ?, description = ?, category_id = ?, supplier_id = ?, 
          price = ?, price_with_vat = ?, cost = ?, cost_with_vat = ?, vat_rate = ?, quantity = ?, unit = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await this.run(sql, [
      product.name, product.sku, product.plu, product.description, product.category_id,
      product.supplier_id, product.price, product.price_with_vat || 0, product.cost, product.cost_with_vat || 0, product.vat_rate || 23, product.quantity, product.unit, product.id
    ]);
    return product.id;
  }

  async deleteProduct(id) {
    await this.run('DELETE FROM stock_movements WHERE product_id = ?', [id]);
    await this.run('DELETE FROM products WHERE id = ?', [id]);
    return id;
  }

  // Category operations
  async getCategories() {
    return await this.all('SELECT * FROM categories ORDER BY name');
  }

  async addCategory(category) {
    const id = uuidv4();
    await this.run('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', 
      [id, category.name, category.description]);
    return id;
  }

  async updateCategory(category) {
    try {
      await this.run('UPDATE categories SET name = ?, description = ? WHERE id = ?', 
        [category.name, category.description, category.id]);
      return { success: true };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }
  }

  // Supplier operations
  async getSuppliers() {
    return await this.all('SELECT * FROM suppliers ORDER BY name');
  }

  async addSupplier(supplier) {
    const id = uuidv4();
    await this.run('INSERT INTO suppliers (id, name, email, phone, address, ico, dic) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [id, supplier.name, supplier.email, supplier.phone, supplier.address, supplier.ico, supplier.dic]);
    return id;
  }

  async getSupplier(id) {
    return await this.get('SELECT * FROM suppliers WHERE id = ?', [id]);
  }

  async updateSupplier(supplier) {
    await this.run('UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ?, ico = ?, dic = ? WHERE id = ?', 
      [supplier.name, supplier.email, supplier.phone, supplier.address, supplier.ico, supplier.dic, supplier.id]);
    return supplier.id;
  }

  async deleteSupplier(id) {
    await this.run('DELETE FROM suppliers WHERE id = ?', [id]);
    return id;
  }
  
  async deleteCategory(id) {
    try {
      // First, set category_id to NULL for all products in this category
      await this.run('UPDATE products SET category_id = NULL WHERE category_id = ?', [id]);
      
      // Then delete the category
      await this.run('DELETE FROM categories WHERE id = ?', [id]);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }
  }

  // Stock operations
  async updateStock(productId, quantity, type, additionalData = {}) {
    const movementId = uuidv4();
    
    // Prepare movement data
    const movementData = {
      id: movementId,
      productId: productId,
      quantity: quantity,
      type: type,
      reference: `STK-${Date.now()}`,
      notes: additionalData.notes || `Stock ${type}`,
      costWithoutVat: additionalData.costWithoutVat || 0,
      vatAmount: additionalData.vatAmount || 0,
      supplierId: additionalData.supplierId || null,
      movementDate: additionalData.movementDate || new Date().toISOString()
    };
    
    // Add stock movement record
    await this.run(
      'INSERT INTO stock_movements (id, product_id, quantity, type, reference, notes, cost_without_vat, vat_amount, supplier_id, movement_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [movementData.id, movementData.productId, movementData.quantity, movementData.type, movementData.reference, movementData.notes, movementData.costWithoutVat, movementData.vatAmount, movementData.supplierId, movementData.movementDate]
    );

    // Update product quantity
    let sql;
    if (type === 'in') {
      sql = 'UPDATE products SET quantity = quantity + ? WHERE id = ?';
    } else if (type === 'out') {
      sql = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
    } else if (type === 'adjustment') {
      sql = 'UPDATE products SET quantity = ? WHERE id = ?';
    }

    await this.run(sql, [quantity, productId]);
    return movementId;
  }

  async getStockHistory(productId) {
    return await this.all(
      `SELECT sm.*, s.name as supplier_name 
       FROM stock_movements sm 
       LEFT JOIN suppliers s ON sm.supplier_id = s.id 
       WHERE sm.product_id = ? 
       ORDER BY sm.created_at DESC`,
      [productId]
    );
  }

  // Search operations
  async searchProducts(searchTerm) {
    const sql = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?
      ORDER BY p.name
    `;
    const term = `%${searchTerm}%`;
    return await this.all(sql, [term, term, term]);
  }

  async searchSuppliers(searchTerm) {
    const sql = `
      SELECT * FROM suppliers
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ? OR ico LIKE ? OR dic LIKE ?
      ORDER BY name
    `;
    const term = `%${searchTerm}%`;
    return await this.all(sql, [term, term, term, term, term, term]);
  }

  async getLowStockProducts() {
    const sql = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.quantity <= 10
      ORDER BY p.quantity ASC
    `;
    return await this.all(sql);
  }

  // Dashboard statistics
  async getDashboardStats() {
    const stats = {};
    
    // Total products
    const totalProducts = await this.get('SELECT COUNT(*) as count FROM products');
    stats.totalProducts = totalProducts.count;
    
    // Total value
    const totalValue = await this.get('SELECT SUM(price * quantity) as value FROM products');
    stats.totalValue = totalValue.value || 0;
    
    // Low stock count
    const lowStock = await this.get('SELECT COUNT(*) as count FROM products WHERE quantity <= 10');
    stats.lowStockCount = lowStock.count;
    
    // Out of stock count
    const outOfStock = await this.get('SELECT COUNT(*) as count FROM products WHERE quantity = 0');
    stats.outOfStockCount = outOfStock.count;
    
    // Recent movements
    const recentMovements = await this.all(`
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm 
      JOIN products p ON sm.product_id = p.id 
      ORDER BY sm.created_at DESC 
      LIMIT 10
    `);
    stats.recentMovements = recentMovements;
    
    return stats;
  }

  getDatabasePath() {
    return this.dbPath;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = Database;

