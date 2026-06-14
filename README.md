<div align="center">

# 🚀 CRM LASTERE

### Sistema de Gestión de Relaciones con Clientes y Pedidos

[![NestJS](https://img.shields.io/badge/NestJS-v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-v0.3-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/Licencia-Privada-orange?style=for-the-badge)](#)

<br/>

<p align="center">
  <strong>CRM empresarial moderno construido con arquitectura modular, diseñado para el mercado colombiano 🇨🇴</strong>
</p>

<p align="center">
  Gestión integral de clientes · Seguimiento de pedidos en tiempo real · Auditoría de seguridad · API RESTful escalable
</p>

---

**[📖 Documentación](#-documentación)** · **[⚡ Inicio Rápido](#-inicio-rápido)** · **[🏗️ Arquitectura](#️-arquitectura)** · **[📦 Módulos](#-módulos)** · **[🗄️ Base de Datos](#️-modelo-de-base-de-datos)** · **[🛣️ Roadmap](#️-roadmap)**

</div>

---

## 📋 Descripción del Proyecto

**CRM Lastere** es un sistema backend robusto de gestión de relaciones con clientes (CRM) y administración de pedidos, desarrollado específicamente para empresas colombianas que operan en el sector de comercio electrónico, ventas directas y distribución.

El sistema permite a las empresas centralizar toda la información de sus clientes, realizar un seguimiento detallado del ciclo de vida de cada pedido (desde su creación hasta la entrega), y mantener un registro completo de auditoría que garantiza la trazabilidad y seguridad de todas las operaciones.

### 🎯 Problema que Resuelve

| Problema | Solución CRM Lastere |
| :--- | :--- |
| Información de clientes dispersa en hojas de cálculo | Base de datos centralizada y relacional con PostgreSQL |
| Sin trazabilidad en los pedidos | Sistema de estados con historial completo de cada movimiento |
| Vulnerabilidad ante modificaciones fraudulentas | Módulo de auditoría que registra cada acción con IP, usuario y timestamp |
| Dificultad para escalar el negocio | Arquitectura modular preparada para microservicios |
| Manejo incorrecto de montos en pesos colombianos | Tipo `decimal` con precisión financiera (11 dígitos, 2 decimales) |

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 👥 Gestión de Clientes
- Registro y administración completa de clientes
- Historial de pedidos por cliente
- Datos de contacto y direcciones de envío
- Segmentación y categorización

</td>
<td width="50%">

### 📦 Gestión de Pedidos
- Creación y seguimiento de pedidos
- Estados configurables mediante Enums
- Cálculo de totales con precisión financiera
- Descripción y notas por pedido

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Seguridad y Auditoría
- Registro automático de cada operación
- Captura de IP y User-Agent
- Historial de cambios con estado anterior/nuevo
- Detección de modificaciones sospechosas

</td>
<td width="50%">

### 🛠️ Arquitectura Profesional
- Principios SOLID aplicados
- TypeScript estricto (sin `any`)
- Arquitectura modular y escalable
- Documentación detallada en cada línea

</td>
</tr>
</table>

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura modular por capas**, donde cada módulo encapsula su propia lógica de negocio, entidades, DTOs y controladores. Esta estructura permite escalar el sistema de forma independiente y facilita la transición futura a microservicios.

```mermaid
graph TB
    subgraph Cliente["🌐 Cliente (Frontend / App Móvil)"]
        HTTP["Peticiones HTTP REST"]
    end

    subgraph API["🔷 API Gateway - NestJS"]
        direction TB
        MW["⚙️ Middleware Global"]
        GD["🛡️ Guards (Autenticación)"]
        INT["📡 Interceptors (Auditoría)"]
        PP["🔌 Pipes (Validación)"]
    end

    subgraph Modules["📦 Módulos de Negocio"]
        direction LR
        
        subgraph ModClientes["👥 Módulo Clientes"]
            CC["Controller"]
            CS["Service"]
            CE["Entity"]
        end
        
        subgraph ModPedidos["📦 Módulo Pedidos"]
            PC["Controller"]
            PS["Service"]
            PE["Entity"]
        end

        subgraph ModAuditoria["🔐 Módulo Auditoría"]
            AS["Service"]
            AE["Entity"]
            SUB["Subscribers"]
        end
    end

    subgraph Data["🗄️ Capa de Datos"]
        ORM["TypeORM"]
        DB[("PostgreSQL 🐘")]
    end

    HTTP --> MW
    MW --> GD
    GD --> INT
    INT --> PP
    PP --> CC
    PP --> PC
    CC --> CS
    PC --> PS
    CS --> ORM
    PS --> ORM
    AS --> ORM
    SUB --> AS
    ORM --> DB
    PS -.->|"Emite Eventos"| AS

    style Cliente fill:#1a1a2e,stroke:#16213e,color:#e0e0e0
    style API fill:#0f3460,stroke:#533483,color:#e0e0e0
    style Modules fill:#1a1a2e,stroke:#e94560,color:#e0e0e0
    style Data fill:#16213e,stroke:#0f3460,color:#e0e0e0
```

### Flujo de una Petición HTTP

```mermaid
sequenceDiagram
    actor U as 👤 Usuario
    participant C as 🔷 Controller
    participant P as 🔌 Pipe (Validación)
    participant S as ⚙️ Service
    participant R as 🗄️ Repository
    participant DB as 🐘 PostgreSQL
    participant A as 🔐 Auditoría

    U->>C: POST /pedidos (JSON Body)
    C->>P: Validar DTO
    
    alt ❌ Datos Inválidos
        P-->>U: 400 Bad Request + errores detallados
    end
    
    P->>S: DTO validado
    S->>R: Crear entidad Pedido
    R->>DB: INSERT INTO pedidos
    DB-->>R: Pedido creado (UUID generado)
    R-->>S: Entidad Pedido
    S->>A: Emitir evento "PEDIDO_CREADO"
    A->>DB: INSERT INTO audit_log
    S-->>C: Pedido creado
    C-->>U: 201 Created + Pedido JSON
```

---

## 📦 Módulos

### Estructura del Proyecto

```
crm-lastere/
│
├── 📄 .cursorrules                    # Reglas de IA y estándares del proyecto
├── 📄 .env.example                    # Variables de entorno de ejemplo
├── 📄 .gitignore                      # Archivos excluidos de Git
├── 🐳 docker-compose.yml             # Configuración de contenedores Docker
├── 📄 nest-cli.json                   # Configuración del CLI de NestJS
├── 📄 package.json                    # Dependencias y scripts del proyecto
├── 📄 tsconfig.json                   # Configuración de TypeScript
│
└── 📁 src/
    ├── 📄 main.ts                     # Punto de entrada de la aplicación
    ├── 📄 app.module.ts               # Módulo raíz que orquesta todo el sistema
    │
    ├── 📁 common/                     # Recursos compartidos globalmente
    │   └── 📁 auditoria/             # 🔐 Módulo de Auditoría (Fase 2)
    │
    ├── 📁 config/                     # Configuración y validación de entorno
    │   └── 📄 env.validation.ts       # Validación de variables de entorno
    │
    └── 📁 modules/                    # Módulos de negocio
        │
        ├── 📁 clientes/              # 👥 Módulo de Clientes
        │   ├── 📄 clientes.controller.ts
        │   ├── 📄 clientes.module.ts
        │   ├── 📄 clientes.service.ts
        │   └── 📁 entities/
        │       └── 📄 cliente.entity.ts
        │
        └── 📁 pedidos/               # 📦 Módulo de Pedidos
            ├── 📄 pedidos.controller.ts
            ├── 📄 pedidos.module.ts
            ├── 📄 pedidos.service.ts
            ├── 📁 entities/
            │   └── 📄 pedido.entity.ts
            └── 📁 enums/
                └── 📄 estado-pedido.enum.ts
```

---

### 📦 Módulo de Pedidos

El módulo de pedidos es el corazón del sistema. Gestiona el ciclo de vida completo de cada pedido.

#### Estados del Pedido

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Pedido Creado
    PENDIENTE --> GUIA_GENERADA: Se genera guía de envío
    GUIA_GENERADA --> ENVIADO: Transportista recoge el paquete
    ENVIADO --> OFICINA: Llega a oficina de destino
    OFICINA --> [*]: Entregado al cliente ✅

    PENDIENTE --> CANCELADO: Cliente o admin cancela
    GUIA_GENERADA --> CANCELADO: Cancelación antes de envío
    
    CANCELADO --> [*]: Pedido finalizado ❌

    note right of PENDIENTE
        Estado inicial por defecto
        al crear un pedido
    end note

    note right of CANCELADO
        Se registra el motivo
        en el historial de auditoría
    end note
```

#### Entidad Pedido - Campos

| Campo | Tipo (PostgreSQL) | Tipo (TypeScript) | Descripción |
| :--- | :---: | :---: | :--- |
| `id` | `UUID` | `string` | Identificador único generado automáticamente |
| `estado` | `ENUM` | `EstadoPedido` | Estado actual del pedido (valores predefinidos) |
| `total` | `DECIMAL(11,2)` | `number` | Monto total en COP con precisión financiera |
| `descripcion` | `TEXT` | `string \| null` | Notas u observaciones opcionales del pedido |
| `fecha_creacion` | `TIMESTAMP` | `Date` | Fecha y hora de creación (automática) |
| `fecha_actualizacion` | `TIMESTAMP` | `Date` | Última fecha de modificación (automática) |

> 💡 **Nota sobre la moneda:** Los montos se manejan en **Pesos Colombianos (COP)** con precisión `DECIMAL(11,2)`, soportando valores de hasta **$999,999,999.99 COP**.

---

## 🗄️ Modelo de Base de Datos

```mermaid
erDiagram
    CLIENTES {
        uuid id PK "Clave primaria UUID"
        varchar nombre "Nombre completo"
        varchar email "Correo electrónico"
        varchar telefono "Teléfono de contacto"
        varchar direccion "Dirección de envío"
        varchar ciudad "Ciudad"
        varchar departamento "Departamento"
        timestamp fecha_creacion "Fecha de registro"
        timestamp fecha_actualizacion "Última actualización"
    }

    PEDIDOS {
        uuid id PK "Clave primaria UUID"
        enum estado "PENDIENTE | GUIA_GENERADA | ENVIADO | OFICINA | CANCELADO"
        decimal total "Monto total en COP"
        text descripcion "Notas opcionales"
        timestamp fecha_creacion "Fecha del pedido"
        timestamp fecha_actualizacion "Última modificación"
        uuid cliente_id FK "Relación con cliente"
    }

    PEDIDO_HISTORIAL {
        uuid id PK "Clave primaria UUID"
        uuid pedido_id FK "Pedido afectado"
        varchar usuario_id "Quién realizó la acción"
        varchar accion "Tipo de acción realizada"
        varchar estado_anterior "Estado antes del cambio"
        varchar estado_nuevo "Estado después del cambio"
        text motivo "Razón del cambio"
        varchar ip_address "IP del solicitante"
        jsonb cambios "Snapshot de datos modificados"
        timestamp fecha "Momento exacto de la acción"
    }

    CLIENTES ||--o{ PEDIDOS : "tiene muchos"
    PEDIDOS ||--o{ PEDIDO_HISTORIAL : "registra historial"
```

---

## ⚡ Inicio Rápido

### Prerrequisitos

Asegúrate de tener instaladas las siguientes herramientas:

| Herramienta | Versión Mínima | Instalación |
| :--- | :---: | :--- |
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Incluido con Node.js |
| **Docker** | v24+ | [docker.com](https://www.docker.com/) |
| **Docker Compose** | v2+ | Incluido con Docker Desktop |
| **Git** | v2.40+ | [git-scm.com](https://git-scm.com/) |

### 1. Clonar el Repositorio

```bash
git clone https://github.com/sernapereira/crm-lastere.git
cd crm-lastere
```

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/crm_lastere
```

### 3. Levantar la Base de Datos con Docker

```bash
docker compose up -d
```

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Ejecutar en Modo Desarrollo

```bash
npm run start:dev
```

La API estará disponible en: **`http://localhost:3000`**

---

## 🛠️ Stack Tecnológico

<div align="center">

| Capa | Tecnología | Propósito |
| :---: | :---: | :--- |
| 🔷 **Runtime** | Node.js v18+ | Entorno de ejecución JavaScript del lado del servidor |
| 🏗️ **Framework** | NestJS v10 | Framework empresarial para aplicaciones escalables |
| 📝 **Lenguaje** | TypeScript v5 | Tipado estricto para código seguro y mantenible |
| 🗄️ **Base de Datos** | PostgreSQL v16 | Motor relacional robusto con soporte para ENUM y JSONB |
| 🔗 **ORM** | TypeORM v0.3 | Mapeo Objeto-Relacional con decoradores y migraciones |
| 🐳 **Contenedores** | Docker Compose | Infraestructura reproducible y portable |
| ✅ **Validación** | class-validator | Validación de datos de entrada con decoradores |
| 🔄 **Transformación** | class-transformer | Transformación y serialización de objetos |

</div>

---

## 🛣️ Roadmap

El desarrollo del proyecto está organizado en fases incrementales:

```mermaid
timeline
    title Plan de Desarrollo CRM Lastere
    
    section Fase 1 - Fundamentos
        Estructura del Proyecto     : ✅ Completado
        Entidad Pedido + Enum       : ✅ Completado
        Entidad Cliente             : 🔄 En progreso
        Relaciones entre Entidades  : ⏳ Pendiente
    
    section Fase 2 - API REST
        DTOs y Validaciones     : ⏳ Pendiente
        Servicios CRUD          : ⏳ Pendiente
        Controladores REST      : ⏳ Pendiente
        Documentación Swagger   : ⏳ Pendiente
    
    section Fase 3 - Seguridad
        Módulo de Auditoría         : ⏳ Pendiente
        Interceptores Globales      : ⏳ Pendiente
        Autenticación JWT           : ⏳ Pendiente
        Guards de Autorización      : ⏳ Pendiente
    
    section Fase 4 - Escalabilidad
        Sistema de Eventos Internos : ⏳ Pendiente
        Notificaciones              : ⏳ Pendiente
        Caché con Redis             : ⏳ Pendiente
        Preparación Microservicios  : ⏳ Pendiente
```

---

## 📐 Principios de Desarrollo

Este proyecto se rige por las siguientes reglas definidas en el archivo `.cursorrules`:

| # | Regla | Descripción |
| :---: | :--- | :--- |
| 1 | **TypeScript Estricto** | Todo el código debe usar tipado fuerte, sin excepciones |
| 2 | **Prohibido `any`** | Cada variable, parámetro y retorno debe tener un tipo explícito |
| 3 | **Principios SOLID** | Responsabilidad única, abierto/cerrado, sustitución, segregación e inversión |
| 4 | **TypeORM** | Todas las operaciones de base de datos se realizan a través del ORM |
| 5 | **Documentación** | Las funciones complejas deben estar documentadas |
| 6 | **Arquitectura Modular** | Cada funcionalidad encapsulada en su propio módulo NestJS |
| 7 | **Comentarios Detallados** | Cada línea de código debe explicar su propósito y conexiones |
| 8 | **Modo Aprendizaje** | Explicaciones didácticas de conceptos teóricos y sintaxis |
| 9 | **Contexto Colombia** | Montos en COP, lógica adaptada al mercado colombiano |

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo activo. Si deseas contribuir:

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza commits atómicos con mensajes descriptivos (`git commit -m "feat: descripción"`)
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits

Este proyecto sigue la convención [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
| :--- | :--- |
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `chore:` | Tareas de mantenimiento (configuración, dependencias) |
| `docs:` | Cambios en documentación |
| `refactor:` | Refactorización sin cambio de funcionalidad |
| `test:` | Adición o modificación de pruebas |

---

<div align="center">

### Desarrollado con ❤️ para el mercado colombiano 🇨🇴

**CRM Lastere** © 2026 · Todos los derechos reservados

[![GitHub](https://img.shields.io/badge/GitHub-sernapereira-181717?style=for-the-badge&logo=github)](https://github.com/sernapereira/crm-lastere)

</div>
