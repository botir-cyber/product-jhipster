<template>
  <div>
    <h2 id="page-heading" data-cy="ProductCommentHeading">
      <span v-text="$t('productCrudApp.productComment.home.title')" id="product-comment-heading">Product Comments</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('productCrudApp.productComment.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'ProductCommentCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-product-comment"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('productCrudApp.productComment.home.createLabel')"> Create a new Product Comment </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && productComments && productComments.length === 0">
      <span v-text="$t('productCrudApp.productComment.home.notFound')">No productComments found</span>
    </div>
    <div class="table-responsive" v-if="productComments && productComments.length > 0">
      <table class="table table-striped" aria-describedby="productComments">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('productComment')">
              <span v-text="$t('productCrudApp.productComment.productComment')">Product Comment</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'productComment'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('author')">
              <span v-text="$t('productCrudApp.productComment.author')">Author</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'author'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('commentTitle')">
              <span v-text="$t('productCrudApp.productComment.commentTitle')">Comment Title</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'commentTitle'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('product.id')">
              <span v-text="$t('productCrudApp.productComment.product')">Product</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'product.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="productComment in productComments" :key="productComment.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ProductCommentView', params: { productCommentId: productComment.id } }">{{
                productComment.id
              }}</router-link>
            </td>
            <td>{{ productComment.productComment }}</td>
            <td>{{ productComment.author }}</td>
            <td>{{ productComment.commentTitle }}</td>
            <td>
              <div v-if="productComment.product">
                <router-link :to="{ name: 'ProductView', params: { productId: productComment.product.id } }">{{
                  productComment.product.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link
                  :to="{ name: 'ProductCommentView', params: { productCommentId: productComment.id } }"
                  custom
                  v-slot="{ navigate }"
                >
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link
                  :to="{ name: 'ProductCommentEdit', params: { productCommentId: productComment.id } }"
                  custom
                  v-slot="{ navigate }"
                >
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(productComment)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span
          id="productCrudApp.productComment.delete.question"
          data-cy="productCommentDeleteDialogHeading"
          v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-productComment-heading" v-text="$t('productCrudApp.productComment.delete.question', { id: removeId })">
          Are you sure you want to delete this Product Comment?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-productComment"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeProductComment()"
        >
          Delete
        </button>
      </div>
    </b-modal>
    <div v-show="productComments && productComments.length > 0">
      <div class="row justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product-comment.component.ts"></script>
