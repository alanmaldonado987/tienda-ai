const userService = require('../services/userService');
const User = require('../models/User');
const Role = require('../models/Role');
const { Op } = require('sequelize');

/**
 * Obtener perfil del usuario actual
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    const status = error.message === 'Usuario no encontrado' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar perfil del usuario
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }

    const user = await userService.updateProfile(userId, { name, email, phone });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    const status = error.message.includes('ya está en uso') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cambiar contraseña
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    await userService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    const status = error.message.includes('incorrecta') ? 401 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener todos los usuarios (admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (role) {
      where.roleId = role;
    }
    
    if (status === 'active') {
      where.isBanned = false;
    } else if (status === 'banned') {
      where.isBanned = true;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener usuario por ID (admin)
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar usuario (admin)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, roleId } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }
    
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      roleId: roleId || user.roleId
    });
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Banear/desbanear usuario (admin)
 */
exports.toggleUserBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned, reason } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes banearte a ti mismo'
      });
    }
    
    await user.update({
      isBanned: banned !== undefined ? banned : !user.isBanned,
      banReason: banned ? (reason || 'Violación de términos') : null
    });
    
    res.json({
      success: true,
      message: user.isBanned ? 'Usuario baneado' : 'Usuario desbaneado',
      data: { id: user.id, isBanned: user.isBanned, banReason: user.banReason }
    });
  } catch (error) {
    console.error('Error al banear usuario:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Eliminar usuario (admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminarte a ti mismo'
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
