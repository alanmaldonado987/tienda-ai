-- ==========================================
-- Schema: MODACOLOMBIA E-commerce
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Table: users
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- Table: categories
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ==========================================
-- Table: products
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER,
    image TEXT NOT NULL,
    category VARCHAR(100),
    gender VARCHAR(50),
    tag VARCHAR(50),
    description TEXT,
    stock INTEGER DEFAULT 0,
    colors JSONB DEFAULT '[]',
    sizes JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gender ON products(gender);

-- ==========================================
-- Table: orders
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total INTEGER NOT NULL,
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ==========================================
-- Table: order_items
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ==========================================
-- Table: system_config
-- ==========================================
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_config_key ON system_config(key);

-- ==========================================
-- Initial data: system_config
-- ==========================================
INSERT INTO system_config (key, value, description) VALUES
    ('app_name', 'MODACOLOMBIA', 'Nombre de la aplicación'),
    ('version', '1.0.0', 'Versión actual del sistema'),
    ('release_date', '2026-01-01', 'Fecha de lanzamiento'),
    ('description', 'Tienda de moda colombiana', 'Descripción de la tienda'),
    ('currency', 'COP', 'Moneda predeterminada')
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- Initial data: categories
-- ==========================================
INSERT INTO categories (name, slug, description) VALUES
    ('Hombre', 'hombre', 'Ropa para hombre'),
    ('Mujer', 'mujer', 'Ropa para mujer'),
    ('Unisex', 'unisex', 'Ropa unisex'),
    ('Jeans', 'jeans', 'Pantalones jeans'),
    ('Camisas', 'camisas', 'Camisas de todas las variedades'),
    ('Sudaderas', 'sudadera', 'Sudaderas y hoodies'),
    ('Vestidos', 'vestidos', 'Vestidos y conjuntos'),
    ('Zapatos', 'zapatos', 'Calzado y tennis')
ON CONFLICT (slug) DO NOTHING;