<template lang="pug">
  //- maybe add a sidebar which shows the number of each style and types of furniture that the user has picked
  v-container
    v-layout(row wrap v-if="!userFavorites.length")
      v-flex(xs12)
        h1.text-xs-center You have no favorites currently. Go and add some!
    v-layout.mt-5(row v-else)
      v-flex(xs12)
        h1.text-xs-center Favorited: {{userFavorites.length}}
    v-layout.grid
      v-flex(v-for="product in allProducts" :key="product.title" v-if="userFavorites.includes(product.id)").item
        v-card(hover)
          v-card-media(style="cursor: pointer;" @mousedown.native="onMousedown" @click="goToProduct(product.id)" :src="product.imageUrl" height="200px" min-width="100px").item-content
          v-card-text.text-xs-center {{product.id}}
</template>

<script>
export default {
  data() {
    return {
      mousedownX: '',
      mousedownY: '',
      drag: false,
      cards: null,
      storedCards: null,
      orderedCards: null
    }
  },
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
    allProducts() {
      // local storage solution to save order of rearranged tiles is partially working
      // if Muuri throws an error when 'allProductsFiltered' is put in, go back to 'allProducts'
      // need to find a way to add the title back and figure out why all favorites aren't rendered when favorited
      return this.$store.getters.allProductsFiltered
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  mounted() {
    const grid = document.querySelector('.grid')
    this.cards = new Muuri(grid, {
      layoutDuration: 300,
      layoutEasing: 'ease',
      dragEnabled: true,
      dragSortInterval: 0,
      dragReleaseDuration: 400,
      dragReleaseEasing: 'ease-out'
    })
    const items = document.querySelectorAll('.item')
    items.forEach(el => el.addEventListener('mouseup', (event) => {
      if (this.mousedownX !== event.clientX || this.mousedownY !== event.clientY) {
        this.drag = true
      }
    }))
  },
  methods: {
    onMousedown(e) {
      this.drag = false
      this.mousedownX = e.clientX
      this.mousedownY = e.clientY
    },
    goToProduct(id) {
      if (!this.drag) {
        this.$store.dispatch('loadProduct', id)
        this.$router.push('/products/' + id)
      } else {
        this.orderedCards = Array.from(this.cards.getItems().map(el => el._element.textContent)) 
        localStorage.setItem('cards', JSON.stringify(this.orderedCards))
      }
    },
  },
  beforeMount() {
    this.$store.dispatch('loadAllProducts')
    this.storedCards = JSON.parse(localStorage.getItem('cards'))
    this.$store.dispatch('filterAllProducts', this.storedCards)
  }
}
</script>

<style>
  /* #wrapper {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 2em;
  } */

  .grid {
    position: relative;
  }

  .item {
    position: absolute;
    display: flex;
    z-index: 1;
  }

  .item.muuri-item-dragging {
    z-index: 3;
    border: 2px solid salmon;
  }

  .item.muuri-item-releasing {
    z-index: 2;
  }

  .item.muuri-item-hidden {
    z-index: 0;
  }

  .item-content {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .item.muuri-item-dragging .item-content {
    z-index: 3;
  }

  .item.muuri-item-releasing .item-content {
    z-index: 2;
  }

  @media screen and (max-width: 1300px) {
    .container {
      max-width: 1600px;
    }

    .item {
      margin: 0;
      width: 30vw;
    }
  }

  @media screen and (max-width: 1000px) {
    .item {
      margin: 0;
      width: 45vw;
    }
  }

  @media screen and (max-width: 600px) {
    /* #wrapper {
      display: grid;
      grid-template-columns: 100%;
      grid-gap: 1em;
    } */

    .item {
      width: 80vw;
    }
  }
</style>
