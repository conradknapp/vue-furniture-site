<template lang="pug">
  v-container(class="text-xs-center")
    v-layout(row wrap v-if="!userFavorites.length")
      v-flex(xs12)
        h1 You have no favorites currently. Go and add some!
    v-layout(row v-else class="mt-5")
      v-flex(xs12)
        h1 Favorited: {{userFavorites.length}}
    v-layout(class="wrapper")
      v-flex(v-for="product in products" :key="product.title" v-if="userFavorites.includes(product.id)")
        v-card(hover)
          v-card-media(style="cursor: pointer;" @click="goToProduct(product.id)" :src="product.imageUrl" height="200px" min-width="100px")
          v-card-text {{product.title}}
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user
    },
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.loading
    },
    userFavorites() {
      return this.$store.getters.user.favoritedProducts
    },
    products() {
      return this.$store.getters.allProducts
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  created() {
    this.$store.dispatch('loadAllProducts')
  },
  methods: {
    goToProduct(id) {
      this.$store.dispatch('loadProduct', id)
      this.$router.push(`/products/${id}`)
    }
  }
}
</script>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1em;
  }

  @media screen and (min-width: 500px) {
    .wrapper {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
