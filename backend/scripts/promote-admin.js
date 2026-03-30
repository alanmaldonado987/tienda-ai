/**
 * Script para promover usuario a admin
 * Usage: node scripts/promote-admin.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

async function promoteToAdmin() {
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

    const email = 'alanma407@gmail.com';

    // Verificar usuario existe
    const [[user]] = await sequelize.query(
      `SELECT id, email, role_id FROM users WHERE email = '${email}'`
    );
    
    if (!user) {
      console.log(`❌ Usuario con email ${email} no encontrado`);
      process.exit(1);
    }

    console.log(`📧 Usuario actual: ${user.email}, roleId actual: ${user.role_id}`);

    // Actualizar rol a admin (roleId = 1)
    await sequelize.query(
      `UPDATE users SET role_id = 1 WHERE email = '${email}'`
    );
    
    console.log(`✅ Usuario ${email} ahora es ADMIN (roleId: 1)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

promoteToAdmin();
