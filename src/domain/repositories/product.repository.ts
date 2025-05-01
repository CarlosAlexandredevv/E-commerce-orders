import { ProductEntity } from '../../infrastructure/db/product.entity';

export interface IProductRepository {
  create(product: Partial<ProductEntity>): ProductEntity;
  save(products: ProductEntity[]): Promise<ProductEntity[]>;
}
