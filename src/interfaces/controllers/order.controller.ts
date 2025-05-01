import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersUseCase } from 'src/application/use-cases/list-orders.usecase';
import { OrderFiltersDto } from './dto/order-filters.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo pedido' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de pedido',
        value: {
          products: [
            { name: 'Notebook Dell', quantity: 2, price: 4500 },
            { name: 'Mouse Logitech', quantity: 1, price: 150 },
            { name: 'Teclado Mecânico', quantity: 1, price: 300 },
          ],
          customer: {
            name: 'João da Silva',
            telefone: '11988887776',
            cpf: '123.456.789-00',
            email: 'teste@gmail.com',
            address: {
              logradouro: 'Rua Exemplo',
              numero: '123',
              complemento: 'Apto 45',
              bairro: 'Centro',
              cidade: 'Fortaleza',
              estado: 'CE',
              cep: '01000-000',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async create(@Body() data: CreateOrderDto) {
    try {
      return await this.createOrderUseCase.execute(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar pedido.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos com filtros opcionais' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['Pending', 'Processed'],
    example: 'Pending',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Data inicial (ISO)',
    example: '2025-05-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Data final (ISO)',
    example: '2025-05-01T23:59:59Z',
  })
  @ApiResponse({ status: 200, description: 'Lista de pedidos.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async listOrders(@Query() filters: OrderFiltersDto) {
    try {
      return await this.listOrdersUseCase.execute(filters);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao consultar pedidos.');
    }
  }
}
