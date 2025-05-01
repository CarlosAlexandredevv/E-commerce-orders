import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../infrastructure/db/order.entity';
import { OrderStatus } from '../../domain/enum/order-status';

@Processor('order')
@Injectable()
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  @Process('processOrder')
  async handleProcessOrder(job: Job<{ orderId: string }>) {
    const { orderId } = job.data;
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = OrderStatus.Processed;
    order.processedAt = new Date();
    await this.orderRepo.save(order);

    this.logger.log(
      `Order ${order.id} processed at ${order.processedAt.toISOString()}`,
    );
  }
}
