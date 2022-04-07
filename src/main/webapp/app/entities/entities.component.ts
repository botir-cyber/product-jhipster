import { Component, Provide, Vue } from 'vue-property-decorator';

import UserService from '@/entities/user/user.service';
import ProductService from './product/product.service';
import ProductCategoryService from './product-category/product-category.service';
import ProductCommentService from './product-comment/product-comment.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

@Component
export default class Entities extends Vue {
  @Provide('userService') private userService = () => new UserService();
  @Provide('productService') private productService = () => new ProductService();
  @Provide('productCategoryService') private productCategoryService = () => new ProductCategoryService();
  @Provide('productCommentService') private productCommentService = () => new ProductCommentService();
  // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
}
