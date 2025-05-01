import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'Street (logradouro) must be a string.' })
  @IsNotEmpty({ message: 'Street (logradouro) is required.' })
  logradouro: string;

  @IsString({ message: 'Number (numero) must be a string.' })
  @IsNotEmpty({ message: 'Number (numero) is required.' })
  numero: string;

  @IsOptional()
  @IsString({ message: 'Complement (complemento) must be a string.' })
  complemento?: string;

  @IsString({ message: 'Neighborhood (bairro) must be a string.' })
  @IsNotEmpty({ message: 'Neighborhood (bairro) is required.' })
  bairro: string;

  @IsString({ message: 'City (cidade) must be a string.' })
  @IsNotEmpty({ message: 'City (cidade) is required.' })
  cidade: string;

  @IsString({ message: 'State (estado) must be a string.' })
  @IsNotEmpty({ message: 'State (estado) is required.' })
  estado: string;

  @IsString({ message: 'Postal code (cep) must be a string.' })
  @IsNotEmpty({ message: 'Postal code (cep) is required.' })
  cep: string;
}
