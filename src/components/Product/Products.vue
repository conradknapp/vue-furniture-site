<template lang="pug">
  v-container(grey lighten-2 fluid grid-list-md).pt-5.mt-5
    v-layout(row wrap v-if='!loading').hidden-xs-only
      v-flex(xs12)
        v-tooltip(bottom)
          span Row layout
          v-btn(icon slot="activator" @click="flag = false")
            v-icon(:color="flag === false ? 'purple' : ''") view_headline
        v-tooltip(bottom)
          span Mozaic layout
          v-btn(icon slot="activator" @click="flag = true")
            v-icon(:color="flag === true ? 'purple' : ''") view_quilt
    v-layout(row wrap)
      v-flex(d-flex v-bind="{ [`xs${flag ? product.flex : 12}`]: true }" v-for="product in products" :key="product.id" hover @mouseenter="revealDescription(product)" @mouseleave="description = false")
        v-card.mt-3.ml-1.mr-2(hover)
          v-card-media(lazy :src="product.imageUrl" :key="product.id" @click="goToProduct(product.id)" tag="button" :height="height")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(v-text="product.title")#title.hidden-xs-only.headline
                  span(v-if="product.description === description" v-text="description")#description
                  div#favorite
                    v-btn(icon large v-if="userIsAuthenticated" @mouseenter="mouseEnterHeart = true" @mouseleave="mouseEnterHeart = false" @click="onAgree(product)")
                      v-icon(color="red darken-4" x-large v-if="userFavorites.includes(product.id)") favorite
                      v-icon(color="red darken-4" x-large v-else) favorite_border
                    v-btn(icon large v-if="!userIsAuthenticated" @click="onUnAuthFave")
                      v-icon(color="red darken-4" x-large) favorite_border
    v-layout(v-if="pageUpButton")
      v-flex#btn-container
        v-btn(color="grey darken-2" @click="backToTop" absolute dark fixed bottom fab)#btn
          v-icon navigation
    v-layout.pb-2
      v-flex(xs12).text-xs-center
        v-progress-circular(indeterminate color="orange darken-3" :width="7" :size="70" v-if="loading")
    //- v-layout(v-if="!loading && resultsLog")
    //-   v-flex(xs12).text-xs-center
    //-     h1 {{resultsLog}}
    //-       v-icon.ml-3(large right) sentiment_very_dissatisfied
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      scrollY: '',
      flag: false,
      pageUpButton: false,
      description: '',
      mouseEnterHeart: false,
      unAuthFave: false,
      row: null,
      bottom: false
    }
  },
  computed: {
    height() {
      if (this.flex === 12) return '300px'
      else return '250px'
    },
    products() {
      return [...new Set(this.$store.getters.getProductsWithFlexProperty)]
      // return _.uniq(this.$store.getters.loadedProducts)
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
    onProductLiked(product) {
      return this.$store.getters.user.favoritedProducts.includes(product.id)
    },
    userFavorites() {
      return this.$store.getters.user.favoritedProducts
    },
    resultsLog() {
      return this.$store.getters.resultsLog
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) this.$store.dispatch('infiniteScroll')
    }
  },
  created() {
      window.addEventListener('scroll', () => {
        this.scrollY = scrollY
        if (this.scrollY > 150) {
          this.pageUpButton = true
        } else {
          this.pageUpButton = false
        }
      })
      window.addEventListener('scroll', () => {
        this.bottom = this.bottomVisible()
      })
      this.$store.dispatch('infiniteScroll')
  },
  methods: {
    backToTop() {
      window.scroll({top: 0, left: 0, behavior: 'smooth' })
    },
    goToProduct(id) {
      if (!this.unAuthFave && !this.mouseEnterHeart) {
      this.$router.push('/products/' + id)
      }
    },
    bottomVisible() {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    revealDescription(product) {
      if (this.products.find(el => el.id === product.id))
        this.description = product.description
    },
    onUnAuthFave() {
      this.unAuthFave = true
      setTimeout(() => this.$router.push('/signup'), 1000)
      setTimeout(() => this.$store.dispatch('unAuthUserClick', {message: `Sign up to save all your favorites`, submessage: `(it only takes a second)`, icon: 'info', color: "info"}), 1500)
    },
    onAgree(product) {
      if (this.userFavorites.includes(product.id)) {
        this.$store.dispatch('unfavoriteProduct', product.id)
      } else {
        this.$store.dispatch('favoriteProduct', product.id)
      }
    }
  }
}
</script>

<style>
  #title {
    font-family: sans-serif;
    font-weight: 100;
    padding: 3px 10px;
    position: relative;
    display: inline-block;
    color: white;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
  }

  #title:hover {
    background-color: rgba(74, 20, 140, 0.4);
    transition-duration: 0.3s;
  }

   #description {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-family: sans-serif;
    font-weight: 100;
    font-size: 16px;
    padding: 1rem;
    text-align: center;
    pointer-events: none;
    animation: revealDiv 0.2s ease-in;
  }

  #favorite {
    position: absolute;
    top: 17px;
    right: 10px;
    z-index: 1;
  }

  @keyframes revealDiv {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 0.75;
    }

    100% {
      opacity: 1;
    }
  }

  #btn-container {
    display: flex;
    flex-direction: column;
  }

  #btn {
    align-self: flex-end;
    transform: translate(0px, -30px);
    animation: buttonReveal 0.5s cubic-bezier(.25,.8,.5,1);
  }

  .gradient-btn {
    margin: -1px;
    padding: 0;
    border-radius: 0px;
  }

  img {
    padding-right: 10px;
    padding-bottom: 2px;
  }

@keyframes buttonReveal {
  0% {
    opacity: 0;
    transform: scale(0) translate(0px, -30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(0px, -30px);
  }
}
</style>