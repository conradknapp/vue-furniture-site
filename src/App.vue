<template lang="pug">
  v-app#app
    v-navigation-drawer(temporary overflow absolute v-model="sideNav")
      v-list
        v-list-tile(v-for="item in menuItems" :key="item.title" :to="item.link")
          v-list-tile-action
            v-icon {{item.icon}}
          v-list-tile-content {{item.title}}
        v-list-tile(v-if="userIsAuthenticated" @click="onLogout")
          v-list-tile-action
            v-icon exit_to_app
          v-list-tile-content Logout
    v-toolbar(fixed class="deep-purple darken-2" dark)#toolbar
      v-toolbar-side-icon(@click.native.stop="sideNav = !sideNav" class="hidden-md-and-up")
      v-toolbar-title#main-title 
        router-link(to="/" tag="span" style="cursor: pointer") MCM & More
      v-spacer(class="hidden-xs-only")
      v-text-field(@blur="searchInput = ''" flex color="pink lighten-1" width="300px" prepend-icon="search" placeholder="Search styles" v-model="searchInput" @input="onSearch" single-line hide-details).ml-4.mr-2
      v-card(dark v-if="onSearchResults")#card
        v-list
          v-list-tile(@click="goToResult(result.id)" v-for="result in onSearchResults" :key="result.title")
            v-list-tile-title(v-html="`${result.title}`") 
            v-list-tile-action(v-if="userIsAuthenticated && userFavorites.includes(result.id)") 
              v-icon favorite
      v-toolbar-items
        //- v-btn(flat :to="item.link" v-for="item in menuItems" :key="item.title") 
        //-   span(@click="reload")#click
        //-   v-icon(left) {{item.icon}
        //-   | {{item.title}}
        v-btn(flat router @click="reload").hidden-xs-only
          v-icon(left).hidden-sm-and-down weekend
          | Products
        v-btn(flat @mouseenter="showFave = true" @mouseleave="showFave = false" @click="goToProfile" v-if="userIsAuthenticated")#profile-btn
          v-badge(color="blue")
            span(slot="badge" v-if="badgeNumber") {{badgeNumber}}
            v-icon(left) account_box
            | Profile
        v-layout
          v-flex
            v-card(v-if="showFave && userIsAuthenticated" @mouseover="showFave = true" @mouseleave="showFave = false")#profile-card
              v-list(three-line).mt-2
                v-list-tile.ml-1.mb-3(v-if="showFave && userFavorites.includes(product.id)" v-for="product in allProducts" :key="product.title")
                  v-list-tile-content(@click="goToResult(product.id)").imgContainer
                    img(:src="product.imageUrl").faveImg
        v-btn(flat v-if="userIsAuthenticated" @click="onLogout")
          v-icon(left) exit_to_app
          | Logout
    main
      router-view
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false,
        searchInput: '',
        showFave: true,
        something: '',
        opacityNum: 0
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
            { icon: 'weekend', title: 'Products', link: '/products' }
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
        return this.$store.getters.user.id === "XipYk5fNEUc1F0U5qppRHMjcTQx2"
      },
      badgeNumber() {
        return this.$store.getters.user.favoritedProducts.length
      },
      onSearchResults() {
        if (this.searchInput === '') {
          return
        } else if (!this.$store.getters.searchResults.length) {
          return [{title: `No results for ${this.searchInput}`, description: ``}]
        } else {
          return this.$store.getters.searchResults.map(el => {
            let regex = new RegExp(this.searchInput, 'gi');
            let newTitle = el.title.replace(regex, `<span class="hl">${this.searchInput}</span>`);
            let newDesc = el.description.replace(regex, `<span class="hl">${this.searchInput}</span>`);
            return {
              title: newTitle,
              description: newDesc,
              imageUrl: el.imageUrl,
              id: el.id
            }
          }).slice(0, 5)
          // return this.$store.getters.searchResults.slice(0, 5);
        }
      },
      userFavorites() {
        // need to return the most recent five (slice(0,5) and sorted by date they were favorited)
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
        this.$router.push('/products/' + id)
      },
      async reload() {
        // this.$store.dispatch('setFlag', true)
        this.$store.dispatch('setResultsLog', false)
        this.$store.dispatch('removeProducts', [])
        await this.$store.dispatch('loadProducts', 3);
        await this.$router.push('/products')
     },
      goToResult(id) {
        this.$store.dispatch('loadProduct', id)
        this.$router.push('/products/' + id)
      },
    },
    created() {
      this.$store.dispatch('loadProducts', 3)
    }
  }
</script>

<style>
  #products {
    z-index: 5;
  }

  #profile-card {
    position: absolute;
    overflow: auto;
    transition: all 0.5s;
    width: 200px;
    z-index: 8;
    top: 100%;
    transform: translateX(-160px);
  }

  #toolbar {
    opacity: 0.92;
  }

  #toolbar:hover {
    opacity: 1;
  }

  .profile {
    transform: translateX(-13px);
  }

  .hl {
    color:#ffc600;
  }
 
  .imgContainer {
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }
  
  .faveImg {
    max-width:100%;
    max-height:100%; 
  }

  #main-title {
    font-family: sans-serif;
    font-weight: 100;
  }

  #card {
    position: absolute;
    overflow: hidden;
    transition: all 0.5s;
    width: 100%;
    z-index: 8;
    top: 100%;
  }

  #app {
    /* background-color: #ddccff; */
    background-image: linear-gradient(rgba(135, 60, 255, 0.2), rgba(135, 60, 255, 0.0) 80%), linear-gradient(-45deg, rgb(221,200,255) 25%, rgba(255, 208, 65, 0.8) 75%);
  }
</style>