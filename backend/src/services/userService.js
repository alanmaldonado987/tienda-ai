/**
 * User Service - Lógica de negocio para usuarios
 */
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Obtener perfil del usuario con rol
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async getProfile(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const role = await Role.findByPk(user.roleId);
    const { password, ...userData } = user;
    
    return {
      ...userData,
      role: role ? role.name : null
    };
  }

  /**
   * Actualizar perfil de usuario
   * @param {string} id - ID del usuario
   * @param {Object} data - Datos a actualizar (name, email, phone, avatar)
   * @returns {Promise<Object>}
   */
  async updateProfile(id, data) {
    const { name, email, phone, avatar } = data;

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email) {
      const { Op } = require('sequelize');
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: id } }
      });
      
      if (existingUser) {
        throw new Error('El email ya está en uso');
      }
    }

    const user = await User.updateUser(id, { name, email, phone, avatar });
    const role = await Role.findByPk(user.roleId);
    const { password, ...userData } = user;

    return {
      ...userData,
      role: role ? role.name : null
    };
  }

  /**
   * Cambiar contraseña
   * @param {string} id - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>}
   */
  async changePassword(id, currentPassword, newPassword) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateUser(id, { password: hashedPassword });

    return { success: true, message: 'Contraseña actualizada correctamente' };
  }

  /**
   * Obtener usuario por ID (sin rol)
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();
