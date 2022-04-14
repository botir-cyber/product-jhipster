
import { IProductCategory } from '@/shared/model/product-category.model';

export interface IProduct {
  id?: number;
  productName?: string | null;
  productCode?: string | null;
  productPrice?: number | null;
  productCategoryId?: number;
  productCategoryName?: string | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productName?: string | null,
    public productCode?: string | null,
    public productPrice?: number | null,
    public productCategoryId?: number,
    public productCategoryName?: string | null
  ) {}
}
