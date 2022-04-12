import ProductService from "@/entities/product/product.service";
import Vue2Filters from 'vue2-filters';

import { Component, Vue, Inject } from 'vue-property-decorator';
import {IProduct, Product} from "@/shared/model/product.model";
import AlertService from "@/shared/alert/alert.service";
import ProductCategoryService from "@/entities/product-category/product-category.service";
import ProductCommentService from "@/entities/product-comment/product-comment.service";
import {IProductCategory, ProductCategory} from "@/shared/model/product-category.model";
import {IProductComment} from "@/shared/model/product-comment.model";
import { required } from 'vuelidate/lib/validators';





const validations: any = {
  product: {
    productName: {},
    productCode: {},
    productPrice: {},
    productCategory: {
      required,
    },
  },
};

@Component({
  mixins: [Vue2Filters.mixin],
  validations,
})

export default class AllProductComponent extends Vue{

  @Inject('productService') private productService: () => ProductService;
  @Inject('productCategoryService') private productCategoryService: () => ProductCategoryService;
  @Inject('productCommentService') private productCommentService: () => ProductCommentService;


  @Inject('alertService') private alertService: () => AlertService;

  public product: IProduct = new Product();

  public productCategory: IProductCategory = new ProductCategory();



  private removeId: number = null;
  public itemsPerPageProduct = 5;
  public itemsPerPageCategory = 5;
  public itemsPerPage = 5;
  public queryCountProduct: number = null;
  public queryCountCategory: number = null;
  public queryCount: number = null;
  public pageProduct = 1;
  public pageCategory = 1;
  public page = 1;
  public previousPageProduct = 1;
  public previousPageCategory = 1;
  public previousPage = 1;

  public isProductShow = false;


  public propOrder = 'id';
  public propOrderCategory = 'id';
  public propOrderProduct = 'id';
  public reverse = false;
  public reverseProduct = false;
  public reverseCategory = false;

  public totalItems = 0;
  public totalItemsProduct = 0;
  public totalItemsCategory = 0;

  public products: IProduct[] = [];
  public productsNew: IProduct[] = [];
  public productCategories: IProductCategory[] = [];
  public productCategoriesAll: IProductCategory[] = [];
  public productComments: IProductComment[] = [];

  public isFetching = false;

  public isSaving = false;

  public isCreate = false;

  public lastProductId: number = null;



  public save(): void {
    this.isSaving = true;
    if (this.product.id) {
      this.productService()
        .update(this.product)
        .then(param => {
          this.isCreate=true;
          this.retrieveAllProducts();
          this.isSaving = false;
          this.isProductShow = true;
          this.$router.go(-1);
          const message = this.$t('productCrudApp.product.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.productService()
        .create(this.product)
        .then(param => {
          this.retrieveAllProducts();
          this.lastProductId=param.id;
          this.productService().find(this.lastProductId).then(res=>{this.product=res});
          this.isCreate = true;
          this.isSaving = false;
          this.isProductShow = true;
          const message = this.$t('productCrudApp.product.created', {param: param.id});
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }



  public mounted(): void {
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys();
    this.retrieveAllProductComments();
  }

  public clear(): void {
    this.pageProduct = 1;
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys();
    this.retrieveAllProductComments();
  }

  public retrieveAllProducts(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.pageProduct - 1,
      size: this.itemsPerPageProduct,
      sort: this.sortProduct(),
    };

    this.productService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.products = res.data;
          this.productsNew = res.data;
          this.totalItemsProduct = Number(res.headers['x-total-count']);
          this.queryCountProduct = this.totalItemsProduct;
          this.  isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public retrieveAllProductCategorysForSelectForm(): void {
    this.isFetching = true;
    this.productCategoryService()
      .retrieveAll()
      .then(
        res => {
          this.productCategoriesAll = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }

  public retrieveAllProductCategorys(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.pageCategory - 1,
      size: this.itemsPerPageCategory,
      sort: this.sortCategory(),
    };
    this.productCategoryService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.productCategories = res.data;
          this.totalItemsCategory = Number(res.headers['x-total-count']);
          this.queryCountCategory = this.totalItemsCategory;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }
  public retrieveAllProductComments(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.productCommentService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.productComments = res.data;
          this.totalItems = Number(res.headers['x-total-count']);
          this.queryCount = this.totalItems;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
          this.alertService().showHttpError(this, err.response);
        }
      );
  }


  public handleSyncList(): void {
    this.clear();
  }


  public prepareCreateProduct(): void {
    this.product = new Product();
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public prepareCreateCategory(): void {
    this.productCategory = new ProductCategory();
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public prepareEditOrCreateProduct(instance: IProduct): void {
    this.productService().
    find(instance.id).
    then(res=>
    {this.product=res});

    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public prepareRemove(instance: IProduct): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }


  public prepareRemoveCategory(instance: IProductCategory): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }
  public prepareRemoveComment(instance: IProductComment): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeProduct(): void {
    this.productService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('productCrudApp.product.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllProducts();
        this.closeDialogProduct();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public removeProductCategory(): void {
    this.productCategoryService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('productCrudApp.productCategory.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllProductCategorys();
        this.closeDialogCategory();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public removeProductComment(): void {
    this.productCommentService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('productCrudApp.productComment.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllProductComments();
        this.closeDialogComment();
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public sortProduct(): Array<any> {
    const result = [this.propOrderProduct + ',' + (this.reverseProduct ? 'desc' : 'asc')];
    if (this.propOrderProduct !== 'id') {
      result.push('id');
    }
    return result;
  }

  public sortCategory(): Array<any> {
    const result = [this.propOrderCategory + ',' + (this.reverseCategory ? 'desc' : 'asc')];
    if (this.propOrderCategory !== 'id') {
      result.push('id');
    }
    return result;
  }

  public sort(): Array<any> {
    const result = [this.propOrder + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  public loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  public loadPageProduct(page: number): void {
    if (page !== this.previousPageProduct) {
      this.previousPageProduct = page;
      this.transition();
    }
  }

  public loadPageCategory(page: number): void {
    if (page !== this.previousPageCategory) {
      this.previousPageCategory = page;
      this.transition();
    }
  }


  public transition(): void {
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys()
    this.retrieveAllProductComments()
  }

  public changeOrderProduct(propOrder): void {
    this.propOrderProduct = propOrder;
    this.reverseProduct = !this.reverseProduct;
    this.transition();
  }

  public changeOrderCategory(propOrder): void {
    this.propOrderCategory = propOrder;
    this.reverseCategory = !this.reverseCategory;
    this.transition();
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialogProduct(): void {
    (<any>this.$refs.removeEntityProduct).hide();
  }

  public clearDialogProduct(): void {
    this.product=new Product();
  }

  public closeDialogProductCreate(): void {
    (<any>this.$refs.createOrEditEntityProduct).hide();
  }

  public closeDialogProductView(): void {
    (<any>this.$refs.viewEntityProduct).hide();
  }
  public closeDialogProductUpdate(): void {
    (<any>this.$refs.editEntityProduct).hide();
  }
  public closeDialogCategory(): void {
    (<any>this.$refs.removeEntityCategory).hide();
  }
  public closeDialogComment(): void {
    (<any>this.$refs.removeEntityComment).hide();
  }


}
