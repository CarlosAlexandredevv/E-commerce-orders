import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  telefone: string;

  @Column()
  cpf: string;

  @Column(() => AddressEntity)
  address: AddressEntity;
}
