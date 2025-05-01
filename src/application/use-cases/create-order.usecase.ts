import { Injectable, Inject } from '@nestjs/common';
import { ProductEntity } from '../../infrastructure/db/product.entity';
import { CreateOrderDto } from '../../interfaces/controllers/dto/create-order.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderStatus } from '../../domain/enum/order-status';
import { IOrderRepository } from 'src/domain/repositories/order.repository';
import { ICustomerRepository } from 'src/domain/repositories/customer.repository';
import { IProductRepository } from 'src/domain/repositories/product.repository';
import { CustomerEntity } from '../../infrastructure/db/customer.entity';
import {
  ORDER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '../../domain/tokens/repository.tokens';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: ICustomerRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
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
    let customer = await this.customerRepo.findByEmail(customerData.email!);

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
