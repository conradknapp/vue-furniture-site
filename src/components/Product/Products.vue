<template lang="pug">
  v-container(fluid grid-list-md class="deep-purple darken-2")
    v-layout(row wrap)
      v-flex(v-bind="{ [`xs${product.flex}`]: true }" v-for="product in products" :key="product.title")
        v-card
          v-card-media(:src="product.imageUrl" height="200px")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(class="headline white--text" v-text="product.title")
          v-card-actions(class="white")
            v-btn(flat :to="'/products/' + product.id") See More
              v-icon arrow_forward
            v-spacer
            v-btn(icon @click="onFavorite")
              v-icon favorite
</template>

<script>
export default {
  computed: {
    products() {
      return this.$store.getters.getProductsWithFlexProperty
    }
  },
  methods: {
    onFavorite() {
      console.log('heart!!!')
    }
  }
 }
</script>