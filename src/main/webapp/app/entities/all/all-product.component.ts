import ProductService from "@/entities/product/product.service";
import Vue2Filters from 'vue2-filters';

import { Component, Vue, Inject } from 'vue-property-decorator';
import {IProduct} from "@/shared/model/product.model";
import AlertService from "@/shared/alert/alert.service";
import ProductCategoryService from "@/entities/product-category/product-category.service";
import ProductCommentService from "@/entities/product-comment/product-comment.service";
import {IProductCategory} from "@/shared/model/product-category.model";
import {IProductComment} from "@/shared/model/product-comment.model";


@Component({
  mixins: [Vue2Filters.mixin],
})
export default class AllProductComponent extends Vue{

  @Inject('productService') private productService: () => ProductService;
  @Inject('productCategoryService') private productCategoryService: () => ProductCategoryService;
  @Inject('productCommentService') private productCommentService: () => ProductCommentService;


  @Inject('alertService') private alertService: () => AlertService;


  private removeId: number = null;
  public itemsPerPage = 20;
  public queryCount: number = null;
  public page = 1;
  public previousPage = 1;
  public propOrder = 'id';
  public reverse = false;
  public totalItems = 0;

  public products: IProduct[] = [];
  public productCategories: IProductCategory[] = [];
  public productComments: IProductComment[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys();
    this.retrieveAllProductComments();
  }

  public clear(): void {
    this.page = 1;
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys();
    this.retrieveAllProductComments();
  }

  public retrieveAllProducts(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.productService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.products = res.data;
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

  public retrieveAllProductCategorys(): void {
    this.isFetching = true;
    const paginationQuery = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    this.productCategoryService()
      .retrieve(paginationQuery)
      .then(
        res => {
          this.productCategories = res.data;
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

  public transition(): void {
    this.retrieveAllProducts();
    this.retrieveAllProductCategorys()
    this.retrieveAllProductComments()
  }

  public changeOrder(propOrder): void {
    this.propOrder = propOrder;
    this.reverse = !this.reverse;
    this.transition();
  }

  public closeDialogProduct(): void {
    (<any>this.$refs.removeEntityProduct).hide();
  }
  public closeDialogCategory(): void {
    (<any>this.$refs.removeEntityCategory).hide();
  }
  public closeDialogComment(): void {
    (<any>this.$refs.removeEntityComment).hide();
  }


}
