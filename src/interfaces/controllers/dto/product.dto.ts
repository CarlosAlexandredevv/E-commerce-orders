import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Product name must be a string.' })
  @IsNotEmpty({ message: 'Product name is required.' })
  name: string;

  @IsNumber({}, { message: 'Product quantity must be a number.' })
  @Min(1, { message: 'Product quantity must be at least 1.' })
  quantity: number;

  @IsNumber({}, { message: 'Product price must be a number.' })
  @Min(0.01, { message: 'Product price must be at least $0.01.' })
  price: number;
}
