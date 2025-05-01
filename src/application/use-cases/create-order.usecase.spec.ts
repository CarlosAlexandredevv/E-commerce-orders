import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from './create-order.usecase';
import { OrderEntity } from '../../infrastructure/db/order.entity';
import { CustomerEntity } from '../../infrastructure/db/customer.entity';
import { ProductEntity } from '../../infrastructure/db/product.entity';
import { CreateOrderDto } from '../../interfaces/controllers/dto/create-order.dto';
import { OrderStatus } from '../../domain/enum/order-status';
import { getQueueToken } from '@nestjs/bull';
import {
  ORDER_REPOSITORY,
  CUSTOMER_REPOSITORY,
  PRODUCT_REPOSITORY,
} from '../../domain/tokens/repository.tokens';

const mockOrderForProduct: Partial<OrderEntity> = {
  id: 'order-placeholder-uuid',
};

const mockCustomer: Partial<CustomerEntity> = {
  id: 1,
  name: 'Cliente Simples',
  email: 'simples@teste.com',
};

const mockProducts: Partial<ProductEntity>[] = [
  {
    id: 10,
    name: 'Prod A',
    quantity: 1,
    price: 10,
    order: mockOrderForProduct as OrderEntity,
  },
  {
    id: 11,
    name: 'Prod B',
    quantity: 2,
    price: 20,
    order: mockOrderForProduct as OrderEntity,
  },
];

const mockOrder: Partial<OrderEntity> = {
  id: 'order-uuid-123',
  customer: mockCustomer as CustomerEntity,
  products: mockProducts as ProductEntity[],
  createdAt: new Date(),
  processedAt: new Date(),
  status: OrderStatus.Pending,
};

const mockOrderRepository = {
  create: jest.fn(),
  save: jest.fn(),
};
const mockCustomerRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
const mockProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

describe('CreateOrderUseCase (Simple)', () => {
  let useCase: CreateOrderUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: ORDER_REPOSITORY,
          useValue: mockOrderRepository,
        },
        {
          provide: CUSTOMER_REPOSITORY,
          useValue: mockCustomerRepository,
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
        {
          provide: getQueueToken('order'),
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);

    mockCustomerRepository.save.mockResolvedValue(mockCustomer);
    mockProductRepository.save.mockResolvedValue(mockProducts);
    mockOrderRepository.save.mockResolvedValue(mockOrder);

    mockCustomerRepository.create.mockImplementation(
      (dto: Partial<CustomerEntity>): Partial<CustomerEntity> => dto,
    );
    mockOrderRepository.create.mockImplementation(
      (orderData: Partial<OrderEntity>): Partial<OrderEntity> => orderData,
    );
  });

  it('should call repositories correctly and return order data for a new customer', async () => {
    mockCustomerRepository.findByEmail.mockResolvedValue(null);

    const inputData: CreateOrderDto = {
      customer: {
        name: 'Cliente Novo DTO',
        email: 'novo@dto.com',
        telefone: '123456',
        cpf: '12345678900',
        address: {
          logradouro: 'Rua DTO',
          numero: '1',
          bairro: 'Bairro DTO',
          cidade: 'Cidade DTO',
          estado: 'ES',
          cep: '123',
        },
      },
      products: [
        { name: 'Prod DTO A', quantity: 1, price: 10 },
        { name: 'Prod DTO B', quantity: 2, price: 20 },
      ],
    };

    const result = await useCase.execute(inputData);

    expect(mockCustomerRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.findByEmail).toHaveBeenCalledWith(
      inputData.customer.email,
    );

    expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.create).toHaveBeenCalledWith(
      inputData.customer,
    );

    expect(mockCustomerRepository.save).toHaveBeenCalledTimes(1);

    expect(mockProductRepository.create).toHaveBeenCalledTimes(
      inputData.products.length,
    );
    expect(mockProductRepository.save).toHaveBeenCalledTimes(1);

    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: mockCustomer,
        products: mockProducts,
        status: 'Pending',
      }),
    );
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);

    expect(result).toBeDefined();
    expect(result.order).toBeDefined();
    expect(result.order.id).toEqual(mockOrder.id);
    expect(result.order.customer).toBeDefined();
    expect(result.order.customer.id).toEqual(mockCustomer.id);
    expect(result.order.products).toBeDefined();
    expect(result.order.products.length).toEqual(mockProducts.length);
  });

  it('should call findByEmail and save (update) but not create for existing customer', async () => {
    const existingCustomerMock = {
      id: 5,
      email: 'existente@dto.com',
      name: 'Antigo',
    };
    mockCustomerRepository.findByEmail.mockResolvedValue(existingCustomerMock);

    const inputData: CreateOrderDto = {
      customer: {
        name: 'Cliente Existente Atualizado DTO',
        email: 'existente@dto.com',
        telefone: '123456',
        cpf: '12345678900',
        address: {
          logradouro: 'Rua DTO',
          numero: '1',
          bairro: 'Bairro DTO',
          cidade: 'Cidade DTO',
          estado: 'ES',
          cep: '123',
        },
      },
      products: [{ name: 'Prod DTO C', quantity: 1, price: 5 }],
    };

    mockCustomerRepository.save.mockResolvedValue({
      ...mockCustomer,
      id: existingCustomerMock.id,
      name: inputData.customer.name,
    });

    await useCase.execute(inputData);

    expect(mockCustomerRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.create).not.toHaveBeenCalled();
    expect(mockCustomerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCustomerRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: existingCustomerMock.id,
        name: inputData.customer.name,
      }),
    );

    expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
  });
});
