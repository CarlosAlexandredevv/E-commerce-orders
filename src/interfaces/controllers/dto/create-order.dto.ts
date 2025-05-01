import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDto } from './customer.dto';
import { ProductDto } from './product.dto';

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsArray()
  products: ProductDto[];
}
