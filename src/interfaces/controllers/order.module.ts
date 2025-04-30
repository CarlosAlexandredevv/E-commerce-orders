import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrderController],
  providers: [CreateOrderUseCase],
})
export class OrderModule {}
