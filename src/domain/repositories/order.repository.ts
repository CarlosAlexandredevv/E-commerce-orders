import { OrderEntity } from '../../infrastructure/db/order.entity';

export interface IOrderRepository {
  create(order: Partial<OrderEntity>): OrderEntity;
  save(order: OrderEntity): Promise<OrderEntity>;
  findOneById(id: string): Promise<OrderEntity | null>;

  findAllWithFilters(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrderEntity[]>;
}
