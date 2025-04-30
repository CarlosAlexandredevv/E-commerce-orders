import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @Column()
  customer: string;

  @Column({ default: 'Pendente' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;
}
