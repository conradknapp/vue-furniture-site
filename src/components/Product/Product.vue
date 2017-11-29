<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(xs12)
        v-card
          v-card-title
            h1.primary--text {{product.title}}
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
    }
  }
}
</script>
