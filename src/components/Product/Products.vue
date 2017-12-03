<template lang="pug">
  v-container(grey fluid grid-list-md)#top
    v-layout(row wrap)
      v-flex(d-flex v-bind="{ [`xs${product.flex}`]: true }" v-for="product in products" :key="product.title")
        v-card.mt-2.ml-1.mb-2.mr-2(hover)
          v-card-media(:src="product.imageUrl" :key="product.id" @click="goToProduct(product.id)" tag="button" height="200px")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(v-text="product.title")#span.hidden-xs-only.headline
          v-card-actions
            v-btn(raised dark color="purple darken-4" :to="'/products/' + product.id") See Info
              v-icon arrow_forward
            v-spacer
            v-btn(icon)
              v-icon(color="red darken-2") favorite_outline
            v-btn(icon)
              v-icon(color="blue darken-3") bookmark_outline
            v-btn(icon)
              v-icon(color="purple") share
    v-layout(v-if="pageUpButton")
      v-flex#btn-container
        v-btn(color="grey darken-2" @click="backToTop" absolute dark fixed bottom fab)#btn
          v-icon navigation
    v-layout
      v-flex(xs12).text-xs-center
        v-progress-circular(indeterminate color="orange darken-3" :width="7" :size="70" height="200px" v-if="loading")
</template>

<script>
export default {
  data() {
    return {
      scrollY: '',
      pageUpButton: false
    }
  },
  computed: {
    products() {
      return this.$store.getters.loadedProducts
    },
    loading() {
      return this.$store.getters.loading
    }
  },
  created() {
      window.addEventListener('scroll', () => {
        this.scrollY = scrollY
      })
      window.addEventListener('scroll', this.onPageBottom)
  },
  destroyed() {
    window.removeEventListener('scroll', this.onPageBottom);
  },
  methods: {
    backToTop() {
      window.scroll({top: 0, left: 0, behavior: 'smooth' })
    },
    goToProduct(id) {
      this.$router.push('/products/' + id)
    },
    onPageBottom() {
      if (window.scrollY === document.body.scrollHeight - window.innerHeight) {
        this.$store.dispatch('infiniteScroll')
      }
    }
  }
  // created() {
  //   /* create watcher instead of global event listener*/
  //   window.addEventListener('scroll', () => {
  //     if (window.scrollY === document.body.scrollHeight - window.innerHeight) {
  //       this.$store.dispatch('getDataset2')
  //     }
  //   })
  // }
 }
</script>

<style>
  #span {
    font-family: sans-serif;
    font-weight: 100;
    padding: 3px 10px;
    position: relative;
    display: inline-block;
    color: white;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
  }

  #span:hover {
    background-color: rgba(74, 20, 140, 0.4);
    transition-duration: 0.3s;
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