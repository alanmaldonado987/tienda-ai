/**
 * Auth Service - Lógica de negocio para autenticación
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const config = require('../config');
const EmailService = require('./emailService');

// Instanciar email service después de que dotenv esté cargado
const emailService = new EmailService();

class AuthService {
  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario (name, email, phone, password)
   * @returns {Promise<Object>}
   */
  async register(userData) {
    const { name, email, phone, password } = userData;

    if (!name || !email || !password) {
      throw new Error('Por favor complete todos los campos requeridos');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.createUser({
      name,
      email,
      phone,
      password: hashedPassword
    });

    // Generar token
    const token = this.generateToken(user);

    // Responder sin contraseña
    return this.formatUserResponse(user, token);
  }

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {Object} options - Opciones adicionales (recordMe, userAgent, ipAddress)
   * @returns {Promise<Object>}
   */
  async login(email, password, options = {}) {
    if (!email || !password) {
      throw new Error('Por favor proporcione email y contraseña');
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = this.generateToken(user);

    // Si recordMe está activo, generar refresh token
    let refreshToken = null;
    if (options.recordMe) {
      refreshToken = await this.generateRefreshToken(user, options);
    }

    return this.formatUserResponse(user, token, refreshToken);
  }

  /**
   * Generar refresh token
   * @param {Object} user - Datos del usuario
   * @param {Object} options - userAgent, ipAddress
   * @returns {Promise<string>} Token string
   */
  async generateRefreshToken(user, options = {}) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      token,
      userId: user.id,
      expiresAt: expiresAt,
      userAgent: options.userAgent?.substring(0, 500) || null,
      ipAddress: options.ipAddress || null
    });

    return token;
  }

  /**
   * Refrescar token JWT usando refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} Nuevo JWT y nuevo refresh token
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token requerido');
    }

    // Verificar si el token existe y es válido
    const isValid = await RefreshToken.isValid(refreshToken);
    if (!isValid) {
      throw new Error('Refresh token inválido o expirado');
    }

    // Obtener el registro del token
    const tokenRecord = await RefreshToken.findOne({ 
      where: { token: refreshToken }
    });

    // Obtener usuario
    const user = await User.findById(tokenRecord.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar nuevo JWT
    const newJwt = this.generateToken(user);

    // Rotar refresh token (opcional pero más seguro)
    // Invalidar el viejo
    await tokenRecord.update({ isRevoked: true });
    
    // Crear nuevo refresh token
    const newRefreshToken = await this.generateRefreshToken(user, {
      userAgent: tokenRecord.userAgent,
      ipAddress: tokenRecord.ipAddress
    });

    return {
      token: newJwt,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Cerrar sesión - invalidar refresh token
   * @param {string} refreshToken - Refresh token a invalidar
   * @returns {Promise<Object>}
   */
  async logout(refreshToken) {
    if (refreshToken) {
      // Invalidar el refresh token específico
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken } }
      );
    }
    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * Cerrar sesión en todos los dispositivos
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async logoutAll(userId) {
    await RefreshToken.update(
      { isRevoked: true },
      { where: { userId: userId } }
    );
    return { message: 'Sesión cerrada en todos los dispositivos' };
  }

  /**
   * Obtener usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>}
   */
  async getMe(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generar token JWT
   * @param {Object} user - Datos del usuario
   * @returns {string}
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Formatear respuesta sin contraseña
   * @param {Object} user - Datos del usuario
   * @param {string} token - Token JWT
   * @param {string} refreshToken - Refresh token (opcional)
   * @returns {Object}
   */
  formatUserResponse(user, token, refreshToken = null) {
    const { password, ...userWithoutPassword } = user;
    const response = {
      user: userWithoutPassword,
      token
    };
    if (refreshToken) {
      response.refreshToken = refreshToken;
    }
    return response;
  }

  /**
   * Solicitar reset de contraseña
   * Genera un token y envía email con link para resetear
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    console.log('🔐 [AuthService] forgotPassword() solicitado para:', email);
    if (!email) {
      throw new Error('Por favor proporcione un email');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Por favor proporcione un email válido');
    }

    // Buscar usuario (silenciosamente si no existe - por seguridad)
    const user = await User.findByEmail(email);
    console.log('🔐 [AuthService] Usuario encontrado:', Boolean(user));
    
    if (user) {
      console.log('🔐 [AuthService] Generando token de recuperación...');
      // Generar token JWT con 15 minutos de expiración
      const resetToken = jwt.sign(
        { id: user.id, email: user.email, type: 'password_reset' },
        config.jwt.secret,
        { expiresIn: '15m' }
      );

      // Calcular expiración (15 minutos desde ahora)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Guardar token en el usuario
      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresAt
      });
      console.log('🔐 [AuthService] Token guardado en DB. Expira:', expiresAt.toISOString());

      const emailResult = await emailService.sendResetPasswordEmail({
        email: user.email,
        token: resetToken,
        userName: user.name
      });
      console.log('🔐 [AuthService] Resultado envío email:', emailResult);

      if (!emailResult.success) {
        throw new Error('No se pudo enviar el correo de recuperación');
      }
    }

    // SIEMPRE retornar el mismo mensaje por seguridad
    // No revelar si el email existe o no
    const response = {
      message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña'
    };
    console.log('🔐 [AuthService] forgotPassword() finalizado');
    return response;
  }

  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de reset
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>}
   */
  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token y nueva contraseña son requeridos');
    }

    // Validar longitud de contraseña
    if (newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('El token ha expirado. Solicita uno nuevo.');
      }
      throw new Error('Token inválido');
    }

    // Verificar que es un token de reset
    if (decoded.type !== 'password_reset') {
      throw new Error('Token inválido');
    }

    // Buscar usuario con este token
    const user = await User.findOne({
      where: {
        id: decoded.id,
        resetPasswordToken: token
      }
    });

    if (!user) {
      throw new Error('Token inválido o ya fue utilizado');
    }

    // Verificar que el token no expiró
    if (user.resetPasswordExpires && new Date(user.resetPasswordExpires) < new Date()) {
      // Limpiar token expirado
      await user.update({
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      throw new Error('El token ha expirado. Solicita uno nuevo.');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return {
      message: 'Contraseña actualizada exitosamente'
    };
  }
}

module.exports = new AuthService();