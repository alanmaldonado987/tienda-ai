/**
 * Auth Service - Lógica de negocio para autenticación
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

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
}

module.exports = new AuthService();