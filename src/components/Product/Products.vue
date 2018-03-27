<template lang="pug">
  v-container(grey lighten-2 grid-list-md).pt-5.mt-5
    v-layout(row wrap class="hidden-xs-only")
      v-flex(xs12)
        v-tooltip(bottom)
          span Row layout
          v-btn(icon slot="activator" @click="layoutButtonActive = false")
            v-icon(:color="!layoutButtonActive ? 'purple darken-3' : ''") view_headline
        v-tooltip(bottom)
          span Mozaic layout
          v-btn(icon slot="activator" @click="layoutButtonActive = true")
            v-icon(:color="layoutButtonActive ? 'purple darken-3' : ''") view_quilt
    v-layout(row wrap)
      v-flex(xs12 v-bind="{ [`sm${layoutButtonActive ? product.flex : 6}`]: true }" v-for="product in products" :key="product.id" hover @mouseenter="showDescription(product)" @mouseleave="description = null")
        v-card.mt-3.ml-1.mr-2(hover)
          v-card-media(lazy :src="product.imageUrl" :key="product.id" @click="goToProduct(product.id)" tag="button" height="40vh")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(v-text="product.title" class="Product__Title").headline
                  span(v-if="product.description === description" v-text="showFirstSentence(description)" class="Product__Description")
                  div
                    v-btn(icon x-large v-if="userIsAuthenticated" @mouseenter="mouseInHeart = true" @mouseleave="mouseInHeart = false" @click="toggleLike(product)")
                      v-icon(color="red darken-4" x-large v-if="userFavorites.includes(product.id)") favorite
                      v-icon(color="grey" x-large v-else) favorite
                    v-btn(icon x-large v-if="!userIsAuthenticated" @click="onUnAuthFave")
                      v-icon(color="red darken-4" x-large) favorite
    v-layout(v-if="pageUpButtonVisible")
      v-flex
        v-btn(color="grey darken-2" @click="backToTop" dark fixed bottom right fab)
          v-icon navigation
    product-skeleton(v-show="loading && !bottom")
    v-layout(v-if="!loading && resultsLog")
      v-flex(xs12 class="text-xs-center mt-5 mb-5")
        h1 You have reached the end
          v-icon.ml-3(large right) sentiment_very_dissatisfied
</template>

<script>
import throttle from 'lodash/throttle'
export default {
  data() {
    return {
      layoutButtonActive: false,
      pageUpButtonVisible: false,
      description: null,
      mouseInHeart: false,
      unAuthFave: false,
      bottom: false
    }
  },
  computed: {
    products() {
      return this.$store.getters.getProductsWithFlexProperty
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
    },
    userFavorites() {
      return this.$store.getters.user.favoritedProducts
    },
    resultsLog() {
      return this.$store.getters.resultsLog
    }
  },
  watch: {
    bottom(bottomOfPage) {
      if (bottomOfPage && !this.resultsLog) {
        const throttled = throttle(this.infiniteScroll, 500);
        throttled();
      }
    }
  },
  created() {
    window.addEventListener('scroll', () => {
      window.scrollY > 150 ? 
        this.pageUpButtonVisible = true : this.pageUpButtonVisible = false
    })
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.$store.dispatch('setResultsLog', false)
  },
  methods: {
    infiniteScroll() {
      this.$store.dispatch('infiniteScroll')
    },
    backToTop() {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    },
    goToProduct(id) {
      if (!this.unAuthFave && !this.mouseInHeart) {
        this.$router.push(`/products/${id}`)
      }
    },
    bottomVisible() {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    showDescription(product) {
      if (this.products.find(el => el.id === product.id)) {
        this.description = product.description
      }
    },
    onUnAuthFave() {
      this.unAuthFave = true
      setTimeout(() => this.$router.push('/signup'), 1000)
      setTimeout(() => this.$store.dispatch('unAuthUserClick', {message: `Sign up to save all your favorites 💖`, submessage: `(it only takes a second ⏱)`, icon: 'info', color: "info"}), 1500)
    },
    toggleLike(product) {
      if (this.userFavorites.includes(product.id)) {
        this.$store.dispatch('unfavoriteProduct', product.id)
      } else {
        this.$store.dispatch('favoriteProduct', product.id)
      }
    },
    showFirstSentence(description) {
      return description.match(/^[^.]+/)[0]
    }
  }
}
</script>

<style>
  .Product__Title {
    color: white;
    background: rgba(0,0,0,0.3);
    font-weight: 400;
    padding: 0.1em;
  }

  .Product__Title:hover {
    background: rgba(87, 6, 104, 0.3);
  }

  .Product__Description {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 1.1rem;
    padding: 1em;
    text-align: center;
    pointer-events: none;
    animation: showDescription 0.1s ease-in-out forwards;
  }

  .Product__Description:hover {
    background-color: rgba(74, 20, 140, 0.4);
  }

  @keyframes showDescription {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }

    50% {
      opacity: 0.75;
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
</style>