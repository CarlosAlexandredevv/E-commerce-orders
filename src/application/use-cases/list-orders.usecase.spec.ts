import { ListOrdersUseCase } from './list-orders.usecase';
import { OrderStatus } from '../../domain/enum/order-status';

const mockOrderRepository = {
  findAllWithFilters: jest.fn(),
};

describe('ListOrdersUseCase', () => {
  let useCase: ListOrdersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListOrdersUseCase(mockOrderRepository as any);
  });

  it('should call repository with filters and return orders', async () => {
    const filters = {
      status: OrderStatus.Processed,
      startDate: '2025-05-01T00:00:00Z',
      endDate: '2025-05-01T23:59:59Z',
    };
    const orders = [
      {
        id: '1',
        status: OrderStatus.Processed,
        createdAt: '2025-05-01T10:00:00Z',
      },
    ];
    mockOrderRepository.findAllWithFilters.mockResolvedValue(orders);

    const result = await useCase.execute(filters);

    expect(mockOrderRepository.findAllWithFilters).toHaveBeenCalledWith(
      filters,
    );
    expect(result).toEqual(orders);
  });

  it('should return empty array if no orders found', async () => {
    const filters = {};
    mockOrderRepository.findAllWithFilters.mockResolvedValue([]);

    const result = await useCase.execute(filters);

    expect(mockOrderRepository.findAllWithFilters).toHaveBeenCalledWith(
      filters,
    );
    expect(result).toEqual([]);
  });
});
