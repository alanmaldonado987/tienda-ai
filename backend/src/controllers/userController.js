const userService = require('../services/userService');

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
      message: error.message || 'Error al cambiar contraseña'
    });
  }
};
