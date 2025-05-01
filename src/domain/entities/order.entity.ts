import { Customer } from './customer.entity';
import { Product } from './product.entity';

export class Order {
  id?: string;
  createdAt?: Date;
  status?: string;
  processedAt?: Date;
  customer: Customer;
  products: Product[];
}
