import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';
import { BullModule } from '@nestjs/bull';
import { OrderProcessor } from 'src/application/processors/order.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, ProductEntity]),
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({ name: 'order' }),
  ],
  controllers: [OrderController],
  providers: [CreateOrderUseCase, OrderProcessor],
})
export class OrderModule {}
