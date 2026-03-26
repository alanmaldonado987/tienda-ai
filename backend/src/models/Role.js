/**
 * Modelo de Rol con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true
});

// Seeds iniciales
Role.seedInitial = async function() {
  const roles = ['admin', 'user'];
  
  for (const roleName of roles) {
    const exists = await Role.findOne({ where: { name: roleName } });
    if (!exists) {
      await Role.create({
        name: roleName,
        description: roleName === 'admin' ? 'Administrador del sistema' : 'Usuario regular'
      });
    }
  }
  
  console.log('✅ Roles seeded');
};

// Obtener rol por nombre
Role.findByName = async function(name) {
  return await Role.findOne({ where: { name } });
};

module.exports = Role;
