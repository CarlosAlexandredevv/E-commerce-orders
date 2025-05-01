import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from 'src/application/processors/order.processor';
import {
  ORDER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  PRODUCT_REPOSITORY,
} from 'src/domain/tokens/repository.tokens';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/infrastructure/repositories/order.repository.impl';
import { CustomerRepository } from 'src/infrastructure/repositories/customer.repository.impl';
import { ProductRepository } from 'src/infrastructure/repositories/product.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, ProductEntity]),
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({ name: 'order' }),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    OrderProcessor,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
})
export class OrderModule {}
