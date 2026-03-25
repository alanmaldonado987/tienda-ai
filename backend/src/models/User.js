/**
 * Modelo de Usuario con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// Métodos estáticos (compatibles con API anterior)
User.findByEmail = async function(email) {
  return await User.findOne({ where: { email } });
};

User.findById = async function(id) {
  return await User.findByPk(id);
};

User.createUser = async function(userData) {
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }
  return await User.create(userData);
};

User.updateUser = async function(id, userData) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return await user.update(userData);
};

User.deleteUser = async function(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  await user.destroy();
  return true;
};

module.exports = User;