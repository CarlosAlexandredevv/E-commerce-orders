import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../infrastructure/db/order.entity';
import { CustomerEntity } from '../../infrastructure/db/customer.entity';
import { ProductEntity } from '../../infrastructure/db/product.entity';
import { CreateOrderDto } from '../../interfaces/controllers/dto/create-order.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderStatus } from '../../domain/enum/order-status';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectQueue('order')
    private readonly orderQueue: Queue,
  ) {}

  async execute(data: CreateOrderDto) {
    const customer = await this.upsertCustomer(data.customer);
    const products = await this.createProducts(data.products);

    const order = this.orderRepo.create({
      customer,
      products,
      status: OrderStatus.Pending,
    });

    const savedOrder = await this.orderRepo.save(order);

    await this.orderQueue.add('processOrder', { orderId: savedOrder.id });

    return {
      order: savedOrder,
    };
  }

  private async upsertCustomer(
    customerData: Partial<CustomerEntity>,
  ): Promise<CustomerEntity> {
    let customer = await this.customerRepo.findOne({
      where: { email: customerData.email },
    });

    if (!customer) {
      customer = this.customerRepo.create(customerData);
    } else {
      Object.assign(customer, customerData);
    }

    return this.customerRepo.save(customer);
  }

  private async createProducts(
    productsData: Partial<ProductEntity>[],
  ): Promise<ProductEntity[]> {
    const products = productsData.map((prod) => this.productRepo.create(prod));
    return this.productRepo.save(products);
  }
}
