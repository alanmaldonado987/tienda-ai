require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const SystemConfig = require('./models/SystemConfig');
const Role = require('./models/Role');
const Wishlist = require('./models/Wishlist');
const CartItem = require('./models/CartItem');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Middleware de logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// Health check con estado de DB
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let configData = {};
  
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
    configData = await SystemConfig.getAll();
  } catch (error) {
    dbStatus = 'error: ' + error.message;
  }
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    db: dbStatus,
    config: configData
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Autenticar conexión a DB
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync modelos (solo crea si no existen)
    await sequelize.sync({ alter: false });
    console.log('✅ Models synchronized');
    
    // Cargar roles iniciales si no existen
    await Role.seedInitial();
    
    // Cargar productos iniciales si no existen
    await Product.seedInitial();
    
    // Obtener app name para el banner
    const appName = await SystemConfig.getValue('app_name') || 'MODACOLOMBIA';
    
    // Iniciar servidor
    app.listen(config.port, () => {
      console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🏪 Servidor ${appName} API                       ║
  ║                                                   ║
  ║   Entorno: ${config.nodeEnv.padEnd(35)}║
  ║   Puerto: ${config.port.toString().padEnd(40)}║
  ║   DB: PostgreSQL                                   ║
  ║                                                   ║
  ║   Endpoints:                                      ║
  ║   • GET  /health          - Health check          ║
  ║   • POST /api/auth/register - Registro             ║
  ║   • POST /api/auth/login    - Login               ║
  ║   • GET  /api/auth/me      - Mi perfil            ║
  ║   • GET  /api/products     - Listar productos     ║
  ║   • GET  /api/products/:id - Producto por ID      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Iniciar
startServer();

module.exports = app;