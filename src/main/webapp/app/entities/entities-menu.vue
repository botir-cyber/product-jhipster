<template>
  <div>
    <b-dropdown-item to="/product">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.product')">Product</span>
    </b-dropdown-item>
    <b-dropdown-item to="/product-category">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.productCategory')">Product Category</span>
    </b-dropdown-item>
    <b-dropdown-item to="/product-comment">
      <font-awesome-icon icon="asterisk" />
      <span v-text="$t('global.menu.entities.productComment')">Product Comment</span>
    </b-dropdown-item>
    <b-dropdown-item to="/all-product">
      <font-awesome-icon icon="asterisk" />
      <span > AllProduct</span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts">export default {
  components: {}
}
</script>
