import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../db/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  create(order: Partial<OrderEntity>): OrderEntity {
    return this.repo.create(order);
  }

  save(order: OrderEntity): Promise<OrderEntity> {
    return this.repo.save(order);
  }

  findOneById(id: string): Promise<OrderEntity | null> {
    return this.repo.findOne({ where: { id } });
  }
}
