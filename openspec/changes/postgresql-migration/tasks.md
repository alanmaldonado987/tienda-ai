# Tasks: Migración a PostgreSQL

## Phase 1: Infrastructure

- [x] 1.1 Install dependencies: `npm install pg sequelize` in backend
- [x] 1.2 Create `backend/src/config/database.js` with Sequelize initialization
- [x] 1.3 Create `backend/database/schema.sql` with all 6 tables (users, products, orders, order_items, categories, system_config)
- [x] 1.4 Verify PostgreSQL connection: run `node src/config/database.js`

## Phase 2: Modelos Sequelize

- [ ] 2.1 Update `backend/src/models/User.js` - replace Map() with sequelize.define
- [ ] 2.2 Update `backend/src/models/Product.js` - replace Map() with sequelize.define
- [ ] 2.3 Create `backend/src/models/Category.js` - new Sequelize model
- [ ] 2.4 Create `backend/src/models/Order.js` - new Sequelize model
- [ ] 2.5 Create `backend/src/models/OrderItem.js` - new Sequelize model
- [ ] 2.6 Create `backend/src/models/SystemConfig.js` - new Sequelize model

## Phase 3: Integración

- [ ] 3.1 Create `backend/src/seeders/default-config.js` - upsert system_config defaults
- [ ] 3.2 Update `backend/src/app.js` - add await sequelize.authenticate() and sync
- [ ] 3.3 Create `backend/.env` file with actual DB credentials (copy from .env.example)
- [ ] 3.4 Update `backend/src/config/index.js` - add database property if needed

## Phase 4: Verificación

- [ ] 4.1 Test: start backend and verify "Database connected successfully" in logs
- [ ] 4.2 Test: GET /health returns "db: connected"
- [ ] 4.3 Test: POST /api/auth/register creates user in PostgreSQL
- [ ] 4.4 Test: POST /api/auth/login returns JWT with persisted user
- [ ] 4.5 Test: GET /api/products returns products from PostgreSQL
- [ ] 4.6 Test: restart server - data persists (not reset)
- [ ] 4.7 Test: GET /health returns system_config values (app_name: MODACOLOMBIA)