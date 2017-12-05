<template lang="pug">
  v-container
    v-layout(row wrap v-if="loading")
      v-flex(xs12).text-xs-center
        v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
    v-layout(row wrap v-else).pt-3
      v-flex(xs12)
        v-card(hover)
          v-card-title
            h1.purple--text {{product.title}}
            template(v-if='userIsCreator')
              v-spacer
              app-edit-product-details-dialog(:product="product")
          v-card-media(@click="dialog = !dialog" :src="product.imageUrl" height="300px")
          v-dialog(v-model="dialog").hidden-md-and-down
            v-card
              v-card-media(:src="product.imageUrl" height="500px")
          v-card-text
            v-chip.mb-4(color="orange darken-3" text-color="white" v-for="p in product.categories" :key="p") {{p}}
              v-icon(right) label
            h3.mb-4.ml-2 {{product.description}}
            v-btn(flat dark round class="deep-purple darken-2" :href="link.linkUrl" v-for="link in product.links" :key="link.linkTitle") {{link.linkTitle}}
            v-btn(icon v-if="userIsAuthenticated && !userIsCreator" @click="onAgree")
              v-icon(color="red darken-2" v-if="onProductLiked") favorite
              v-icon(color="red darken-2" v-else) favorite_border
            v-btn(icon v-if="!userIsAuthenticated" @click="onUnAuthFave")
              v-icon(color="red darken-2") favorite_border
            heart-flutter(v-if="unAuthFave")#heart-flutter
            heart-flutter(v-if="heartLoading")#heart-flutter
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      unAuthFave: false
    }
  }, 
  computed: {
    product() {
      return this.$store.getters.loadedProduct(this.id)
    },
    loading() {
      return this.$store.getters.loading
    },
    heartLoading() {
      return this.$store.getters.heartLoading
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
    },
    onProductLiked() {
      return this.$store.getters.user.favoritedProducts.includes(this.product.id)
    }
  },
  methods: {
    onAgree() {
      if (this.onProductLiked) {
        this.$store.dispatch('unfavoriteProduct', this.product.id)
      } else {
        this.$store.dispatch('favoriteProduct', this.product.id)
      }
    },
    onUnAuthFave() {
      this.unAuthFave = true
      setTimeout(() => this.$router.push('/signup'), 750)
      setTimeout(() => this.$store.dispatch('unAuthUserClick', {message: `Sign up to save all your favorites`, submessage: `(it only takes a second)`}), 1500)
    }
  }
}
</script>

<style>
  #heart-flutter {
    transform: translate(162px, -74px);
    cursor: pointer;
  }

  h1 {
    font-family: sans-serif
  }

  h3 {
    font-weight: 400;
  }
</style>