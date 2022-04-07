<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="productCrudApp.productComment.home.createOrEditLabel"
          data-cy="ProductCommentCreateUpdateHeading"
          v-text="$t('productCrudApp.productComment.home.createOrEditLabel')"
        >
          Create or edit a ProductComment
        </h2>
        <div>
          <div class="form-group" v-if="productComment.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="productComment.id" readonly />
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="$t('productCrudApp.productComment.productComment')"
              for="product-comment-productComment"
              >Product Comment</label
            >
            <input
              type="text"
              class="form-control"
              name="productComment"
              id="product-comment-productComment"
              data-cy="productComment"
              :class="{ valid: !$v.productComment.productComment.$invalid, invalid: $v.productComment.productComment.$invalid }"
              v-model="$v.productComment.productComment.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.productComment.author')" for="product-comment-author"
              >Author</label
            >
            <input
              type="text"
              class="form-control"
              name="author"
              id="product-comment-author"
              data-cy="author"
              :class="{ valid: !$v.productComment.author.$invalid, invalid: $v.productComment.author.$invalid }"
              v-model="$v.productComment.author.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.productComment.commentTitle')" for="product-comment-commentTitle"
              >Comment Title</label
            >
            <input
              type="text"
              class="form-control"
              name="commentTitle"
              id="product-comment-commentTitle"
              data-cy="commentTitle"
              :class="{ valid: !$v.productComment.commentTitle.$invalid, invalid: $v.productComment.commentTitle.$invalid }"
              v-model="$v.productComment.commentTitle.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.productComment.product')" for="product-comment-product"
              >Product</label
            >
            <select
              class="form-control"
              id="product-comment-product"
              data-cy="product"
              name="product"
              v-model="productComment.product"
              required
            >
              <option v-if="!productComment.product" v-bind:value="null" selected></option>
              <option
                v-bind:value="
                  productComment.product && productOption.id === productComment.product.id ? productComment.product : productOption
                "
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.id }}
              </option>
            </select>
          </div>
          <div v-if="$v.productComment.product.$anyDirty && $v.productComment.product.$invalid">
            <small class="form-text text-danger" v-if="!$v.productComment.product.required" v-text="$t('entity.validation.required')">
              This field is required.
            </small>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.productComment.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-comment-update.component.ts"></script>
