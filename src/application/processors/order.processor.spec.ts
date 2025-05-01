import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProcessor } from './order.processor';
import { OrderEntity } from '../../infrastructure/db/order.entity';
import { OrderStatus } from '../../domain/enum/order-status';
import { Job } from 'bull';

const mockOrder = {
  id: 'order-uuid-123',
  status: OrderStatus.Pending,
  processedAt: null,
};

const mockOrderRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('OrderProcessor', () => {
  let processor: OrderProcessor;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProcessor,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    processor = module.get<OrderProcessor>(OrderProcessor);
  });

  it('should process order and update status and processedAt', async () => {
    mockOrderRepository.findOne.mockResolvedValue({ ...mockOrder });
    mockOrderRepository.save.mockResolvedValue({
      ...mockOrder,
      status: OrderStatus.Processed,
      processedAt: new Date(),
    });

    const job = {
      data: { orderId: mockOrder.id },
    } as unknown as Job<{ orderId: string }>;

    await processor.handleProcessOrder(job);

    expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockOrder.id },
    });
    expect(mockOrderRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: OrderStatus.Processed,
        processedAt: expect.any(Date) as unknown as Date,
      }),
    );
  });

  it('should throw error if order not found', async () => {
    mockOrderRepository.findOne.mockResolvedValue(null);

    const job = {
      data: { orderId: 'not-exist' },
    } as unknown as Job<{ orderId: string }>;

    await expect(processor.handleProcessOrder(job)).rejects.toThrow(
      'Order not found',
    );
  });
});
