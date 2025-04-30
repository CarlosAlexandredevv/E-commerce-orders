export enum OrderStatus {
  PENDING = 'Pendente',
  PROCESSED = 'Processado',
}

export class Order {
  constructor(
    public id: string,
    public product: string,
    public quantity: number,
    public price: number,
    public customer: string,
    public status: OrderStatus = OrderStatus.PENDING,
    public createdAt: Date = new Date(),
    public processedAt?: Date,
  ) {}
}
