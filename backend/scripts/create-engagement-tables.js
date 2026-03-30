const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tutienda',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function createTables() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a DB establecida');

    // RecentlyViewed table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS recently_viewed (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        session_id VARCHAR(255),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla recently_viewed creada');

    // Testimonials table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        product_id UUID REFERENCES products(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT NOT NULL,
        avatar VARCHAR(500),
        is_approved BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla testimonials creada');

    // CountdownOffers table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS countdown_offers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount_percent INTEGER NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100),
        discount_code VARCHAR(50),
        image VARCHAR(500),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        product_ids JSONB DEFAULT '[]',
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla countdown_offers creada');

    // Add new columns to products table
    try {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS discount_price INTEGER,
        ADD COLUMN IF NOT EXISTS discount_end_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS show_discount BOOLEAN DEFAULT FALSE;
      `);
      console.log('✅ Columnas agregadas a products');
    } catch (err) {
      console.log('ℹ️ Columnas ya existen en products:', err.message);
    }

    console.log('\n🎉 Todas las tablas creadas exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTables();
