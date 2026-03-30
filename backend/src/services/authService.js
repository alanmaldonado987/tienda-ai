/**
 * Auth Service - Lógica de negocio para autenticación
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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
   * @returns {Promise<Object>}
   */
  async login(email, password) {
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

    // Generar token
    const token = this.generateToken(user);

    return this.formatUserResponse(user, token);
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
   * @returns {Object}
   */
  formatUserResponse(user, token) {
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
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