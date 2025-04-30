import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CreateOrderDto } from 'src/interfaces/controllers/dto/create-order.dto';

export class CreateOrderUseCase {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async execute(data: CreateOrderDto): Promise<OrderEntity> {
    const order = this.orderRepo.create({
      ...data,
      status: 'Pendente',
    });
    return this.orderRepo.save(order);
  }
}
