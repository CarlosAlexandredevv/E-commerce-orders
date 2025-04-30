import { IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  customer: string;
}
