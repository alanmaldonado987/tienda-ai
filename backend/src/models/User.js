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
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2 // Por defecto 'user' (id: 2)
  },
  resetPasswordToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSync: (options) => {
      // No crear foreign keys automáticamente
    }
  }
});

// Relación con Role
User.belongsTo(require('./Role'), { foreignKey: 'roleId', as: 'role' });
require('./Role').hasMany(User, { foreignKey: 'roleId', as: 'users' });

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
  // Por defecto asignar rol 'user' (id: 2) si no se especifica
  if (!userData.roleId) {
    const Role = require('./Role');
    const defaultRole = await Role.findByName('user');
    if (defaultRole) {
      userData.roleId = defaultRole.id;
    }
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