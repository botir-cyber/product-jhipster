import { IProduct } from '@/shared/model/product.model';

export interface IProductCategory {
  id?: number;
  productCategoryName?: string | null;
  products?: IProduct[] | null;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public productCategoryName?: string | null, public products?: IProduct[] | null) {}
}
