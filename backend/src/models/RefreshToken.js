/**
 * Modelo de Refresh Token para "Recordar Sesión"
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true
});

// Relación con User
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });

/**
 * Limpiar tokens expirados (ejecutar periódicamente)
 */
RefreshToken.cleanExpired = async function() {
  const { Op } = require('sequelize');
  return await this.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date()
      }
    }
  });
};

/**
 * Revocar todos los tokens de un usuario (logout de todos lados)
 */
RefreshToken.revokeAllForUser = async function(userId) {
  return await this.update(
    { isRevoked: true },
    { where: { userId: userId } }
  );
};

/**
 * Verificar si un token es válido
 */
RefreshToken.isValid = async function(token) {
  const record = await this.findOne({ where: { token } });
  if (!record) return false;
  if (record.isRevoked) return false;
  if (new Date(record.expiresAt) < new Date()) return false;
  return true;
};

module.exports = RefreshToken;
