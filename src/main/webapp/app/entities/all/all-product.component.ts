import ProductService from "@/entities/product/product.service";
import Vue2Filters from 'vue2-filters';

import { Component, Vue, Inject } from 'vue-property-decorator';
import {IProduct, Product} from "@/shared/model/product.model";
import AlertService from "@/shared/alert/alert.service";
import ProductCategoryService from "@/entities/product-category/product-category.service";
import ProductCommentService from "@/entities/product-comment/product-comment.service";
import {IProductCategory, ProductCategory} from "@/shared/model/product-category.model";
import {IProductComment, ProductComment} from "@/shared/model/product-comment.model";
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

  public productComment: IProductComment = new ProductComment();



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
  public isCategoryShow = false;
  public isCommentShow = false;


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
  public productCategories: IProductCategory[] = [];
  public productCategoriesAll: IProductCategory[] = [];
  public productComments: IProductComment[] = [];
  public productCommentsAll: IProductComment[] = [];
  public productsAll: IProduct[] = [];

  public isFetching = false;
  public isFetchingCategory = false;

  public isSaving = false;

  public isSavingCategory = false;

  public isSavingComment = false;


  public lastProductId: number = null;

  public lastCategoryId: number = null;

  public lastCommentId: number = null;



  public saveProduct(): void {
    this.isSaving = true;
    if (this.product.id) {
      this.productService()
        .update(this.product)
        .then(param => {
          this.retrieveAllProducts();
          this.isSaving = false;
          this.isProductShow = true;
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
          this.retrieveAllProductsForSelectForm();
          this.lastProductId=param.id;
          this.productService().find(this.lastProductId).then(res=>{this.product=res});
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

  public saveComment(): void {
    this.isSavingComment = true;
    if (this.productComment.id) {
      this.productCommentService()
        .update(this.productComment)
        .then(param => {
          this.retrieveAllProductComments();
          this.isSavingComment = false;
          this.isCommentShow = true;
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
          this.isSavingComment = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.productCommentService()
        .create(this.productComment)
        .then(param => {
          this.retrieveAllProductComments();
          this.lastCommentId=param.id;
          this.productCommentService().find(this.lastCommentId).then(res=>{this.productComment=res});
          this.isSavingComment = false;
          this.isCommentShow = true;
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
          this.isSavingComment = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }


  public saveProductCategory(): void {
    this.isSavingCategory = true;
    if (this.productCategory.id) {
      this.productCategoryService()
        .update(this.productCategory)
        .then(param => {
          this.retrieveAllProductCategorys();
          this.isSavingCategory = false;
          this.isCategoryShow = true;
          const message = this.$t('productCrudApp.productCategory.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSavingCategory = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.productCategoryService()
        .create(this.productCategory)
        .then(param => {
          this.retrieveAllProductCategorys();
          this.lastCategoryId=param.id;
          this.productCategoryService().find(this.lastCategoryId).then(res=>{this.productCategory=res});
          this.isSavingCategory = false;
          this.isCategoryShow = true;
          const message = this.$t('productCrudApp.productCategory.created', {param: param.id});
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSavingCategory = false;
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
    this.pageCategory = 1;
    this.page = 1;
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

  public retrieveAllProductsForSelectForm(): void {
    this.isFetching = true;
    this.productService()
      .retrieveAll()
      .then(
        res => {
          this.productsAll = res.data;
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

  public prepareCreateComment(): void {
    this.productComment = new ProductComment();
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

  public prepareEditOrCreateProductCategory(instance: IProductCategory): void {
    this.productCategoryService().
    find(instance.id).
    then(res=>
    {this.productCategory=res});

    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public prepareEditOrCreateProductComment(instance: IProductComment): void {
    this.productCommentService().
    find(instance.id).
    then(res=>
    {this.productComment=res});

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
          variant: 'success',
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
          variant: 'success',
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
          variant: 'success',
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
    const result = [this.propOrderProduct + ',' + (this.reverseProduct ? 'asc' : 'desc')];
    if (this.propOrderProduct !== 'id') {
      result.push('id');
    }
    return result;
  }

  public sortCategory(): Array<any> {
    const result = [this.propOrderCategory + ',' + (this.reverseCategory ? 'asc' : 'desc')];
    if (this.propOrderCategory !== 'id') {
      result.push('id');
    }
    return result;
  }

  public sort(): Array<any> {
    const result = [this.propOrder + ',' + (this.reverse ? 'asc' : 'desc')];
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

  public closeDialogProductCategoryCreate(): void {
    (<any>this.$refs.createOrEditEntityProductCategory).hide();
  }


  public closeDialogProductCommentCreate(): void {
    (<any>this.$refs.createOrEditEntityProductComment).hide();
  }


  public closeDialogProductView(): void {
    (<any>this.$refs.viewEntityProduct).hide();
  }
  public closeDialogProductCategoryView(): void {
    (<any>this.$refs.viewEntityProductCategory).hide();
  }
  public closeDialogProductCommentView(): void {
    (<any>this.$refs.viewEntityProductComment).hide();
  }

  public closeDialogProductCategory(): void {
    (<any>this.$refs.removeEntityCategory).hide();
  }

  public closeDialogProductComment(): void {
    (<any>this.$refs.removeEntityComment).hide();
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
