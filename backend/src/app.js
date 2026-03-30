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
const userRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const orderRoutes = require('./routes/orderRoutes');
const configRoutes = require('./routes/configRoutes');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const SystemConfig = require('./models/SystemConfig');
const Role = require('./models/Role');
const Wishlist = require('./models/Wishlist');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

app.get('/api/direct-test', (req, res) => {
  res.json({ message: 'Direct test works!' });
});

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS "reset_password_token" TEXT,
        ADD COLUMN IF NOT EXISTS "reset_password_expires" TIMESTAMP;
      `);

      await sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN "reset_password_token" TYPE TEXT;
      `);

      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT,
        ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP;
      `);

      await sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN "resetPasswordToken" TYPE TEXT;
      `);
    } catch (err) {
      console.error('❌ Error configurando campos de reset password:', err.message);
    }
    
    await sequelize.sync({ alter: false });
    await Role.seedInitial();
    await Product.seedInitial();
    
    const appName = await SystemConfig.getValue('app_name') || 'MODACOLOMBIA';
    
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

startServer();

module.exports = app;