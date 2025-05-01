import { CustomerEntity } from '../../infrastructure/db/customer.entity';

export interface ICustomerRepository {
  findByEmail(email: string): Promise<CustomerEntity | null>;
  create(customer: Partial<CustomerEntity>): CustomerEntity;
  save(customer: CustomerEntity): Promise<CustomerEntity>;
}
