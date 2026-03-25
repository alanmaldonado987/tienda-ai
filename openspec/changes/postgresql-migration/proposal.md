# Proposal: Migración a PostgreSQL

## Intent

El backend actual usa almacenamiento en memoria (`Map()`) que se reinicia cada vez que el servidor se reinicia. Esto es inadecuado para una aplicación en producción. El objetivo es migrar a PostgreSQL para persistencia de datos real.

## Scope

### In Scope
- Instalar driver PostgreSQL (pg + sequelize)
- Crear script SQL con las 6 tablas: users, products, orders, order_items, categories, system_config
- Actualizar modelos User.js y Product.js para usar Sequelize
- Crear modelos Order y OrderItem
- Mantener la API REST existente sin cambios
- Agregar datos iniciales en system_config

### Out of Scope
- Migración de datos existentes (no hay datos críticos)
- Implementar más endpoints de orders (futuro)
- Configuración de repliación o clustering

## Approach

Usar **Sequelize** como ORM para:
- Abstracción de queries (portable entre DBs)
- Migraciones automáticas
- Validación de modelos integrada
- Relationships definidos en código

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/package.json` | Modified | Agregar pg, sequelize, dotenv |
| `backend/src/models/Product.js` | Modified | Reemplazar Map() con Sequelize |
| `backend/src/models/User.js` | Modified | Reemplazar Map() con Sequelize |
| `backend/src/config/index.js` | Modified | Agregar config de DB |
| `backend/.env` | New | Variables de conexión PostgreSQL |
| `backend/database/schema.sql` | New | Script de creación de tablas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PostgreSQL no instalado | Medium | Verificar disponibilidad local |
| Breaking changes en API | Low | Mantener mismo contrato de respuestas |
| Queries lentas | Low | Agregar índices en IDs |

## Rollback Plan

1. Apagar servidor
2. Eliminar dependencias pg/sequelize
3. Restaurar modelos a versión anterior con Map()
4. Reiniciar servidor
5. Restaurar .env anterior

## Dependencies

- PostgreSQL 14+ instalado y corriendo localmente
- Acceso a crear base de datos

## Success Criteria

- [ ] Servidor conecta a PostgreSQL sin errores
- [ ] CRUD de productos funciona igual que antes
- [ ] Registro/login de usuarios persiste correctamente
- [ ] Datos sobreviven reinicio del servidor
- [ ] /health endpoint muestra estado de DB