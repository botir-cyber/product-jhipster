import { Component, Vue, Inject } from 'vue-property-decorator';

import { IProductComment } from '@/shared/model/product-comment.model';
import ProductCommentService from './product-comment.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class ProductCommentDetails extends Vue {
  @Inject('productCommentService') private productCommentService: () => ProductCommentService;
  @Inject('alertService') private alertService: () => AlertService;

  public productComment: IProductComment = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productCommentId) {
        vm.retrieveProductComment(to.params.productCommentId);
      }
    });
  }

  public retrieveProductComment(productCommentId) {
    this.productCommentService()
      .find(productCommentId)
      .then(res => {
        this.productComment = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
