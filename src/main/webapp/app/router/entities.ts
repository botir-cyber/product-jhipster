import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore
const Entities = () => import('@/entities/entities.vue');

// prettier-ignore
const Product = () => import('@/entities/product/product.vue');
// prettier-ignore
const ProductUpdate = () => import('@/entities/product/product-update.vue');
// prettier-ignore
const ProductDetails = () => import('@/entities/product/product-details.vue');
// prettier-ignore
const ProductCategory = () => import('@/entities/product-category/product-category.vue');
// prettier-ignore
const ProductCategoryUpdate = () => import('@/entities/product-category/product-category-update.vue');
// prettier-ignore
const ProductCategoryDetails = () => import('@/entities/product-category/product-category-details.vue');
// prettier-ignore
const ProductComment = () => import('@/entities/product-comment/product-comment.vue');
// prettier-ignore
const ProductCommentUpdate = () => import('@/entities/product-comment/product-comment-update.vue');
// prettier-ignore
const ProductCommentDetails = () => import('@/entities/product-comment/product-comment-details.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

const AllProduct = () => import('@/entities/all/all-product.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default {
  path: '/',
  component: Entities,
  children: [
    {
      path: 'all-product',
      name: 'AllProduct',
      component: AllProduct,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product',
      name: 'Product',
      component: Product,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/new',
      name: 'ProductCreate',
      component: ProductUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/:productId/edit',
      name: 'ProductEdit',
      component: ProductUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/:productId/view',
      name: 'ProductView',
      component: ProductDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-category',
      name: 'ProductCategory',
      component: ProductCategory,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-category/new',
      name: 'ProductCategoryCreate',
      component: ProductCategoryUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-category/:productCategoryId/edit',
      name: 'ProductCategoryEdit',
      component: ProductCategoryUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-category/:productCategoryId/view',
      name: 'ProductCategoryView',
      component: ProductCategoryDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-comment',
      name: 'ProductComment',
      component: ProductComment,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-comment/new',
      name: 'ProductCommentCreate',
      component: ProductCommentUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-comment/:productCommentId/edit',
      name: 'ProductCommentEdit',
      component: ProductCommentUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product-comment/:productCommentId/view',
      name: 'ProductCommentView',
      component: ProductCommentDetails,
      meta: { authorities: [Authority.USER] },
    },
    // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
  ],
};
