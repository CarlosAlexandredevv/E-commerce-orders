import { Address } from './address.entity';

export class Customer {
  id?: number;
  name: string;
  telefone: string;
  cpf: string;
  address: Address;
}
