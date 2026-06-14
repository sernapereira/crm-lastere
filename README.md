<div align="center">

# 🚀 CRM LASTERE

### Sistema de Gestión de Relaciones con Clientes y Pedidos

[![NestJS](https://img.shields.io/badge/NestJS-v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-v0.3-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)](https://typeorm.io/)
[![SENA](https://img.shields.io/badge/SENA-ADSO-39A900?style=for-the-badge&logo=sena&logoColor=white)](https://www.sena.edu.co/)
[![Licencia](https://img.shields.io/badge/Licencia-Privada-orange?style=for-the-badge)](#)

<br/>

<p align="center">
  <strong>CRM empresarial moderno construido con arquitectura modular, diseñado para el mercado colombiano 🇨🇴</strong>
</p>

<p align="center">
  Gestión integral de clientes · Seguimiento de pedidos en tiempo real · Auditoría de seguridad · API RESTful escalable
</p>

---

**[📖 Descripción](#-descripción-del-proyecto)** · **[⚙️ Configuración](#️-requisitos-y-configuración)** · **[🏗️ Arquitectura](#️-arquitectura)** · **[📦 Módulos](#-módulos)** · **[🗄️ Base de Datos](#️-modelo-de-base-de-datos)** · **[🛣️ Roadmap](#️-roadmap)**

</div>

---

## 📋 Descripción del Proyecto

**CRM Lastere** es un sistema backend robusto de gestión de relaciones con clientes (CRM) y administración de pedidos. Este proyecto está siendo desarrollado de forma conjunta para una **empresa privada** como solución corporativa y, al mismo tiempo, como **proyecto estudiantil y formativo** para la institución **SENA (Servicio Nacional de Aprendizaje)** en el programa de formación de **Tecnología en Análisis y Desarrollo de Software**.

El sistema permite centralizar la información de los clientes, realizar un seguimiento detallado del ciclo de vida de cada pedido (desde su creación hasta la entrega final) y mantener un registro completo de auditoría que garantiza la trazabilidad y la seguridad de todas las operaciones comerciales, aplicando las mejores prácticas y estándares de la industria.

### 🎯 Problema que resuelve

| Problema | Solución CRM Lastere |
| :--- | :--- |
| Información de clientes dispersa en hojas de cálculo | Base de datos centralizada y relacional con PostgreSQL |
| Sin trazabilidad en los pedidos | Sistema de estados con historial completo de cada movimiento |
| Vulnerabilidad ante modificaciones fraudulentas | Módulo de auditoría que registra cada acción con IP, usuario y timestamp |
| Dificultad para escalar el negocio | Arquitectura modular preparada para una futura transición a microservicios |
| Manejo incorrecto de montos en pesos colombianos | Tipo `decimal` con precisión financiera (11 dígitos, 2 decimales en COP) |

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 👥 Gestión de Clientes
- Registro y administración completos de clientes
- Historial de pedidos por cliente
- Datos de contacto y direcciones de envío
- Segmentación y categorización de clientes

</td>
<td width="50%">

### 📦 Gestión de Pedidos
- Creación y seguimiento detallado de pedidos
- Estados configurables mediante Enums
- Cálculo de totales con precisión financiera
- Descripción y notas por pedido

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Seguridad y Auditoría
- Registro automático de cada operación en base de datos
- Captura de dirección IP y User-Agent
- Historial de cambios con estado anterior y nuevo
- Detección preventiva de modificaciones sospechosas

</td>
<td width="50%">

### 🛠️ Arquitectura Profesional
- Principios SOLID aplicados rigurosamente
- TypeScript estricto (sin uso de `any`)
- Arquitectura modular y escalable
- Documentación y comentarios explicativos

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

### Flujo de una petición HTTP

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

### Estructura del proyecto

```
crm-lastere/
│
├── 📄 .env.example                    # Variables de entorno de ejemplo
├── 📄 .gitignore                      # Archivos de configuración excluidos de Git
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

#### Estados del pedido

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Pedido creado
    PENDIENTE --> GUIA_GENERADA: Se genera la guía de envío
    GUIA_GENERADA --> ENVIADO: El transportista recoge el paquete
    ENVIADO --> OFICINA: Llega a la oficina de destino
    OFICINA --> [*]: Entregado al cliente ✅

    PENDIENTE --> CANCELADO: El cliente o administrador cancela
    GUIA_GENERADA --> CANCELADO: Cancelación antes del envío
    
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

#### Campos de la entidad Pedido

| Campo | Tipo (PostgreSQL) | Tipo (TypeScript) | Descripción |
| :--- | :---: | :---: | :--- |
| `id` | `UUID` | `string` | Identificador único generado automáticamente |
| `estado` | `ENUM` | `EstadoPedido` | Estado actual del pedido (valores predefinidos) |
| `total` | `DECIMAL(11,2)` | `number` | Monto total en COP con precisión financiera |
| `descripcion` | `TEXT` | `string \| null` | Notas u observaciones opcionales del pedido |
| `fecha_creacion` | `TIMESTAMP` | `Date` | Fecha y hora de creación (automática) |
| `fecha_actualizacion` | `TIMESTAMP` | `Date` | Fecha y hora de la última modificación (automática) |

> 💡 **Nota sobre la moneda:** Los montos se manejan en **Pesos Colombianos (COP)** con precisión `DECIMAL(11,2)`, soportando valores de hasta **$999,999,999.99 COP**.

---

## 🗄️ Modelo de base de datos

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

## ⚙️ Requisitos y Configuración

Para la ejecución y despliegue del proyecto en entornos de desarrollo, se requiere contar con las herramientas adecuadas y la respectiva configuración de variables de entorno.

### Prerrequisitos

Asegúrese de tener instaladas las siguientes tecnologías:

| Herramienta | Versión Mínima | Propósito |
| :--- | :---: | :--- |
| **Node.js** | v18+ | Entorno de ejecución para el backend |
| **npm** | v9+ | Gestor de paquetes de dependencias |
| **Docker** | v24+ | Gestión de contenedores locales |
| **Docker Compose** | v2+ | Orquestación de servicios locales |

### Configuración del Entorno

1. **Variables de Entorno**: Configure el archivo local `.env` a partir de la plantilla provista en `.env.example`. Asegúrese de definir las variables correspondientes a la conexión de la base de datos sin incluir credenciales expuestas en el código fuente.
2. **Servicios de Base de Datos**: Levante el contenedor de la base de datos relacional configurado en el archivo de orquestación de servicios locales.
3. **Instalación de Dependencias**: Instale los paquetes requeridos especificados en la configuración del proyecto utilizando el gestor de paquetes de Node.js.
4. **Ejecución del Servidor**: Inicie el servidor de desarrollo utilizando el script de inicio correspondiente definido en el proyecto.

---

## 🛠️ Stack tecnológico

<div align="center">

| Capa | Tecnología | Propósito |
| :---: | :---: | :--- |
| 🔷 **Runtime** | Node.js v18+ | Entorno de ejecución de JavaScript del lado del servidor |
| 🏗️ **Framework** | NestJS v10 | Framework empresarial para aplicaciones escalables |
| 📝 **Lenguaje** | TypeScript v5 | Tipado estricto para un código seguro y mantenible |
| 🗄️ **Base de Datos** | PostgreSQL v16 | Motor relacional robusto con soporte para tipos ENUM y JSONB |
| 🔗 **ORM** | TypeORM v0.3 | Mapeo objeto-relacional con decoradores y migraciones |
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
        Estructura del proyecto     : ✅ Completado
        Entidad Pedido y enums      : ✅ Completado
        Entidad Cliente             : 🔄 En progreso
        Relaciones entre entidades  : ⏳ Pendiente
    
    section Fase 2 - API REST
        DTOs y validaciones     : ⏳ Pendiente
        Servicios CRUD          : ⏳ Pendiente
        Controladores REST      : ⏳ Pendiente
        Documentación Swagger   : ⏳ Pendiente
    
    section Fase 3 - Seguridad
        Módulo de auditoría         : ⏳ Pendiente
        Interceptores globales      : ⏳ Pendiente
        Autenticación JWT           : ⏳ Pendiente
        Guards de autorización      : ⏳ Pendiente
    
    section Fase 4 - Escalabilidad
        Sistema de eventos internos : ⏳ Pendiente
        Notificaciones              : ⏳ Pendiente
        Caché con Redis             : ⏳ Pendiente
        Preparación para microservicios : ⏳ Pendiente
```

---

## 📐 Lineamientos de Desarrollo

El desarrollo del proyecto se rige bajo los siguientes estándares de calidad de software y buenas prácticas de ingeniería:

| Estándar | Descripción |
| :--- | :--- |
| **TypeScript Estricto** | Todo el código debe implementar tipado estricto para garantizar la robustez y prevenir errores en tiempo de ejecución. |
| **Prohibición de `any`** | Cada variable, parámetro y tipo de retorno debe estar explícitamente tipado. |
| **Principios SOLID** | Adherencia a los cinco principios de diseño orientado a objetos para obtener un sistema altamente mantenible y escalable. |
| **TypeORM** | Todas las interacciones con la base de datos relacional deben realizarse a través del ORM, garantizando abstracción y seguridad. |
| **Arquitectura Modular** | Organización del código en módulos autónomos y cohesivos dentro de NestJS para facilitar el desarrollo en paralelo. |
| **Contexto Colombia** | Lógica adaptada al mercado colombiano, utilizando tipos de datos precisos para el manejo de importes en Pesos Colombianos (COP). |

---

## 🤝 Sugerencias y Retroalimentación

Este es un proyecto cerrado y de propiedad privada, diseñado con fines corporativos y como proyecto de aprendizaje académico. Por este motivo, **no se aceptan contribuciones directas de código externas ni solicitudes de extracción (Pull Requests)**.

Si desea realizar comentarios, sugerir mejoras, reportar problemas o realizar consultas sobre el diseño del sistema, puede hacerlo exclusivamente a través de la sección de **comentarios, discusiones o incidencias (Issues)** habilitada en el repositorio oficial.

### Convención de commits

Para el desarrollo interno del equipo de trabajo, se sigue estrictamente la convención de [Conventional Commits](https://www.conventionalcommits.org/):

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
