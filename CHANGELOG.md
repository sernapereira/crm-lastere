# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

## [No publicado]

### Añadido
- Reestructuración completa del `README.md` con secciones de progreso y estado actual
- Documentación técnica separada en `docs/ARCHITECTURE.md`
- Este archivo `CHANGELOG.md` para seguimiento de cambios
- Migración de dependencias de TypeORM a Prisma ORM

### Cambiado
- Badges del README actualizados para reflejar el stack real
- Sección de Quick Start con comandos copy-paste

---

## [0.0.1] — 2026-09-02

### Añadido
- Inicialización del proyecto NestJS con TypeScript
- Configuración de `docker-compose.yml` con PostgreSQL 15 y pgAdmin
- Estructura modular de carpetas (`modules/clientes`, `modules/pedidos`, `common/`)
- Archivo `.env.example` con variables de entorno de ejemplo
- Configuración base de TypeScript (`tsconfig.json`)
- Archivo `.gitignore` para exclusiones estándar de Node.js y NestJS
- Documentación inicial del README con diagramas de arquitectura
