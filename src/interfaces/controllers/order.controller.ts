import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';

@Controller('pedidos')
export class OrderController {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  @Post()
  async create(@Body() data: CreateOrderDto) {
    const order = this.orderRepo.create({ ...data, status: 'Pendente' });
    return this.orderRepo.save(order);
  }
}
