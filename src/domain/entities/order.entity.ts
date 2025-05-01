import { OrderStatus } from '../enum/order-status';
import { Customer } from './customer.entity';
import { Product } from './product.entity';

export class Order {
  id?: string;
  createdAt?: Date;
  status?: OrderStatus;
  processedAt?: Date;
  customer: Customer;
  products: Product[];
}
