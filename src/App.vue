<template lang="pug">
  v-app(class="orange")
    v-navigation-drawer(app temporary fixed v-model="sideNav")
      v-list
        v-list-tile(v-for="item in menuItems" :key="item.title" :to="item.link")
          v-list-tile-action
            v-icon {{item.icon}}
          v-list-tile-content {{item.title}}
        v-list-tile(v-if="userIsAuthenticated" @click="onLogout")
          v-list-tile-action
            v-icon exit_to_app
          v-list-tile-content Logout
    v-toolbar(scroll-off-screen :scroll-threshold="500" fixed dark class="deep-purple darken-2")
      v-toolbar-side-icon(@click.native.stop="sideNav = !sideNav")
      v-toolbar-title
        router-link(to="/" tag="span" style="cursor: pointer") MCM
      v-text-field(@blur="searchInput = ''" flex color="pink lighten-1" width="30vw" prepend-icon="search" placeholder="Search styles" v-model="searchInput" @input="onSearch" single-line hide-details).ml-4.mr-2
      v-card(dark v-if="searchResults" id="Card__Search")
        v-list
          v-list-tile(@click="goToResult(result.id)" v-for="result in searchResults" :key="result.title")
            v-list-tile-title(v-html="`${result.title}`") 
            v-list-tile-action(v-if="userIsAuthenticated && userFavorites.includes(result.id)") 
              v-icon favorite
      v-toolbar-items(class="hidden-xs-only")
        v-btn(flat router @click="reloadProducts")
          v-icon(left class="hidden-sm-only") weekend
          | Products
        v-btn(flat @mouseenter="showFave = true" @mouseleave="showFave = false" @click="goToProfile" v-if="userIsAuthenticated")
          v-badge(color="blue" :class="{ 'animate': isAnimated }")
            span(slot="badge" v-if="badgeNumber") {{badgeNumber}}
            v-icon(left class="hidden-sm-only") account_box
            | Profile
        v-layout
          v-flex
            v-card(v-if="showFave && userIsAuthenticated" @mouseover="showFave = true" @mouseleave="showFave = false" id="Card__Favorites")
              v-list(three-line).mt-2
                v-list-tile(v-if="showFave && userFavorites.includes(product.id)" v-for="product in allProducts" :key="product.title").ml-1.mb-3
                  v-list-tile-content(@click="goToResult(product.id)" class="Card__Favorites--Image__Container")
                    img(:src="product.imageUrl" class="Card__Favorites--Image")
        v-btn(flat v-if="userIsAuthenticated" @click="onLogout")
          v-icon(left class="hidden-sm-only") exit_to_app
          | Logout
    main
      router-view
</template>

<script>
import { sanitize } from 'dompurify'

export default {
  data() {
    return {
      sideNav: false,
      searchInput: '',
      showFave: false,
      isAnimated: false,
      badge: null
    }
  },
  computed: {
    menuItems() {
      let menuItems = [
        { icon: 'weekend', title: 'Products', link: '/products' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link:  '/signup' }
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          { icon: 'weekend', title: 'Products', link: '/products' },
          { icon: 'account_box', title: 'Profile', link: '/profile' }
        ]
      }
      if (this.userIsAuthenticated && this.userIsAdmin) {
        menuItems = [
          { icon: 'stars', title: 'Create Product', link: '/product/new'  }
        ]
      }
      return menuItems
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userIsAdmin() {
      return this.$store.getters.user.id === "EkW5ynXnGRUaUrxDZU2m67j5oj32"
    },
    badgeNumber() {
      this.badge = this.$store.getters.user.favoritedProducts.length 
      return this.badge
    },
    searchResults() {
      if (!this.searchInput) {
        return
      } else if (!this.$store.getters.searchResults.length) {
        return [{title: `No results for ${this.searchInput}`, description: ''}]
      } else {
        return this.$store.getters.searchResults.map(el => {
          let regex = new RegExp(this.searchInput, 'gi');
          let newTitle = el.title.replace(regex, sanitize(`<span class="SearchTerm__Highlight">${this.searchInput}</span>`));
          let newDescription = el.description.replace(regex, sanitize(`<span class="SearchTerm__Highlight">${this.searchInput}</span>`));
          return {
            title: newTitle,
            description: newDescription,
            imageUrl: el.imageUrl,
            id: el.id
          }
        }).slice(0, 5)
      }
    },
    userFavorites() {
      let faveCopy = [...this.$store.getters.user.favoritedProducts]
      return faveCopy.slice(-5)
    },
    products() {
      return this.$store.getters.loadedProducts
    },
    allProducts() {
      return this.$store.getters.allProducts
    }
  },
  watch: {
    badge(favoritedProducts) {
      this.isAnimated = true;
      setTimeout(() => this.isAnimated = false, 1000)
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    goToProfile() {
      this.$router.push('/profile')
    },
    onSearch() {
      this.$store.dispatch('searchProduct', this.searchInput)
    },
    goToProduct(id) {
      this.$router.push(`/products/${id}`)
    },
    async reloadProducts() {
      await this.$store.dispatch('setResultsLog', false)
      await this.$store.dispatch('removeProducts', [])
      await this.$store.dispatch('loadProducts', 3);
      await this.$router.push('/products')
    },
    async goToResult(id) {
      await this.$store.dispatch('loadProduct', id)
      setTimeout(() => this.$router.push(`/products/${id}`), 0)
    },
  },
  created() {
    this.$store.dispatch('loadProducts', 3)
  }
}
</script>

<style>
  #Card__Favorites {
    position: absolute;
    transition: all 0.5s;
    width: 200px;
    z-index: 8;
    top: 100%;
    transform: translateX(-160px);
  }

  #Card__Search {
    position: absolute;
    transition: all 0.5s;
    width: 100vw;
    z-index: 8;
    top: 100%;
    left: 0%;
  }

  .SearchTerm__Highlight {
    color:#ffc600;
  }
 
  .Card__Favorites--Image__Container {
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }
  
  .Card__Favorites--Image {
    max-width: 100%;
    max-height: 100%; 
  }

  .animate {
    animation: bounce 1s both;
  }

  @keyframes bounce {
  0%,100%,20%,53%,80% {
    transform: translate3d(0,0,0)
  }

  40%,43% {
    transform: translate3d(0,-20px,0)
  }

  70% {
    transform: translate3d(0,-10px,0)
  }

  90% {
    transform: translate3d(0,-4px,0)
  }
}
</style>