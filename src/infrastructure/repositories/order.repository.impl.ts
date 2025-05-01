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

  async findAllWithFilters(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrderEntity[]> {
    const query = this.repo.createQueryBuilder('order');

    if (filters.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }
    if (filters.startDate) {
      query.andWhere('order.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      query.andWhere('order.createdAt <= :endDate', {
        endDate: filters.endDate,
      });
    }

    return query.getMany();
  }
}
