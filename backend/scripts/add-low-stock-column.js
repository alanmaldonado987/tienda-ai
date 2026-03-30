/**
 * Script para agregar columna low_stock_threshold
 * Usage: node scripts/add-low-stock-column.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

async function addColumn() {
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
    console.log('✅ Conectado a la base de datos');

    await sequelize.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5
    `);
    
    console.log('✅ Columna low_stock_threshold agregada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

addColumn();
