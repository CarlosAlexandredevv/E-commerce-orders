import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { OrderStatus } from '../../domain/enum/order-status';
import { ORDER_REPOSITORY } from 'src/domain/tokens/repository.tokens';
import { IOrderRepository } from 'src/domain/repositories/order.repository';

@Processor('order')
@Injectable()
export class OrderProcessor {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  @Process('processOrder')
  async handleProcessOrder(job: Job<{ orderId: string }>) {
    const { orderId } = job.data;
    const order = await this.orderRepo.findOneById(orderId);

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
