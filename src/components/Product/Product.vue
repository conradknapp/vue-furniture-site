<template lang="pug">
  v-container(flexbox center).mt-5.mb-5
    v-layout(row wrap v-if="loading")
      v-flex(xs12 class="text-xs-center")
        v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
    v-layout(row wrap v-if="!loading")
      v-flex(xs12)
        v-card(hover)
          v-card-title
            h1.Product__Title {{product.title}}
            v-spacer
            v-btn(icon dark color="indigo" @click="navBack")
              v-icon arrow_back
            template(v-if='userIsCreator')
              v-spacer
              app-edit-product-details-dialog(:product="product")
          v-tooltip(right)
            span Click to enlarge image
            v-card-media(slot="activator" @click="togglePictureDialog" :src="product.imageUrl" style='height: 200px; width: 100%; object-fit: contain')#media
              heart-flutter(v-if="unAuthFave && !isAnimating")#heart-flutter
              heart-flutter(v-if="heartLoading && !isAnimating")#heart-flutter
              v-btn(icon x-large v-if="userIsAuthenticated && !userIsCreator" @mouseenter="mouseEnterHeart = true" @mouseleave="mouseEnterHeart = false" @click="onAgree")
                v-icon(color="red darken-4" x-large v-if="onProductLiked") favorite
                v-icon(color="white" x-large v-else) favorite
              v-btn(icon x-large v-if="!userIsAuthenticated" @click="onUnAuthFave")
                v-icon(x-large color="white") favorite
          v-dialog(v-model="dialog")
            v-card
              v-card-media(:src="product.imageUrl" height="500px")
          v-card-text
            p {{product.description}}
          v-card-actions
            v-btn(flat dark round class="deep-purple darken-2" :href="link.linkUrl" v-for="link in product.links" :key="link.linkTitle") {{link.linkTitle}}
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      unAuthFave: false,
      mouseEnterHeart: false,
      isAnimating: false
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
    },
    allProducts() {
      return this.$store.getters.allProducts
    }
  },
  methods: {
    onAgree() {
      if (this.onProductLiked) {
        if (window.scrollY > 25) {
         this.isAnimating = true 
        }
        this.$store.dispatch('unfavoriteProduct', this.product.id)
      } else {
        if (window.scrollY > 25) {
          this.isAnimating = true
        }
        this.$store.dispatch('favoriteProduct', this.product.id)
      }
    },
    onUnAuthFave() {
      if (scrollY > 25) {
       this.isAnimating = true
       this.unAuthFave = true 
      }
      this.unAuthFave = true
      setTimeout(() => this.$router.push('/signup'), 1000)
      setTimeout(() => this.$store.dispatch('unAuthUserClick', {message: `Sign up to save all your favorites 💖`, submessage: `(it only takes a second ⏱)`, icon: 'info', color: "info"}), 1500)
    },
    togglePictureDialog() {
      if (window.innerWidth > 500 && !this.unAuthFave && !this.mouseEnterHeart) {
        this.dialog = !this.dialog
      }
    },
    navBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  #heart-flutter {
    transform: translateY(-100px);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index:99;
  }

  @media screen and (min-width: 350px) {
    #media {
      height: 180px !important;
    }
  }

  @media screen and (min-width: 400px) {
    #media {
      height: 230px !important;
    }
  }

  @media screen and (min-width: 550px) {
    #media {
      height: 300px !important;
    }
  }

  @media screen and (min-width: 630px) {
    #media {
      height: 400px !important;
    }
  }

  @media screen and (min-width: 800px) {
    #media {
      height: 500px !important;
    }
  }
</style>