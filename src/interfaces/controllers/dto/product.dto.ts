import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Product name must be a string.' })
  @IsNotEmpty({ message: 'Product name is required.' })
  name: string;

  @IsNumber({}, { message: 'Quantity must be a number.' })
  @Min(1, { message: 'Minimum quantity is 1.' })
  quantity: number;

  @IsNumber({}, { message: 'Price must be a number.' })
  @Min(0.01, { message: 'Minimum price is $0.01.' })
  price: number;
}
