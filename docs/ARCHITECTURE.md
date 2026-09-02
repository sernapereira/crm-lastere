<div align="center">

# 🏗️ Arquitectura — CRM Lastere

Documentación técnica detallada del diseño arquitectónico del sistema.

</div>

---

## 📡 Flujo de una Petición HTTP

El siguiente diagrama muestra el recorrido completo de una petición desde que llega al servidor hasta que se persiste en la base de datos y se registra en el módulo de auditoría.

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

## 📦 Estados del Pedido

El módulo de pedidos gestiona el ciclo de vida completo de cada pedido mediante una máquina de estados definida con `enum` en Prisma.

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

---

## 🗃️ Campos de la Entidad Pedido

| Campo | Tipo (PostgreSQL) | Tipo (TypeScript) | Descripción |
| :--- | :---: | :---: | :--- |
| `id` | `UUID` | `string` | Identificador único generado automáticamente (Prisma `@default(uuid())`) |
| `estado` | `ENUM` | `EstadoPedido` | Estado actual del pedido (Prisma `enum EstadoPedido`) |
| `total` | `DECIMAL(11,2)` | `Decimal` | Monto total en COP con precisión financiera (Prisma `@db.Decimal(11,2)`) |
| `descripcion` | `TEXT` | `string \| null` | Notas u observaciones opcionales del pedido |
| `fecha_creacion` | `TIMESTAMP` | `DateTime` | Fecha y hora de creación (Prisma `@default(now())`) |
| `fecha_actualizacion` | `TIMESTAMP` | `DateTime` | Fecha y hora de la última modificación (Prisma `@updatedAt`) |

> 💡 **Nota sobre la moneda:** Los montos se manejan en **Pesos Colombianos (COP)** con precisión `DECIMAL(11,2)`, soportando valores de hasta **$999,999,999.99 COP**.

---

## 🗃️ Campos de la Entidad Cliente

| Campo | Tipo (PostgreSQL) | Tipo (TypeScript) | Descripción |
| :--- | :---: | :---: | :--- |
| `id` | `UUID` | `string` | Clave primaria UUID |
| `nombre` | `VARCHAR` | `string` | Nombre completo del cliente |
| `email` | `VARCHAR` | `string` | Correo electrónico |
| `telefono` | `VARCHAR` | `string` | Teléfono de contacto |
| `direccion` | `VARCHAR` | `string` | Dirección de envío |
| `ciudad` | `VARCHAR` | `string` | Ciudad |
| `departamento` | `VARCHAR` | `string` | Departamento |
| `fecha_creacion` | `TIMESTAMP` | `DateTime` | Fecha de registro |
| `fecha_actualizacion` | `TIMESTAMP` | `DateTime` | Última actualización |

---

## 🔐 Campos de la Entidad Pedido Historial (Auditoría)

| Campo | Tipo (PostgreSQL) | Tipo (TypeScript) | Descripción |
| :--- | :---: | :---: | :--- |
| `id` | `UUID` | `string` | Clave primaria UUID |
| `pedido_id` | `UUID (FK)` | `string` | Pedido afectado |
| `usuario_id` | `VARCHAR` | `string` | Quién realizó la acción |
| `accion` | `VARCHAR` | `string` | Tipo de acción realizada |
| `estado_anterior` | `VARCHAR` | `string \| null` | Estado antes del cambio |
| `estado_nuevo` | `VARCHAR` | `string \| null` | Estado después del cambio |
| `motivo` | `TEXT` | `string \| null` | Razón del cambio |
| `ip_address` | `VARCHAR` | `string` | IP del solicitante |
| `cambios` | `JSONB` | `object` | Snapshot de datos modificados |
| `fecha` | `TIMESTAMP` | `DateTime` | Momento exacto de la acción |

---

<div align="center">

📖 Volver al [README principal](../README.md)

</div>
