import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../db/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repo: Repository<CustomerEntity>,
  ) {}

  findByEmail(email: string): Promise<CustomerEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  create(customer: Partial<CustomerEntity>): CustomerEntity {
    return this.repo.create(customer);
  }

  save(customer: CustomerEntity): Promise<CustomerEntity> {
    return this.repo.save(customer);
  }
}
