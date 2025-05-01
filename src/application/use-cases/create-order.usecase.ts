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
    let customer = await this.customerRepo.findOne({
      where: { email: data.customer.email },
    });

    if (!customer) {
      customer = this.customerRepo.create(data.customer);
      await this.customerRepo.save(customer);
    }

    const products = data.products.map((prod) => this.productRepo.create(prod));
    await this.productRepo.save(products);

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
}
