import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';

import ProductService from '@/entities/product/product.service';
import { IProduct } from '@/shared/model/product.model';

import { IProductComment, ProductComment } from '@/shared/model/product-comment.model';
import ProductCommentService from './product-comment.service';

const validations: any = {
  productComment: {
    productComment: {},
    author: {},
    commentTitle: {},
    product: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class ProductCommentUpdate extends Vue {
  @Inject('productCommentService') private productCommentService: () => ProductCommentService;
  @Inject('alertService') private alertService: () => AlertService;

  public productComment: IProductComment = new ProductComment();

  @Inject('productService') private productService: () => ProductService;

  public products: IProduct[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productCommentId) {
        vm.retrieveProductComment(to.params.productCommentId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.productComment.id) {
      this.productCommentService()
        .update(this.productComment)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('crudApp.productComment.updated', { param: param.id });
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
      this.productCommentService()
        .create(this.productComment)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('crudApp.productComment.created', { param: param.id });
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

  public retrieveProductComment(productCommentId): void {
    this.productCommentService()
      .find(productCommentId)
      .then(res => {
        this.productComment = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.productService()
      .retrieve()
      .then(res => {
        this.products = res.data;
      });
  }
}
