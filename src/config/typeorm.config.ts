import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OrderEntity } from '../infrastructure/db/order.entity';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';
import { AddressEntity } from 'src/infrastructure/db/address.entity';

const isDev = process.env.NODE_ENV === 'development';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ecommerce',
  entities: [OrderEntity, CustomerEntity, ProductEntity, AddressEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: isDev,
  logging: isDev,
};
