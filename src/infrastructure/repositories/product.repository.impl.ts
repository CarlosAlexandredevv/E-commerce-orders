import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../db/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  create(product: Partial<ProductEntity>): ProductEntity {
    return this.repo.create(product);
  }

  save(products: ProductEntity[]): Promise<ProductEntity[]> {
    return this.repo.save(products);
  }
}
