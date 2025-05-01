import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'Pendente' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @ManyToOne(() => CustomerEntity, { cascade: true, eager: true })
  @JoinColumn()
  customer: CustomerEntity;

  @OneToMany(() => ProductEntity, (product) => product.order, {
    cascade: true,
    eager: true,
  })
  products: ProductEntity[];
}
