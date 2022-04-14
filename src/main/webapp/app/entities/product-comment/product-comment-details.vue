<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="productComment">
        <h2 class="jh-entity-heading" data-cy="productCommentDetailsHeading">
          <span v-text="$t('crudApp.productComment.detail.title')">ProductComment</span> {{ productComment.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('crudApp.productComment.productComment')">Product Comment</span>
          </dt>
          <dd>
            <span>{{ productComment.productComment }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.productComment.author')">Author</span>
          </dt>
          <dd>
            <span>{{ productComment.author }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.productComment.commentTitle')">Comment Title</span>
          </dt>
          <dd>
            <span>{{ productComment.commentTitle }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.productComment.product')">Product</span>
          </dt>
          <dd>
            <div v-if="productComment.product">
              <router-link :to="{ name: 'ProductView', params: { productId: productComment.product.id } }">{{
                productComment.product.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link
          v-if="productComment.id"
          :to="{ name: 'ProductCommentEdit', params: { productCommentId: productComment.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product-comment-details.component.ts"></script>
