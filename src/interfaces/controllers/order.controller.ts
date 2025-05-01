import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('pedidos')
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async create(@Body() data: CreateOrderDto) {
    return this.createOrderUseCase.execute(data);
  }
}
