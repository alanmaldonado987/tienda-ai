/**
 * Configuración centralizada del servidor
 */
module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV,
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },

  cors: {
    origin: process.env.CORS_ORIGIN
  },

  geminiApiKey: process.env.GEMINI_API_KEY,

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
