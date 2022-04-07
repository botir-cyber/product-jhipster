import { IProduct } from '@/shared/model/product.model';

export interface IProductComment {
  id?: number;
  productComment?: string | null;
  author?: string | null;
  commentTitle?: string | null;
  product?: IProduct;
}

export class ProductComment implements IProductComment {
  constructor(
    public id?: number,
    public productComment?: string | null,
    public author?: string | null,
    public commentTitle?: string | null,
    public product?: IProduct
  ) {}
}
