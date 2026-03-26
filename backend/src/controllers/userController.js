const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

/**
 * Obtener perfil del usuario actual
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener rol
    const role = await Role.findByPk(user.roleId);

    // Remover contraseña de la respuesta
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      data: {
        ...userData,
        role: role ? role.name : null
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener perfil'
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

    // Validaciones
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    const existingUser = await User.findOne({
      where: { email, id: { [require('sequelize').Op.ne]: userId } }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está en uso'
      });
    }

    // Actualizar usuario
    await User.update(
      { name, email, phone },
      { where: { id: userId } }
    );

    // Obtener usuario actualizado
    const user = await User.findById(userId);
    const role = await Role.findByPk(user.roleId);
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        ...userData,
        role: role ? role.name : null
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar perfil'
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

    // Validaciones
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

    // Obtener usuario actual
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cambiar contraseña'
    });
  }
};
