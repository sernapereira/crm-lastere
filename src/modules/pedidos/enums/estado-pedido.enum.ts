// Enumeración que define los estados válidos por los que puede pasar un pedido.
// Este enum es la única fuente de verdad para los estados del pedido en todo el sistema.
// Se usa en la entidad (base de datos), los DTOs (validación) y los servicios (lógica de negocio).
export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',           // Estado inicial al crear el pedido
  GUIA_GENERADA = 'GUIA_GENERADA',   // Se generó la guía de envío
  ENVIADO = 'ENVIADO',               // El pedido fue despachado al transportista
  OFICINA = 'OFICINA',               // El pedido llegó a la oficina de destino
  CANCELADO = 'CANCELADO',           // El pedido fue cancelado
}
