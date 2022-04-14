<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="product">
        <h2 class="jh-entity-heading" data-cy="productDetailsHeading">
          <span v-text="$t('crudApp.product.detail.title')">Product</span> {{ product.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="$t('crudApp.product.productName')">Product Name</span>
          </dt>
          <dd>
            <span>{{ product.productName }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.product.productCode')">Product Code</span>
          </dt>
          <dd>
            <span>{{ product.productCode }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.product.productPrice')">Product Price</span>
          </dt>
          <dd>
            <span>{{ product.productPrice }}</span>
          </dd>
          <dt>
            <span v-text="$t('crudApp.product.productCategory')">Product Category</span>
          </dt>
          <dd>
            <div v-if="product.productCategory">
              <router-link :to="{ name: 'ProductCategoryView', params: { productCategoryId: product.productCategory.id } }">{{
                product.productCategory.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
        </button>
        <router-link v-if="product.id" :to="{ name: 'ProductEdit', params: { productId: product.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product-details.component.ts"></script>
