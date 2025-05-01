import { IsString, IsNotEmpty, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';

export class CustomerDto {
  @IsString({ message: 'Customer name must be a string.' })
  @IsNotEmpty({ message: 'Customer name is required.' })
  name: string;

  @IsString({ message: 'Phone must be a string.' })
  @IsNotEmpty({ message: 'Phone is required.' })
  telefone: string;

  @IsString({ message: 'CPF must be a string.' })
  @IsNotEmpty({ message: 'CPF is required.' })
  cpf: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
