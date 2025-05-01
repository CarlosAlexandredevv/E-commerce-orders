import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { ORDER_REPOSITORY } from '../../domain/tokens/repository.tokens';
import { OrderFiltersDto } from '../../interfaces/controllers/dto/order-filters.dto';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(filters: OrderFiltersDto) {
    return this.orderRepo.findAllWithFilters(filters);
  }
}
