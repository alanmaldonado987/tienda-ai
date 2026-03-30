const authService = require('../services/authService');
const userService = require('../services/userService');

/**
 * Registrar nuevo usuario
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

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
    const { email, password, recordMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione email y contraseña'
      });
    }

    const result = await authService.login(email, password, {
      recordMe: recordMe === true,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    // Si hay refresh token,设置 cookie httpOnly
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,        // No accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'lax',       // Protección CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
      });
      // No enviar refresh token en el body, solo en cookie
      delete result.refreshToken;
    }

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
 * Refrescar token JWT
 */
exports.refresh = async (req, res, next) => {
  try {
    // Intentar de cookie o body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    // Setear nueva cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        token: result.token
      }
    });
  } catch (error) {
    // Limpiar cookie si es inválida
    res.clearCookie('refreshToken');
    res.status(401).json({
      success: false,
      message: error.message || 'Error al refrescar token'
    });
  }
};

/**
 * Cerrar sesión
 */
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    await authService.logout(refreshToken);

    // Limpiar cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    res.json({
      success: true,
      message: 'Sesión cerrada'
    });
  }
};

/**
 * Cerrar sesión en todos los dispositivos
 */
exports.logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user.id);

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Sesión cerrada en todos los dispositivos'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cerrar sesión'
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

/**
 * Solicitar reset de contraseña
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error al solicitar reset de contraseña'
    });
  }
};

/**
 * Restablecer contraseña con token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const status = error.message.includes('expirado') ? 400 : 400;
    res.status(status).json({
      success: false,
      message: error.message || 'Error al restablecer contraseña'
    });
  }
};
