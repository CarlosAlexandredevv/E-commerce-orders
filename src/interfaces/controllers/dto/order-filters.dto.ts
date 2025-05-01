import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { OrderStatus } from '../../../domain/enum/order-status';

export class OrderFiltersDto {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid status.' })
  status?: OrderStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid start date.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid end date.' })
  endDate?: string;
}
