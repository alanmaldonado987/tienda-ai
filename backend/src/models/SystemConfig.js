/**
 * Modelo de SystemConfig con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemConfig = sequelize.define('SystemConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'system_config',
  timestamps: true,
  underscored: true
});

// Obtener valor por key
SystemConfig.getValue = async function(key) {
  const config = await SystemConfig.findOne({ where: { key } });
  return config ? config.value : null;
};

// Obtener todos los configs como objeto
SystemConfig.getAll = async function() {
  const configs = await SystemConfig.findAll();
  const result = {};
  configs.forEach(c => {
    result[c.key] = c.value;
  });
  return result;
};

// Upsert config
SystemConfig.upsert = async function(key, value, description = null) {
  const [config, created] = await SystemConfig.upsert({
    key,
    value,
    description
  });
  return config;
};

module.exports = SystemConfig;