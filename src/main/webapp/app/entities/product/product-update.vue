<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="productCrudApp.product.home.createOrEditLabel"
          data-cy="ProductCreateUpdateHeading"
          v-text="$t('productCrudApp.product.home.createOrEditLabel')"
        >
          Create or edit a Product
        </h2>
        <div>
          <div class="form-group" v-if="product.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="product.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.product.productName')" for="product-productName"
              >Product Name</label
            >
            <input
              type="text"
              class="form-control"
              name="productName"
              id="product-productName"
              data-cy="productName"
              :class="{ valid: !$v.product.productName.$invalid, invalid: $v.product.productName.$invalid }"
              v-model="$v.product.productName.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.product.productCode')" for="product-productCode"
              >Product Code</label
            >
            <input
              type="text"
              class="form-control"
              name="productCode"
              id="product-productCode"
              data-cy="productCode"
              :class="{ valid: !$v.product.productCode.$invalid, invalid: $v.product.productCode.$invalid }"
              v-model="$v.product.productCode.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.product.productPrice')" for="product-productPrice"
              >Product Price</label
            >
            <input
              type="number"
              class="form-control"
              name="productPrice"
              id="product-productPrice"
              data-cy="productPrice"
              :class="{ valid: !$v.product.productPrice.$invalid, invalid: $v.product.productPrice.$invalid }"
              v-model.number="$v.product.productPrice.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('productCrudApp.product.productCategory')" for="product-productCategory"
              >Product Category</label
            >
            <select
              class="form-control"
              id="product-productCategory"
              data-cy="productCategory"
              name="productCategory"
              v-model="product.productCategory"
              required
            >
              <option v-if="!product.productCategory" v-bind:value="null" selected></option>
              <option
                v-bind:value="
                  product.productCategory && productCategoryOption.id === product.productCategory.id
                    ? product.productCategory
                    : productCategoryOption
                "
                v-for="productCategoryOption in productCategories"
                :key="productCategoryOption.id"
              >
                {{ productCategoryOption.id }}
              </option>
            </select>
          </div>
          <div v-if="$v.product.productCategory.$anyDirty && $v.product.productCategory.$invalid">
            <small class="form-text text-danger" v-if="!$v.product.productCategory.required" v-text="$t('entity.validation.required')">
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
            :disabled="$v.product.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-update.component.ts"></script>
