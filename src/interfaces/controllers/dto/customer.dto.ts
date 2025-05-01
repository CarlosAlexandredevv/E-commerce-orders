import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CustomerDto {
  @IsString()
  name: string;

  @IsString()
  telefone: string;

  @IsString()
  cpf: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
