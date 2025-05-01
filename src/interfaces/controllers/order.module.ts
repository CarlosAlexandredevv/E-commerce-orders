import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CustomerEntity, ProductEntity]),
  ],
  controllers: [OrderController],
  providers: [CreateOrderUseCase],
})
export class OrderModule {}
