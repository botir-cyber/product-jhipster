<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="crudApp.productCategory.home.createOrEditLabel"
          data-cy="ProductCategoryCreateUpdateHeading"
          v-text="$t('crudApp.productCategory.home.createOrEditLabel')"
        >
          Create or edit a ProductCategory
        </h2>
        <div>
          <div class="form-group" v-if="productCategory.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="productCategory.id" readonly />
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="$t('crudApp.productCategory.productCategoryName')"
              for="product-category-productCategoryName"
              >Product Category Name</label
            >
            <input
              type="text"
              class="form-control"
              name="productCategoryName"
              id="product-category-productCategoryName"
              data-cy="productCategoryName"
              :class="{ valid: !$v.productCategory.productCategoryName.$invalid, invalid: $v.productCategory.productCategoryName.$invalid }"
              v-model="$v.productCategory.productCategoryName.$model"
            />
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
            :disabled="$v.productCategory.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-category-update.component.ts"></script>
