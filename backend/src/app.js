require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const config = require('./config');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Demasiadas peticiones, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos de login, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false
});
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const orderRoutes = require('./routes/orderRoutes');
const configRoutes = require('./routes/configRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const SystemConfig = require('./models/SystemConfig');
const Role = require('./models/Role');
const Wishlist = require('./models/Wishlist');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Coupon = require('./models/Coupon');
const Category = require('./models/Category');
const Collection = require('./models/Collection');
const CollectionProduct = require('./models/CollectionProduct');
const RecentlyViewed = require('./models/RecentlyViewed');
const Testimonial = require('./models/Testimonial');
const CountdownOffer = require('./models/CountdownOffer');

// Set up associations
Collection.belongsToMany(Product, { 
  through: CollectionProduct, 
  foreignKey: 'collectionId', 
  as: 'products' 
});
Product.belongsToMany(Collection, { 
  through: CollectionProduct, 
  foreignKey: 'productId', 
  as: 'collections' 
});

// RecentlyViewed associations
RecentlyViewed.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(RecentlyViewed, { foreignKey: 'productId', as: 'recentlyViewed' });

// Testimonial associations
Testimonial.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Testimonial, { foreignKey: 'productId', as: 'testimonials' });

// RefreshToken se importa automáticamente cuando se usa en authService

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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/recently-viewed', require('./routes/recentlyViewedRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/countdown', require('./routes/countdownRoutes'));
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);

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
    
    // Configurar campos de reset password
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT,
        ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP;
      `);
      console.log('✅ Campos de reset password configurados');
    } catch (err) {
      console.log('ℹ️  Campos de reset password:', err.message);
    }

    // Sincronizar modelos
    await sequelize.sync({ alter: false });
    
    // Crear tabla refresh_tokens si no existe (SQL directo)
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token VARCHAR(500) UNIQUE NOT NULL,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at TIMESTAMP NOT NULL,
          user_agent VARCHAR(500),
          ip_address VARCHAR(45),
          is_revoked BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Tabla refresh_tokens lista');
    } catch (err) {
      console.log('ℹ️  Tabla refresh_tokens:', err.message);
    }
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