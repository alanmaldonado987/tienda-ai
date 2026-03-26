const authService = require('../services/authService');
const userService = require('../services/userService');

/**
 * Registrar nuevo usuario
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos requeridos'
      });
    }

    const result = await authService.register({ name, email, phone, password });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error al registrar usuario'
    });
  }
};

/**
 * Iniciar sesión
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione email y contraseña'
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: result
    });
  } catch (error) {
    const status = error.message === 'Credenciales inválidas' ? 401 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error al iniciar sesión'
    });
  }
};

/**
 * Obtener usuario actual
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await userService.getById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    const status = error.message === 'Usuario no encontrado' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error al obtener usuario'
    });
  }
};
