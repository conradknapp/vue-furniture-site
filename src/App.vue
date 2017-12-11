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
    v-toolbar(fixed class="deep-purple darken-2" dark)
      v-toolbar-side-icon(@click.native.stop="sideNav = !sideNav" class="hidden-md-and-up")
      v-toolbar-title#main-title 
        router-link(to="/" tag="span" style="cursor: pointer") MCM & More
      v-spacer(class="hidden-lg-and-down")
      v-text-field(@blur="searchInput = ''" flex color="pink lighten-1" width="300px" prepend-icon="search" placeholder="Search any style" v-model="searchInput" @input="onSearch" single-line hide-details).ml-4.mr-2
      v-card(dark v-if="onSearchResults")#card
        v-list
          v-list-tile(@click="searchInput = ''" :to="'/products/' + result.id" v-for="result in onSearchResults" :key="result.title")
            v-list-tile-title {{result.title}} | {{result.description.slice(0,50)}}...
            v-list-tile-action(v-if="userIsAuthenticated && userFavorites.includes(result.id)") 
              v-icon favorite
      v-toolbar-items(@mouseenter="showFave = true" @mouseleave="showFave = false").hidden-sm-and-down
        v-btn(flat :to="item.link" v-for="item in menuItems" :key="item.title") 
            v-icon(left) {{item.icon}}
            | {{item.title}}
        v-btn(flat router to='/profile' v-if="userIsAuthenticated")
          v-badge(color="blue")
            span(slot="badge" v-if="badgeNumber") {{badgeNumber}}
            v-icon(left) account_box
            | Profile
        v-layout(row wrap @mouseenter="showFave = true" @mouseleave="showFave = false")
          v-flex
            v-card(v-if="showFave && userIsAuthenticated")#profile-card
              v-list(three-line).mt-2
                v-list-tile.ml-1.mb-3(v-if="showFave && userFavorites.includes(product.id)" v-for="product in products" :key="product.title")
                  v-list-tile-content(@click="goToProduct(product.id)").imgContainer
                    img(:src="product.imageUrl").faveImg
                //- v-list-tile-content
                //-   img(height="90px" width="130px" :src="product.imageUrl" @click="goToProduct(product.id)").profile
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
        showFave: false
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
            // { icon: 'home', title: 'Home Page', link: '/' },
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
        } else {
          return this.$store.getters.searchResults.slice(0,5)
        }
      },
      userFavorites() {
        // need to return the most recent five (slice(0,5) and sorted by date they were fav)orited)
        return this.$store.getters.user.favoritedProducts.slice(0,5)
      },
      products() {
        return this.$store.getters.loadedProducts
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
      },
      onSearch() {
        this.$store.dispatch('searchProduct', this.searchInput)
      },
      goToProduct(id) {
        this.$router.push('/products/' + id)
      }
    }
  }
</script>

<style>

  .profile {
    transform: translateX(-13px);
  }
 
  .imgContainer {
    display: flex;
    align-items: center;
    flex-direction: column;
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

  #profile-card {
    position: absolute;
    overflow: auto;
    transition: all 0.5s;
    width: 200px;
    z-index: 8;
    top: 100%;
    transform: translateX(-160px)
  }

  #app {
    background-color: #ddccff;
  }
</style>