<template lang="pug">
  //- maybe add a sidebar which shows the number of each style and types of furniture that the user has picked
  v-container
    v-layout(row wrap v-if="userFavorites.length === 0")
      v-flex(xs12)
        h1 You have no favorites currently. Go and add some!
    v-layout.mt-5(row else)
      v-flex(xs12)
        h1 Favorited: {{userFavorites.length}}
    v-layout(d-flex row wrap)
      v-flex(v-for="product in products" :key="product.title" v-if="userFavorites.includes(product.id)")
        v-card
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
      return this.$store.getters.loadedProducts
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    goToProduct(id) {
      this.$router.push('/products/' + id)
     }
  }
}
</script>