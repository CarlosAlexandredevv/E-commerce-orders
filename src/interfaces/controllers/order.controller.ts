import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersUseCase } from 'src/application/use-cases/list-orders.usecase';
import { OrderFiltersDto } from './dto/order-filters.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  @Post()
  async create(@Body() data: CreateOrderDto) {
    return this.createOrderUseCase.execute(data);
  }

  @Get()
  async listOrders(@Query() filters: OrderFiltersDto) {
    return this.listOrdersUseCase.execute(filters);
  }
}
