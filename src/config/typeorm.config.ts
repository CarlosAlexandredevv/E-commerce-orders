import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OrderEntity } from '../infrastructure/db/order.entity';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';
import { AddressEntity } from 'src/infrastructure/db/address.entity';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [OrderEntity, CustomerEntity, ProductEntity, AddressEntity],
  synchronize: isDev || isTest || isProd,
  logging: isDev || isTest || isProd,
};
