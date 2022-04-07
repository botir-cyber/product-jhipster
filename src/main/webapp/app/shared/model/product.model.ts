import { IProductComment } from '@/shared/model/product-comment.model';
import { IProductCategory } from '@/shared/model/product-category.model';

export interface IProduct {
  id?: number;
  productName?: string | null;
  productCode?: string | null;
  productPrice?: number | null;
  productComments?: IProductComment[] | null;
  productCategory?: IProductCategory;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productName?: string | null,
    public productCode?: string | null,
    public productPrice?: number | null,
    public productComments?: IProductComment[] | null,
    public productCategory?: IProductCategory
  ) {}
}
