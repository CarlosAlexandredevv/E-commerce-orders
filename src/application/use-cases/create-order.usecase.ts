import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from 'src/infrastructure/db/order.entity';
import { CustomerEntity } from 'src/infrastructure/db/customer.entity';
import { ProductEntity } from 'src/infrastructure/db/product.entity';
import { CreateOrderDto } from 'src/interfaces/controllers/dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(data: CreateOrderDto) {
    const customer = await this.upsertCustomer(data.customer);
    const products = await this.createProducts(data.products);

    const order = this.orderRepo.create({
      customer,
      products,
      status: 'Pending',
    });
    await this.orderRepo.save(order);

    return {
      order: {
        id: order.id,
        created_at: order.createdAt,
        products: order.products,
        customer: order.customer,
      },
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
