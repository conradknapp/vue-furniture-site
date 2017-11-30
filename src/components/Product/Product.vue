<template lang="pug">
  v-container
    v-layout(row wrap v-if="loading")
      v-flex(xs12).text-xs-center
        v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
    v-layout(row wrap v-else)
      v-flex(xs12)
        v-card
          v-card-title
            h1.primary--text {{product.title}}
            template(v-if='userIsCreator')
              v-spacer
              app-edit-product-details-dialog(:product="product")
          v-card-media(:src="product.imageUrl" height="400px")
          v-card-text
            h2.info--text(v-for="p in product.categories") {{p}}
            p {{product.description}}
            v-btn(flat dark class="deep-purple darken-2" :href="link.linkUrl" v-for="link in product.links" :key="link.linkTitle") {{link.linkTitle}}
            v-btn(icon)
              v-icon favorite
</template>

<script>
export default {
  props: ['id'],
  computed: {
    product() {
      return this.$store.getters.loadedProduct(this.id)
    },
    loading() {
      return this.$store.getters.loading
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null &&
      this.$store.getters.user !== undefined
    },
    userIsCreator() {
      if (!this.userIsAuthenticated) {
        return false
      }
      return this.$store.getters.user.id === this.product.creatorId
    }
  }
}
</script>
