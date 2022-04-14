<template>
  <div>


    <!--    PAGE CATEGORY-->

    <div class="m-5">
      <h2 id="page-heading" class="d-flex justify-content-center" data-cy="ProductCategoryHeading">
        <span v-text="$t('crudApp.productCategory.home.title')" class="mx-5" id="product-category-heading">Products</span>
        <div class="d-flex justify-content-center ">
          <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
            <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
            <span v-text="$t('' +
             'crudApp.productCategory.home.refreshListLabel')">Refresh List</span>
          </button>

          <!--BUTTON for creating CATEGORY-->
          <b-button
            v-on:click="prepareCreateCategory()"
            variant="danger"
            class="btn btn-danger mr-2"
            data-cy="entityCreateButton"
            v-b-modal.createOrEditEntityProductCategory>
            + createWithModal
          </b-button>

        </div>
      </h2>
      <br/>
      <div class="alert alert-warning" v-if="!isFetchingCategory && productCategories && productCategories.length === 0">
        <span v-text="$t('crudApp.productCategory.home.notFound')">No productCategories found</span>
      </div>
      <div class="table-responsive container text-center border border-danger" v-if="productCategories && productCategories.length > 0">
        <table class="table table-striped p-2" aria-describedby="productCategories">
          <thead>
          <tr>
            <th scope="row" v-on:click="changeOrderCategory('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverseCategory" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrderCategory('productCategoryName')">
              <span v-text="$t('crudApp.productCategory.productCategoryName')">Product Category Name</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverseCategory"
                                  :field-name="'productCategoryName'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="productCategory in productCategories" :key="productCategory.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ProductCategoryView', params: { productCategoryId: productCategory.id } }">{{
                  productCategory.id
                }}
              </router-link>
            </td>
            <td>{{ productCategory.productCategoryName }}</td>

            <td class="text-right">
              <div class="btn-group">
                <button
                  v-on:click="prepareEditOrCreateProductCategory(productCategory)"
                  class="btn btn-info btn-sm view"
                  data-cy="viewEntityProductCategory"
                  v-b-modal.viewEntityProductCategory>
                  <font-awesome-icon icon="eye"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                </button>

                <button
                  v-on:click="prepareEditOrCreateProductCategory(productCategory)"
                  class="btn btn-primary btn-sm edit"
                  data-cy="createOrEditEntityProduct"
                  v-b-modal.createOrEditEntityProductCategory>
                  <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                </button>


                <b-button
                  v-on:click="prepareRemoveCategory(productCategory)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntityCategory
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


      <div v-show="productCategories && productCategories.length > 0">
        <div class="row justify-content-center">
          <jhi-item-count :page="pageCategory" :total="queryCountCategory" :itemsPerPage="itemsPerPageCategory"></jhi-item-count>
        </div>
        <div class="row justify-content-center">
          <b-pagination size="md" :total-rows="totalItemsCategory" v-model="pageCategory" :per-page="itemsPerPageCategory"
                        :change="loadPageCategory(pageCategory)"></b-pagination>
        </div>
      </div>
    </div>

<!--     PAGE PRODUCT-->

    <div class="m-5">
      <h2 id="page-heading" class="d-flex justify-content-center" data-cy="ProductHeading">
        <span v-text="$t('crudApp.product.home.title')" class="mx-5" id="product-heading">Products</span>
        <div class="d-flex justify-content-center ">
          <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
            <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
            <span v-text="$t('crudApp.product.home.refreshListLabel')">Refresh List</span>
          </button>

          <!--BUTTON for creating-->
          <b-button
            v-on:click="prepareCreateProduct(),retrieveAllProductCategoriesForSelectForm()"
            variant="danger"
            class="btn btn-danger mr-2"
            data-cy="entityCreateButton"
            v-b-modal.createOrEditEntityProduct>
            + createWithModal
          </b-button>

        </div>
      </h2>
      <br/>
      <div class="alert alert-warning" v-if="!isFetching && products && products.length === 0">
        <span v-text="$t('crudApp.product.home.notFound')">No products found</span>
      </div>
      <div class="table-responsive container text-center border border-danger" v-if="products && products.length > 0">
        <table class="table table-striped  p-2 " aria-describedby="products">
          <thead>
          <tr>
            <th scope="row" v-on:click="changeOrderProduct('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrderProduct" :reverse="reverseProduct"
                                  :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrderProduct('productCategory.productCategoryName')">
              <span v-text="$t('crudApp.product.productCategory')">Product Category</span>
              <jhi-sort-indicator :current-order="propOrderProduct" :reverse="reverseProduct"
                                  :field-name="'productCategory.productCategoryName'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrderProduct('productName')">
              <span v-text="$t('crudApp.product.productName')">Product Name</span>
              <jhi-sort-indicator :current-order="propOrderProduct" :reverse="reverseProduct"
                                  :field-name="'productName'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrderProduct('productCode')">
              <span v-text="$t('crudApp.product.productCode')">Product Code</span>
              <jhi-sort-indicator :current-order="propOrderProduct" :reverse="reverseProduct"
                                  :field-name="'productCode'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrderProduct('productPrice')">
              <span v-text="$t('crudApp.product.productPrice')">Product Price</span>
              <jhi-sort-indicator :current-order="propOrderProduct" :reverse="reverseProduct"
                                  :field-name="'productPrice'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in products" :key="product.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ProductView', params: { productId: product.id } }">{{
                  product.id
                }}
              </router-link>
            </td>
            <td>
              <div v-if="product.productCategoryId">
                <p
                  :to="{ name: 'ProductCategoryView', params: { productCategoryId: product.productCategoryName } }">
                  {{
                    product.productCategoryName
                  }}
                </p>
              </div>
            </td>
            <td>{{ product.productName }}</td>
            <td>{{ product.productCode }}</td>
            <td>{{ product.productPrice }}</td>

            <td class="text-right">
              <div class="btn-group">
                <button
                  v-on:click="prepareEditOrCreateProduct(product)"
                  class="btn btn-info btn-sm view"
                  data-cy="viewEntityProduct"
                  v-b-modal.viewEntityProduct>
                  <font-awesome-icon icon="eye"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                </button>

                <button
                  v-on:click="prepareEditOrCreateProduct(product),retrieveAllProductCategoriesForSelectForm()"
                  class="btn btn-primary btn-sm edit"
                  data-cy="createOrEditEntityProduct"
                  v-b-modal.createOrEditEntityProduct>
                  <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                </button>

                <b-button
                  v-on:click="prepareRemove(product)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntityProduct
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

      <div v-show="products && products.length > 0">
        <div class="row justify-content-center">
          <jhi-item-count :page="pageProduct" :total="queryCountProduct"
                          :itemsPerPage="itemsPerPageProduct"></jhi-item-count>
        </div>
        <div class="row justify-content-center">
          <b-pagination size="md" :total-rows="totalItemsProduct" v-model="pageProduct" :per-page="itemsPerPageProduct"
                        :change="loadPageProduct(pageProduct)"></b-pagination>
        </div>
      </div>

    </div>


<!--    Third PAGE COMMENT-->

    <div class="m-5">
      <h2 id="page-heading" class="d-flex justify-content-center" data-cy="ProductCommentHeading">
        <span v-text="$t('crudApp.productComment.home.title')" class="mx-5" id="product-comment-heading">Product Comments</span>
        <div class="d-flex justify-content-center ">
          <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
            <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
            <span v-text="$t('crudApp.productComment.home.refreshListLabel')">Refresh List</span>
          </button>
          <!--BUTTON for creating CATEGORY-->
          <b-button
            v-on:click="prepareCreateComment(),retrieveAllProductsForSelectForm()"
            variant="danger"
            class="btn btn-danger mr-2"
            data-cy="entityCreateButton"
            v-b-modal.createOrEditEntityProductComment>
            + createWithModal
          </b-button>
        </div>
      </h2>
      <br />
      <div class="alert alert-warning" v-if="!isFetching && productComments && productComments.length === 0">
        <span v-text="$t('crudApp.productComment.home.notFound')">No productComments found</span>
      </div>
      <div class="table-responsive container text-center border border-danger" v-if="productComments && productComments.length > 0">
        <table class="table table-striped p-2" aria-describedby="productComments">
          <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span v-text="$t('global.field.id')">ID</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('productId')">
              <span v-text="$t('crudApp.productComment.product')">Product</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'productId'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('productComment')">
              <span v-text="$t('crudApp.productComment.productComment')">Product Comment</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'productComment'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('author')">
              <span v-text="$t('crudApp.productComment.author')">Author</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'author'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('commentTitle')">
              <span v-text="$t('crudApp.productComment.commentTitle')">Comment Title</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'commentTitle'"></jhi-sort-indicator>
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
            <td>
              <div v-if="productComment.productId">
                <p :to="{ name: 'ProductView', params: { productId: productComment.productName } }">{{
                    productComment.productName
                  }}</p>
              </div>
            </td>
            <td>{{ productComment.productComment }}</td>
            <td>{{ productComment.author }}</td>
            <td>{{ productComment.commentTitle }}</td>

            <td class="text-right">
              <div class="btn-group">

                <button
                  v-on:click="prepareEditOrCreateProductComment(productComment)"
                  class="btn btn-info btn-sm view"
                  data-cy="viewEntityProductComment"
                  v-b-modal.viewEntityProductComment>
                  <font-awesome-icon icon="eye"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                </button>

                <button
                  v-on:click="prepareEditOrCreateProductComment(productComment),retrieveAllProductsForSelectForm()"
                  class="btn btn-primary btn-sm edit"
                  data-cy="createOrEditEntityProductComment"
                  v-b-modal.createOrEditEntityProductComment>
                  <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                </button>

                <b-button
                  v-on:click="prepareRemoveComment(productComment)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntityComment
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


      <div v-show="productComments && productComments.length > 0">
        <div class="row justify-content-center">
          <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
        </div>
        <div class="row justify-content-center">
          <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
        </div>
      </div>
    </div>




    <!--      Modal For Removing Product-->
    <b-modal ref="removeEntityProduct" id="removeEntityProduct">
      <span slot="modal-title"
      ><span id="crudApp.product.delete.question" data-cy="productDeleteDialogHeading"
             v-text="$t('entity.delete.title')"
      >Confirm delete operation</span
      ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-product-heading" v-text="$t('crudApp.product.delete.question', { id: removeId })">
          Are you sure you want to delete this Product?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProduct()">Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-product"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeProduct()"
        >
          Delete
        </button>
      </div>
    </b-modal>

    <b-modal ref="removeEntityCategory" id="removeEntityCategory">
      <span slot="modal-title"
      ><span
        id="crudApp.productCategory.delete.question"
        data-cy="productCategoryDeleteDialogHeading"
        v-text="$t('entity.delete.title')"
      >Confirm delete operation</span
      ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-productCategory-heading"
           v-text="$t('crudApp.productCategory.delete.question', { id: removeId })">
          Are you sure you want to delete this Product Category?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCategory()">Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-product-category"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeProductCategory()"
        >
          Delete
        </button>
      </div>
    </b-modal>

    <b-modal ref="removeEntityComment" id="removeEntityComment">
      <span slot="modal-title"
      ><span
        id="crudApp.productComment.delete.question"
        data-cy="productCommentDeleteDialogHeading"
        v-text="$t('entity.delete.title')"
      >Confirm delete operation</span
      ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-productComment-heading" v-text="$t('crudApp.productComment.delete.question', { id: removeId })">
          Are you sure you want to delete this Product Comment?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialogProductComment()">Cancel</button>
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


    <!--      Modal for CREATING And for EDITING-->

    <b-modal ref="createOrEditEntityProduct" id="createOrEditEntityProduct">
      <div class="form-group" v-if="product.id">
        <label for="id" v-text="$t('global.field.id')">ID</label>
        <input type="text" class="form-control" id="id" name="id" v-model="product.id" readonly/>
      </div>

      <div>
        <div>
          <div class="form-group">
            <label class="form-control-label" for="product-productName"
            >Product Name</label
            >
            <input
              type="text"
              class="form-control"
              name="productName"
              id="product-productName"
              data-cy="productName"
              v-model="product.productName"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.product.productCode')"
                   for="product-productCode"
            >Product Code</label
            >
            <input
              type="text"
              class="form-control"
              name="productCode"
              id="product-productCode"
              data-cy="productCode"
              :class="{ valid: !$v.product.productCode.$invalid, invalid: $v.product.productCode.$invalid }"
              v-model="product.productCode"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.product.productPrice')"
                   for="product-productPrice"
            >Product Price</label
            >
            <input
              type="number"
              class="form-control"
              name="productPrice"
              id="product-productPrice"
              data-cy="productPrice"
              v-model.number="product.productPrice"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.product.productCategory')"
                   for="product-productCategory"
            >Product Category</label
            >
            <select
              class="form-control"
              id="product-productCategory"
              data-cy="productCategory"
              name="productCategory"
              v-model="product.productCategoryName"
              required
            >
              <option v-if="!product.productCategoryId" v-bind:value="null" selected></option>
              <option
                v-bind:value="
                  product.productCategoryId && productCategoryOption.id === product.productCategoryId
                    ? product.productCategoryId
                    : productCategoryOption
                "
                v-for="productCategoryOption in productCategoriesAll"
                :key="productCategoryOption.productCategoryName"
              >
                {{ productCategoryOption.id }}
              </option>
            </select>
          </div>

        </div>
      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCreate()">Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-create-product"
          data-cy="entityCreateButton"
          v-text="$t('entity.action.save')"
          :disabled="$v.product.productName.$invalid || isSaving"
          v-on:click="saveProduct()">
          Create
        </button>
      </div>

    </b-modal>

    <b-modal ref="createOrEditEntityProductCategory" id="createOrEditEntityProductCategory">
      <div class="form-group" v-if="productCategory.id">
        <label for="id" v-text="$t('global.field.id')">ID</label>
        <input type="text" class="form-control" id="id" name="id" v-model="productCategory.id" readonly/>
      </div>

      <div>
        <div>
          <div class="form-group">
            <label class="form-control-label" for="product-category-productName"
            >ProductCategory Name</label
            >
            <input
              type="text"
              class="form-control"
              name="productCategoryName"
              id="product-category-productName"
              data-cy="productCategoryName"
              v-model="productCategory.productCategoryName"
            />
          </div>

        </div>
      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCategoryCreate()">Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-create-product"
          data-cy="entityCreateButton"
          v-text="$t('entity.action.save')"
          v-on:click="saveProductCategory()">
          Create
        </button>
      </div>

    </b-modal>

    <b-modal ref="createOrEditEntityProductComment" id="createOrEditEntityProductComment">
      <div class="form-group" v-if="productComment.id">
        <label for="id" v-text="$t('global.field.id')">ID</label>
        <input type="text" class="form-control" id="id" name="id" v-model="productComment.id" readonly/>
      </div>

      <div>
        <div>
          <div class="form-group">
            <label class="form-control-label" for="product-comment-productName"
            >Product Comment</label
            >
            <input
              type="text"
              class="form-control"
              name="productName"
              id="product-comment-productName"
              data-cy="productName"
              v-model="productComment.productComment"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.productComment.author')"
                   for="author"
            >Author</label
            >
            <input
              type="text"
              class="form-control"
              name="productCode"
              id="author"
              data-cy="productCode"
              v-model="productComment.author"
            />
          </div>

          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.productComment.commentTitle')"
                   for="product-comment-title"
            >Product Price</label
            >
            <input
              type="text"
              class="form-control"
              name="productPrice"
              id="product-comment-title"
              data-cy="productPrice"
              v-model.number="productComment.commentTitle"
            />
          </div>



          <div class="form-group">
            <label class="form-control-label" v-text="$t('crudApp.productComment.product')"
                   for="products-select"
            >Product </label
            >
            <select
              class="form-control"
              id="products-select"
              data-cy="productCategory"
              name="productCategory"
              v-model="productComment.product"
              required
            >
              <option v-if="!productComment.product" v-bind:value="null" selected></option>
              <option
                v-bind:value="
                  productComment.product && productCategoryOption.id === productComment.product.id
                    ? productComment.product
                    : productCategoryOption
                "
                v-for="productCategoryOption in productsAll"
                :key="productCategoryOption.id"
              >
                {{ productCategoryOption.productName }}
              </option>
            </select>
          </div>

        </div>

      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCommentCreate()">Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-create-product"
          data-cy="entityCreateButton"
          v-text="$t('entity.action.save')"
          v-on:click="saveComment()">
          Create
        </button>
      </div>

    </b-modal>



    <!--      VIEW MODAL-->

    <b-modal ref="viewEntityProduct" id="viewEntityProduct">
      <span slot="modal-title"
      ><span
      >Your  product </span
      ></span
      >
      <div>
        <dl class="row jh-entity-details">

          <dt>
            <span>Product ID:</span>
          </dt>
          <dd>
            <span>{{ product.id }}</span>
          </dd>

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
            <div v-if="product.productCategoryId">
              <router-link
                :to="{ name: 'ProductCategoryView', params: { productCategoryId: product.productCategoryId } }">{{
                  product.productCategoryName
                }}
              </router-link>
            </div>
          </dd>
        </dl>
      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductView(),handleSyncList()">Cancel
        </button>

      </div>

    </b-modal>

    <b-modal ref="viewEntityProductCategory" id="viewEntityProductCategory">
      <span slot="modal-title"
      ><span
      >Your  product </span
      ></span
      >
      <div>
        <dl class="row jh-entity-details">

          <dt>
            <span>ProductCategory ID:</span>
          </dt>
          <dd>
            <span>{{ productCategory.id }}</span>
          </dd>

          <dt>
            <span >product Category Name</span>
          </dt>
          <dd>
            <span>{{ productCategory.productCategoryName }}</span>
          </dd>
        </dl>
      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCategoryView(),handleSyncList()">Cancel
        </button>

      </div>

    </b-modal>

    <b-modal ref="viewEntityProductComment" id="viewEntityProductComment">
      <span slot="modal-title"
      ><span
      >Your  product Comment </span
      ></span
      >
      <div>
        <dl class="row jh-entity-details ">

          <dt>
            <span>ProductComment ID:</span>
          </dt>
          <dd>
            <span>{{ productComment.id }}</span>
          </dd>

          <dt>
            <span >product Comment </span>
          </dt>
          <dd>
            <span>{{ productComment.productComment }}</span>
          </dd>
          <dt>
            <span >product Comment author</span>
          </dt>
          <dd>
            <span>{{ productComment.author }}</span>
          </dd>
          <dt>
            <span >product Comment title</span>
          </dt>
          <dd>
            <span>{{ productComment.commentTitle }}</span>
          </dd>
          <dt>
            <span>Product </span>
          </dt>
          <dd>
            <div v-if="productComment.productId">
              <span>
                  {{productComment.productName}}
              </span>
            </div>
          </dd>
        </dl>
      </div>

      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')"
                v-on:click="closeDialogProductCommentView(),handleSyncList()">Cancel
        </button>

      </div>

    </b-modal>




  </div>



</template>


<script lang="ts" src="./all-product.component.ts"></script>
