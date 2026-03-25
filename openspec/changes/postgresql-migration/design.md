# Design: Migración a PostgreSQL

## Technical Approach

Usar **Sequelize** como ORM para reemplazar el almacenamiento en memoria (Map). Sequelize permite definir modelos con validaciones, relaciones, y migraciones automáticas. La conexión se inicializa en app.js antes de definir las rutas.

## Architecture Decisions

### Decision: ORM vs Raw SQL

**Choice**: Sequelize
**Alternatives considered**: pg (raw SQL), Prisma
**Rationale**: Sequelize ofrece migraciones automáticas, validaciones integradas, y los modelos existentes tienen métodos estáticos que pueden reimplementarse fácilmente. Prisma requiere más setup y no es compatible con Express 5.x aún.

### Decision: Database Initialization

**Choice**: sync({ force: false, alter: true }) en startup
**Alternatives considered**: migrations folder manually managed
**Rationale**: Para simplificar el primer setup, Sequelize sync con alter(true) ajusta las tablas automáticamente. Esto permite empezar rápido y migrar a migrations después si es necesario.

### Decision: Default Config Initialization

**Choice**: Upsert system_config on startup if empty
**Alternatives considered**: Insert manually via SQL script
**Rationale**: La aplicación debe poder arrancarse sin intervención manual. El script de inicialización verifica si hay registros y crea los defaults automáticamente.

## Data Flow

```
app.js
  └── sequelize.initialize()
        │
        ├── Users table (via User.js model)
        ├── Products table (via Product.js model)
        ├── Orders table (via Order.js model) [future]
        ├── Categories table (via Category.js model) [future]
        └── system_config table (via SystemConfig.js model)
              │
              └── Seeder: upsert default values if empty
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/config/database.js` | Create | Sequelize initialization and connection |
| `backend/src/models/User.js` | Modify | Reemplazar Map() con sequelize.define + methods |
| `backend/src/models/Product.js` | Modify | Reemplazar Map() con sequelize.define + methods |
| `backend/src/models/Order.js` | Create | Nuevo modelo para Orders |
| `backend/src/models/Category.js` | Create | Nuevo modelo para Categories |
| `backend/src/models/SystemConfig.js` | Create | Nuevo modelo para system_config |
| `backend/src/seeders/default-config.js` | Create |Seeder de config inicial |
| `backend/database/schema.sql` | Create | Script SQL de referencia |
| `backend/src/app.js` | Modify | Agregar await sequelize.authenticate() |

## Interfaces / Contracts

```javascript
// Nuevo modelo con Sequelize
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: true });

// Métodos existentes se mantienen
User.findByEmail = async (email) => User.findOne({ where: { email } });
User.create = async (data) => User.create(data);
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Model methods | Jest - test findByEmail, create, update |
| Integration | API endpoints | SuperTest - test /api/auth/register, /api/products |
| E2E | Full flow | Manual - registro → login → agregar producto → checkout |

## Migration / Rollout

1. Install dependencies: `npm install pg sequelize`
2. Create .env with DB credentials
3. Run `node src/config/database.js` - verifies connection
4. Start server - Sequelize sync creates tables
5. First request triggers config seeder if empty

No data migration required - no production data exists yet.

## Open Questions

- [ ] None - todas las decisiones están tomadas en specs