/**
 * Script de migración - Agrega todas las columnas faltantes
 * Usage: node scripts/migrate-all.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

async function migrate() {
  const config = require('../src/config/index');
  
  const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: false
    }
  );

  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    const migrations = [
      // USERS
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP`,

      // PRODUCTS
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price INTEGER`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS gender VARCHAR(50)`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS tag VARCHAR(50)`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,
      `ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0`,

      // ORDERS
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(20) UNIQUE`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_name VARCHAR(255)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(255)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone VARCHAR(50)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_department VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_zip_code VARCHAR(20)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_notes TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_payment_id VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_status VARCHAR(50)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_status_detail VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mp_payment_method VARCHAR(50)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT`,

      // ORDER_ITEMS
      `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`,
      `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image TEXT`,
      `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2)`,
      `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_color VARCHAR(50)`,
      `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS selected_size VARCHAR(50)`,

      // COUPONS
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS description VARCHAR(255)`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type VARCHAR(20) DEFAULT 'percentage'`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value INTEGER NOT NULL`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS min_purchase INTEGER DEFAULT 0`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses INTEGER`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS used_count INTEGER DEFAULT 0`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS per_user_limit INTEGER DEFAULT 1`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP`,
      `ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`,

      // CATEGORIES
      `ALTER TABLE categories ADD COLUMN IF NOT EXISTS name VARCHAR(100) NOT NULL UNIQUE`,
      `ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(100) NOT NULL UNIQUE`,
      `ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT`
    ];

    for (const sql of migrations) {
      try {
        await sequelize.query(sql);
        console.log('✅', sql.split(' ').slice(4).join(' ').substring(0, 60));
      } catch (err) {
        // Ignorar errores de columna ya existente o duplicado
        if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
          console.log('⚠️ ', err.message.substring(0, 60));
        }
      }
    }

    console.log('\n✅ Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

migrate();
