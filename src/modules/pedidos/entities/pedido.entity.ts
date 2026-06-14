import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// Importamos el enum desde su archivo dedicado en la carpeta enums/
import { EstadoPedido } from '../enums/estado-pedido.enum';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
    nullable: false,
  })
  estado: EstadoPedido;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    default: 0.00,
    nullable: false,
  })
  total: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'fecha_creacion',

  })
  fechaCreacion: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'fecha_actualizacion',
  })
  fechaActualizacion: Date;

}
