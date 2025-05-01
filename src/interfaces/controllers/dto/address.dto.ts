import { IsString, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'Street must be a string.' })
  @IsNotEmpty({ message: 'Street is required.' })
  logradouro: string;

  @IsString({ message: 'Number must be a string.' })
  @IsNotEmpty({ message: 'Number is required.' })
  numero: string;

  @IsString({ message: 'Complement must be a string.' })
  complemento?: string;

  @IsString({ message: 'Neighborhood must be a string.' })
  @IsNotEmpty({ message: 'Neighborhood is required.' })
  bairro: string;

  @IsString({ message: 'City must be a string.' })
  @IsNotEmpty({ message: 'City is required.' })
  cidade: string;

  @IsString({ message: 'State must be a string.' })
  @IsNotEmpty({ message: 'State is required.' })
  estado: string;

  @IsString({ message: 'Postal code must be a string.' })
  @IsNotEmpty({ message: 'Postal code is required.' })
  cep: string;
}
